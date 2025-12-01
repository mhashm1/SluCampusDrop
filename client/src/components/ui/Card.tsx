import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { cn } from "../../lib/cn";

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padding?: number;
  elevated?: boolean;
  className?: string;
};

const Card = React.forwardRef<View, Props>(
  ({ children, style, padding = 20, elevated = true, className }, ref) => {
    const paddingStyle = padding ? { padding } : undefined;

    return (
      <View
        ref={ref}
        className={cn(
          "rounded-3xl border border-zinc-100 bg-white",
          elevated ? "shadow-xl shadow-indigo-500/30" : "",
          className
        )}
        style={[paddingStyle, style]}
      >
        {children}
      </View>
    );
  }
);

Card.displayName = "Card";

export default Card;
