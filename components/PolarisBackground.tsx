import React, { ReactNode } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";

import { images } from "@/constants/images";

type PolarisBackgroundProps = {
  children: ReactNode;
  variant?: "default" | "home" | "search" | "solo" | "together" | "profile" | "auth";
};

export default function PolarisBackground({
  children,
  variant = "default",
}: PolarisBackgroundProps) {
  return (
    <View className="flex-1 bg-background">
      {/* Deep space base */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: "#03070C",
          },
        ]}
      />

      {/* Existing celestial background */}
      <ImageBackground
        source={images.bg}
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
        imageStyle={styles.backgroundImage}
      />

      {/* Cinematic dark overlay */}
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor:
              variant === "auth"
                ? "rgba(1, 4, 9, 0.28)"
                : "rgba(1, 4, 9, 0.48)",
          },
        ]}
      />

      {/* Subtle icy-blue atmosphere */}
      <View
        pointerEvents="none"
        style={[
          styles.atmosphere,
          {
            backgroundColor: "rgba(143, 184, 232, 0.045)",
          },
        ]}
      />

      {/* Screen content */}
      <View className="flex-1">{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    opacity: 0.55,
  },

  atmosphere: {
    position: "absolute",
    width: 420,
    height: 420,
    borderRadius: 210,
    top: -250,
    right: -180,
  },
});