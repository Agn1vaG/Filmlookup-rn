import React from "react";
import {
  Text,
  TextProps,
  StyleSheet,
  TextStyle,
} from "react-native";

import { POLARIS_FONT } from "@/constants/typography";

type PolarisTextProps = TextProps & {
  children: React.ReactNode;
  weight?: "regular" | "medium" | "semiBold" | "bold" | "extraBold";
  className?: string;
};

export default function PolarisText({
  children,
  weight = "regular",
  className,
  style,
  ...props
}: PolarisTextProps) {
  const fontFamily = POLARIS_FONT[weight];

  return (
    <Text
      {...props}
      className={className}
      style={[
        styles.base,
        {
          fontFamily,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  } as TextStyle,
});