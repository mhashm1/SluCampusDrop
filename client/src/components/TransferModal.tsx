import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Modal,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Button from "./ui/Button";
import { cn } from "../lib/cn";

type TransferState = "incoming" | "sending" | "receiving" | "completed" | "error";

type Props = {
  visible: boolean;
  title?: string;
  subtitle?: string;
  fromUser?: string;
  progress?: number; // 0 - 1
  state?: TransferState;
  fileName?: string;
  onPickFile?: () => void;
  primaryLabel?: string;
  primaryDisabled?: boolean;
  onPrimary?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  onDismiss?: () => void;
};

const stateColor = (state?: TransferState) => {
  switch (state) {
    case "sending":
    case "receiving":
      return "#F59E0B"; // amber
    case "completed":
      return "#0D9488"; // teal
    case "error":
      return "#EF4444"; // rose
    default:
      return "#4F46E5"; // primary
  }
};

const TransferModal: React.FC<Props> = ({
  visible,
  title = "Transfer",
  subtitle,
  fromUser,
  progress = 0,
  state = "incoming",
  fileName,
  onPickFile,
  primaryLabel,
  primaryDisabled,
  onPrimary,
  secondaryLabel,
  onSecondary,
  onDismiss,
}) => {
  const slide = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 640;

  useEffect(() => {
    Animated.spring(slide, {
      toValue: visible ? 1 : 0,
      useNativeDriver: false,
      damping: 18,
      stiffness: 180,
    }).start();
  }, [visible, slide]);

  const translateY = slide.interpolate({
    inputRange: [0, 1],
    outputRange: [320, 0],
  });

  const pct = Math.min(Math.max(progress, 0), 1);
  const percentLabel = useMemo(() => `${Math.round(pct * 100)}%`, [pct]);

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onDismiss}
    >
      <View className="flex-1 justify-end bg-slate-900/50">
        <Pressable
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
          onPress={onDismiss}
        />
        <Animated.View
          className={cn(
            "w-full gap-4 border border-zinc-100 bg-white px-6 py-5 shadow-2xl shadow-indigo-500/30",
            isSmallScreen ? "rounded-t-3xl min-h-[55vh]" : "mx-auto mb-6 w-[480px] rounded-3xl"
          )}
          style={{ transform: [{ translateY }] }}
        >
          <View className="mx-auto h-1 w-14 rounded-full bg-zinc-200" />
          <View className="gap-1">
            <Text className="text-2xl font-extrabold tracking-tight text-zinc-900">
              {title}
            </Text>
            {fromUser ? (
              <Text className="text-sm font-medium text-zinc-500">
                From {fromUser}
              </Text>
            ) : null}
            {subtitle ? (
              <Text className="text-base font-medium text-zinc-600">
                {subtitle}
              </Text>
            ) : null}
          </View>

          <View className="gap-3">
            {onPickFile ? (
              <Pressable
                accessibilityRole="button"
                onPress={onPickFile}
                className="rounded-2xl border-2 border-dashed border-indigo-100 bg-white px-4 py-3 shadow-inner shadow-indigo-500/10"
              >
                <Text className="text-sm font-semibold text-zinc-900">
                  {fileName || "Tap to choose a file"}
                </Text>
                {fileName ? null : (
                  <Text className="text-xs font-medium text-zinc-500">
                    Select a file to enable Send
                  </Text>
                )}
              </Pressable>
            ) : null}

            <View
              className="h-3.5 w-full overflow-hidden rounded-full border bg-zinc-100"
              style={{ borderColor: stateColor(state) }}
            >
              <View
                className="h-full rounded-full"
                style={{
                  width: `${pct * 100}%`,
                  backgroundColor: stateColor(state),
                }}
              />
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm font-semibold capitalize text-zinc-900">
                {state}
              </Text>
              <Text className="text-sm font-semibold text-zinc-900">
                {percentLabel}
              </Text>
            </View>
          </View>

          <View className="flex-row flex-wrap justify-end gap-3 pt-1">
            {secondaryLabel ? (
              <Button variant="ghost" title={secondaryLabel} onPress={onSecondary} />
            ) : null}
            {primaryLabel ? (
              <Button
                title={primaryLabel}
                onPress={onPrimary}
                variant="primary"
                disabled={primaryDisabled}
              />
            ) : null}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default TransferModal;
