import React from "react";
import { Platform, Pressable, Text, View } from "react-native";
import Button from "./ui/Button";
import { cn } from "../lib/cn";

type Props = {
  label?: string;
  helper?: string;
  fileName?: string;
  onPick?: () => void;
  onClear?: () => void;
};

const FilePicker: React.FC<Props> = ({
  label = "Select a file",
  helper = "Tap to browse files or drag & drop (web)",
  fileName,
  onPick,
  onClear,
}) => {
  return (
    <Pressable
      accessibilityRole={Platform.OS === "web" ? undefined : "button"}
      onPress={onPick}
      className={cn(
        "rounded-3xl border-2 border-dashed border-indigo-100 bg-white p-6",
        "shadow-xl shadow-indigo-500/20 transition-all"
      )}
      style={({ pressed }) =>
        pressed
          ? {
              transform: [{ scale: 0.99 }],
              borderColor: "#4F46E5",
            }
          : undefined
      }
    >
      <View className="items-center gap-3">
        <View className="rounded-full bg-indigo-50 px-4 py-1.5">
          <Text className="font-semibold uppercase tracking-wide text-indigo-600">
            Drop Zone
          </Text>
        </View>
        <Text className="text-xl font-extrabold tracking-tight text-zinc-900">
          {label}
        </Text>
        <Text className="px-3 text-center text-sm font-medium text-zinc-500">
          {helper}
        </Text>
        {fileName ? (
          <Text
            className="text-base font-semibold text-zinc-900"
            numberOfLines={1}
          >
            {fileName}
          </Text>
        ) : null}

        <View className="flex-row flex-wrap items-center justify-center gap-3 pt-2">
          <Button title="Choose file" onPress={onPick} />
          {fileName && onClear ? (
            <Button variant="ghost" title="Clear" onPress={onClear} />
          ) : null}
        </View>
      </View>
    </Pressable>
  );
};

export default FilePicker;
