import React from "react";
import {
  FlatList,
  Pressable,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { cn } from "../lib/cn";

type PresenceStatus = "online" | "connecting" | "offline";

export type LobbyUser = {
  id: string;
  nickname: string;
  avatarColor?: string;
  status: PresenceStatus;
  lastSeen: number;
};

type Props = {
  users: LobbyUser[];
  onSelect?: (user: LobbyUser) => void;
  style?: StyleProp<ViewStyle>;
  emptyMessage?: string;
};

const statusColor = (status: PresenceStatus) => {
  switch (status) {
    case "online":
      return "#10B981"; // emerald
    case "connecting":
      return "#F59E0B"; // amber
    default:
      return "#EF4444"; // rose
  }
};

const initialsFrom = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

const UserList: React.FC<Props> = ({ users, onSelect, style, emptyMessage }) => {
  if (!users.length) {
    return (
      <View
        className="items-center gap-2 rounded-3xl border border-zinc-100 bg-white px-6 py-8 shadow-lg shadow-indigo-500/10"
        style={style}
      >
        <Text className="text-lg font-extrabold text-zinc-900">Nobody here yet</Text>
        <Text className="text-center text-sm font-medium text-zinc-500">
          {emptyMessage || "Stay on this screen and nearby peers will pop up."}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={[{ paddingHorizontal: 12, paddingBottom: 12 }, style]}
      columnWrapperStyle={{
        gap: 12,
        justifyContent: "space-between",
      }}
      renderItem={({ item }) => {
        const avatarBg = item.avatarColor || "#E0E7FF";
        const onlineColor = statusColor(item.status);

        return (
          <Pressable
            onPress={onSelect ? () => onSelect(item) : undefined}
            className={cn(
              "mb-3 flex-1 rounded-3xl border border-zinc-100 bg-white p-4",
              "shadow-xl shadow-indigo-500/20"
            )}
            style={({ pressed }) => [
              pressed ? { transform: [{ translateY: 2 }] } : null,
            ]}
          >
            <View
              className="mb-3 h-14 w-14 items-center justify-center rounded-2xl"
              style={{ backgroundColor: avatarBg }}
            >
              <Text className="text-lg font-extrabold text-zinc-900">
                {initialsFrom(item.nickname)}
              </Text>
            </View>
            <Text
              className="mb-1 text-base font-extrabold text-zinc-900"
              numberOfLines={1}
            >
              {item.nickname}
            </Text>
            <View className="flex-row items-center gap-2">
              <View
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: onlineColor }}
              />
              <Text className="text-sm font-medium capitalize text-zinc-500">
                {item.status}
              </Text>
            </View>
          </Pressable>
        );
      }}
    />
  );
};

export default UserList;
