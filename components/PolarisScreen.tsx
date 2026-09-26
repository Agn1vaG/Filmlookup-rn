import React, { ReactNode } from "react";
import { View, ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type PolarisScreenProps = ViewProps & {
  children: ReactNode;
  edges?: ("top" | "right" | "bottom" | "left")[];
  className?: string;
};

export default function PolarisScreen({
  children,
  edges = ["top", "left", "right"],
  className = "",
  ...props
}: PolarisScreenProps) {
  return (
    <SafeAreaView
      edges={edges}
      className={`flex-1 ${className}`}
    >
      <View className="flex-1" {...props}>
        {children}
      </View>
    </SafeAreaView>
  );
}