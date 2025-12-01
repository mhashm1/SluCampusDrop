import React from "react";
import { SafeAreaView, Text, View } from "react-native";
import type { StackScreenProps } from "@react-navigation/stack";
import QRCode from "react-native-qrcode-svg";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = StackScreenProps<RootStackParamList, "Kiosk">;

const resolveLink = () => {
  const envLink = process.env.EXPO_PUBLIC_KIOSK_URL;
  if (envLink) return envLink;

  if (typeof window !== "undefined") {
    const ip = window.location.hostname;
    if (ip) return `http://${ip}:8080`;
  }

  return "http://localhost:8080";
};

const KioskScreen: React.FC<Props> = ({ route, navigation }) => {
  const { nickname = "CampusDrop Host" } = route.params || {};
  const link = resolveLink();

  return (
    <SafeAreaView className="flex-1 bg-zinc-50">
      <View className="flex-1 items-center gap-4 px-5 py-6">
        <Text className="text-3xl font-extrabold tracking-tight text-zinc-900">
          Host Kiosk
        </Text>
        <Text className="text-center text-base font-medium text-zinc-500">
          Ask peers to scan and join your hotspot lobby instantly.
        </Text>

        <Card className="w-full max-w-xl items-center gap-4" padding={24}>
          <View className="rounded-3xl border border-zinc-100 bg-white p-4 shadow-xl shadow-indigo-500/20">
            <QRCode value={link} size={220} backgroundColor="#fff" />
          </View>
          <Text className="text-xl font-extrabold tracking-tight text-zinc-900">
            {nickname}
          </Text>
          <Text className="text-base font-semibold text-indigo-700">{link}</Text>
          <Text className="text-center text-sm font-medium text-zinc-500">
            Keep this page open. Pairing stays live while visible.
          </Text>
        </Card>

        <Button title="Back to Lobby" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
};

export default KioskScreen;
