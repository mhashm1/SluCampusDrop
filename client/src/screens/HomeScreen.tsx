import React, { useMemo, useState } from "react";
import { SafeAreaView, Text, TextInput, View } from "react-native";
import type { StackScreenProps } from "@react-navigation/stack";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = StackScreenProps<RootStackParamList, "Home">;

const colorPalette = ["#EEF2FF", "#E0F2FE", "#FCE7F3", "#FEF3C7", "#DCFCE7"];

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [nickname, setNickname] = useState("");

  const avatarColor = useMemo(
    () => colorPalette[Math.floor(Math.random() * colorPalette.length)],
    []
  );

  const canContinue = nickname.trim().length > 1;

  return (
    <SafeAreaView className="flex-1 bg-zinc-50">
      <View className="mx-auto flex w-full max-w-3xl flex-1 gap-5 px-5 py-6 sm:px-8">
        <View className="gap-2">
          <Text className="text-4xl font-extrabold tracking-tight text-zinc-900">
            CampusDrop
          </Text>
          <Text className="text-base font-medium text-zinc-500">
            Share files instantly over local Wi‑Fi. No installs. No sign-ups.
          </Text>
        </View>

        <Card className="gap-4" padding={24}>
          <View className="gap-2">
            <Text className="text-base font-extrabold text-zinc-900">Your nickname</Text>
            <TextInput
              placeholder="e.g. Alex in Library"
              placeholderTextColor="#9CA3AF"
              className="h-14 rounded-2xl border-2 border-zinc-100 bg-white px-4 text-lg font-semibold text-zinc-900 focus:border-indigo-500"
              value={nickname}
              onChangeText={setNickname}
              autoCapitalize="words"
              autoCorrect={false}
            />
            <Text className="text-sm font-medium text-zinc-500">
              Peers will see this in the lobby radar.
            </Text>
          </View>

          <View className="flex-row flex-wrap gap-3">
            <Button
              title="Enter Lobby"
              onPress={() =>
                navigation.navigate("Lobby", { nickname: nickname.trim(), avatarColor })
              }
              disabled={!canContinue}
            />
            <Button
              variant="ghost"
              title="Host Kiosk"
              onPress={() =>
                navigation.navigate("Kiosk", {
                  nickname: nickname.trim() || "CampusDrop",
                })
              }
            />
          </View>
        </Card>

        <Text className="text-center text-sm font-medium text-zinc-500">
          Works best on the same Wi‑Fi / hotspot. Keep this tab active.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
