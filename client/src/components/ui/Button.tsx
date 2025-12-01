import React from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
  View,
} from "react-native";
import { cn } from "../../lib/cn";

type ButtonVariant = "primary" | "ghost";

type Props = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
} & Pick<PressableProps, "style" | "testID">;

const Button: React.FC<Props> = ({
  title,
  onPress,
  disabled,
  loading,
  variant = "primary",
  style,
  testID,
}) => {
  const isDisabled = disabled || loading;
  const isPrimary = variant === "primary";

  return (
    <Pressable
      accessibilityRole="button"
      testID={testID}
      disabled={isDisabled}
      onPress={isDisabled ? undefined : onPress}
      className={cn(
        "h-14 min-w-[140px] flex-row items-center justify-center rounded-full px-6",
        "shadow-lg shadow-indigo-500/30 transition-all active:scale-95",
        isPrimary
          ? "bg-indigo-600 active:bg-indigo-700"
          : "border border-zinc-200 bg-white",
        isDisabled && "opacity-60"
      )}
      style={({ pressed }) => [
        pressed && !isDisabled ? { transform: [{ scale: 0.98 }] } : null,
        style,
      ]}
    >
      <View className="flex-row items-center gap-2">
        {loading ? (
          <ActivityIndicator
            size="small"
            color={isPrimary ? "#fff" : "#4F46E5"}
          />
        ) : (
          <Text
            className={cn(
              "text-base font-extrabold tracking-tight",
              isPrimary ? "text-white" : "text-indigo-700",
              isDisabled && "text-zinc-400"
            )}
          >
            {title}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

export default Button;
