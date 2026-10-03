import React, { ReactNode } from "react";

import {
  ImageBackground,
  StyleSheet,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

type PolarisBackgroundProps = {
  children: ReactNode;

  variant?:
    | "default"
    | "home"
    | "search"
    | "solo"
    | "together"
    | "profile"
    | "auth";

  posterPath?: string | null;
};

export default function PolarisBackground({
  children,
  variant = "default",
  posterPath = null,
}: PolarisBackgroundProps) {
  const isHome = variant === "home";

  const posterUri = posterPath
    ? `https://image.tmdb.org/t/p/w780${posterPath}`
    : null;

  return (
    <View style={styles.container}>

      {isHome && posterUri ? (
        <>
          {/* BLURRED POSTER */}

          <ImageBackground
            source={{ uri: posterUri }}
            resizeMode="cover"
            blurRadius={70}
            style={styles.posterBackground}
            imageStyle={styles.posterImage}
          />

          {/* DARK WASH */}

          <View
            pointerEvents="none"
            style={styles.posterDarkOverlay}
          />

          {/* VERY SOFT ATMOSPHERIC FADE */}

          <LinearGradient
            pointerEvents="none"
            colors={[
              "rgba(11,12,15,0)",
              "rgba(11,12,15,0.015)",
              "rgba(11,12,15,0.04)",
              "rgba(11,12,15,0.09)",
              "rgba(11,12,15,0.18)",
              "rgba(11,12,15,0.32)",
              "rgba(11,12,15,0.52)",
              "rgba(11,12,15,0.72)",
              "rgba(11,12,15,0.88)",
              "#0B0C0F",
            ]}
            locations={[
              0.38,
              0.46,
              0.54,
              0.62,
              0.70,
              0.78,
              0.85,
              0.92,
              0.97,
              1,
            ]}
            style={styles.fadeGradient}
          />
        </>
      ) : (
        <View style={styles.solidBackground} />
      )}

      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0C0F",
  },

  solidBackground: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#0B0C0F",
  },

  posterBackground: {
    ...StyleSheet.absoluteFill,
  },

  posterImage: {
    opacity: 0.48,
  },

  posterDarkOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(5, 7, 10, 0.30)",
  },

  fadeGradient: {
    ...StyleSheet.absoluteFill,
  },

  content: {
    flex: 1,
  },
});