import PolarisText from "@/components/PolarisText";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useState } from "react";

export default function EnterCode() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const continueWithCode = () => {
    if (!code.trim()) {
      return;
    }

    router.push({
      pathname: "/together/session",
      params: {
        code: code.trim().toUpperCase(),
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#F4F7FA"
          />
        </Pressable>

        <View style={styles.header}>
          <PolarisText
            weight="regular"
            style={styles.title}
          >
            Enter Code
          </PolarisText>

          <PolarisText
            weight="regular"
            style={styles.subtitle}
          >
            Enter the code shared with you to join
            a Together space.
          </PolarisText>
        </View>

        <View style={styles.form}>
          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="ENTER CODE"
            placeholderTextColor="#667181"
            autoCapitalize="characters"
            autoCorrect={false}
            autoFocus
            style={styles.input}
          />

          <Pressable
            onPress={continueWithCode}
            disabled={!code.trim()}
            style={({ pressed }) => [
              styles.continueButton,
              !code.trim() && styles.disabledButton,
              pressed && code.trim() && styles.pressed,
            ]}
          >
            <PolarisText
              weight="medium"
              style={styles.continueText}
            >
              Continue
            </PolarisText>

            <Ionicons
              name="arrow-forward"
              size={21}
              color="#F4F7FA"
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#06090E",
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 55,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0B1420",
    borderWidth: 1,
    borderColor: "rgba(220, 235, 255, 0.10)",
  },

  header: {
    marginTop: 55,
  },

  title: {
    color: "#F4F7FA",
    fontSize: 46,
    lineHeight: 55,
  },

  subtitle: {
    color: "#8994A3",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 9,
    maxWidth: 350,
  },

  form: {
    marginTop: 42,
  },

  input: {
    width: "100%",
    height: 62,
    borderRadius: 18,
    paddingHorizontal: 20,
    color: "#F4F7FA",
    fontSize: 18,
    letterSpacing: 2,
    backgroundColor: "#0B1420",
    borderWidth: 1,
    borderColor: "rgba(143, 184, 232, 0.40)",
  },

  continueButton: {
    width: "100%",
    height: 60,
    borderRadius: 18,
    marginTop: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#17263B",
    borderWidth: 1,
    borderColor: "rgba(143, 184, 232, 0.55)",
  },

  continueText: {
    color: "#F4F7FA",
    fontSize: 16,
  },

  disabledButton: {
    opacity: 0.4,
  },

  pressed: {
    opacity: 0.7,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },
});