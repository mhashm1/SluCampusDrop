import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import type { StackScreenProps } from "@react-navigation/stack";
import { io, Socket } from "socket.io-client";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import UserList, { LobbyUser } from "../components/UserList";
import TransferModal from "../components/TransferModal";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = StackScreenProps<RootStackParamList, "Lobby">;

const resolveSignalUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_SIGNAL_URL;
  if (envUrl) return envUrl;
  if (typeof window !== "undefined") {
    const ip = window.location.hostname;
    if (ip) return `http://${ip}:3001`;
  }
  return "http://localhost:3001";
};

const SIGNAL_URL = resolveSignalUrl();

const LobbyScreen: React.FC<Props> = ({ route, navigation }) => {
  const { nickname = "Guest", avatarColor } = route.params || {};
  const [users, setUsers] = useState<LobbyUser[]>([]);
  const [connectionState, setConnectionState] = useState<
    "connecting" | "online" | "offline"
  >("connecting");
  const [selectedUser, setSelectedUser] = useState<LobbyUser | null>(null);
  const [transferVisible, setTransferVisible] = useState(false);
  const [transferProgress, setTransferProgress] = useState(0);
  const [transferState, setTransferState] = useState<
    "incoming" | "sending" | "receiving" | "completed" | "error"
  >("sending");

  const socketRef = useRef<Socket | null>(null);
  const [pickedFileName, setPickedFileName] = useState<string | undefined>();

  useEffect(() => {
    const socket = io(SIGNAL_URL, {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnectionState("online");
      socket.emit(
        "join_lobby",
        { nickname, avatarColor },
        (res: { ok?: boolean; user?: LobbyUser; error?: string }) => {
          if (!res?.ok) {
            setConnectionState("offline");
          }
        }
      );
    });

    socket.on("connect_error", () => setConnectionState("offline"));
    socket.on("disconnect", () => setConnectionState("offline"));

    socket.on("user_list", (list: LobbyUser[]) => {
      setUsers(list);
    });
    socket.on("user_joined", (user: LobbyUser) => {
      setUsers((prev) => {
        const exists = prev.find((u) => u.id === user.id);
        if (exists) return prev;
        return [...prev, user];
      });
    });
    socket.on("user_left", (userId: string) => {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    });

    return () => {
      socket.emit("leave_lobby");
      socket.disconnect();
    };
  }, [avatarColor, nickname]);

  // Lightweight self-refresh to pull the latest roster without manual rejoin.
  useEffect(() => {
    const refresh = () => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("join_lobby", { nickname, avatarColor });
      }
    };
    const id = setInterval(refresh, 8000);
    return () => clearInterval(id);
  }, [avatarColor, nickname]);

  const statusColor = useMemo(() => {
    if (connectionState === "online") return "#0D9488"; // teal
    if (connectionState === "connecting") return "#F59E0B";
    return "#EF4444";
  }, [connectionState]);

  const handleSelectUser = useCallback((user: LobbyUser) => {
    setSelectedUser(user);
    setTransferState("sending");
    setTransferProgress(0);
    setTransferVisible(true);
  }, []);

  const mockSend = useCallback(() => {
    setTransferState("sending");
    setTransferProgress(0.25);
    const interval = setInterval(() => {
      setTransferProgress((p) => {
        if (p >= 1) {
          clearInterval(interval);
          setTransferState("completed");
          return 1;
        }
        return Math.min(p + 0.15, 1);
      });
    }, 500);
  }, []);

  const handleCloseTransfer = useCallback(() => {
    setTransferVisible(false);
    setSelectedUser(null);
    setTransferProgress(0);
    setTransferState("sending");
  }, []);

  const handlePickFile = useCallback(() => {
    // Web-friendly file chooser; fallback to demo name if unavailable
    if (typeof document !== "undefined") {
      const input = document.createElement("input");
      input.type = "file";
      input.onchange = () => {
        const file = input.files?.[0];
        if (file) {
          setPickedFileName(file.name);
        }
      };
      input.click();
      return;
    }
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-zinc-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 64, rowGap: 16 }}
      >
        <View className="flex-row items-center justify-between">
          <View className="gap-1">
            <Text className="text-3xl font-extrabold tracking-tight text-zinc-900">
              Lobby Radar
            </Text>
            <Text className="text-sm font-medium text-zinc-500">
              Who’s nearby on CampusDrop
            </Text>
          </View>
          <View className="flex-row items-center gap-2 rounded-full border border-zinc-100 bg-white px-3 py-2 shadow-md shadow-indigo-500/10">
            <View
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: statusColor }}
            />
            <Text className="text-sm font-semibold capitalize text-zinc-900">
              {connectionState}
            </Text>
          </View>
        </View>

        <Card className="mt-4 gap-3" padding={18}>
          <Text className="text-xl font-extrabold tracking-tight text-zinc-900">
            Hi, {nickname}
          </Text>
          <Text className="text-base font-medium text-zinc-500">
            Keep this tab open to stay discoverable. Select a peer to start a drop.
          </Text>
          <View className="flex-row flex-wrap gap-3">
            <Button
              title="Back Home"
              variant="ghost"
              onPress={() => navigation.navigate("Home")}
            />
            <Button title="Open Kiosk" onPress={() => navigation.navigate("Kiosk", { nickname })} />
          </View>
        </Card>

        <Card className="mt-4 gap-3" padding={16}>
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-extrabold tracking-tight text-zinc-900">
              Who’s Online
            </Text>
            <Text className="text-sm font-medium text-zinc-500">{users.length} nearby</Text>
          </View>
          <UserList
            users={users.filter((u) => u.id !== socketRef.current?.id)}
            onSelect={handleSelectUser}
            emptyMessage="Waiting for nearby devices. Leave this tab open."
          />
        </Card>

        <Card className="mt-4 gap-3" padding={16}>
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-extrabold tracking-tight text-zinc-900">
              How it works
            </Text>
          </View>
          <Text className="text-sm font-medium text-zinc-500">
            Tap a user above to choose a file and start the transfer. The file picker opens in the next step.
          </Text>
          <View className="flex-row flex-wrap gap-3">
            <Button
              variant="ghost"
              title="Refresh list"
              onPress={() => socketRef.current?.emit("join_lobby", { nickname, avatarColor })}
            />
          </View>
        </Card>
      </ScrollView>

      <TransferModal
        visible={transferVisible}
        title={selectedUser ? `Sending to ${selectedUser.nickname}` : "Transfer"}
        subtitle={pickedFileName || "Choose a file to send"}
        fromUser={nickname}
        state={transferState}
        progress={transferProgress}
        fileName={pickedFileName}
        onPickFile={handlePickFile}
        primaryLabel={transferState === "completed" ? "Close" : "Send"}
        onPrimary={
          transferState === "completed" ? handleCloseTransfer : pickedFileName ? mockSend : undefined
        }
        primaryDisabled={!pickedFileName && transferState !== "completed"}
        secondaryLabel="Cancel"
        onSecondary={handleCloseTransfer}
        onDismiss={handleCloseTransfer}
      />
    </SafeAreaView>
  );
};

export default LobbyScreen;
