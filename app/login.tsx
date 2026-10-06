import { login } from "@/services/auth";
import { useSession } from "@/contexts/SessionContext";
import PolarisText from "@/components/PolarisText";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

export default function Login() {
  const router = useRouter();
  const { refreshSession } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email.trim() || !password) {
      return;
    }

    try {
      setLoading(true);

      await login(email.trim(), password);

      await refreshSession();

      router.replace("/(tabs)/together");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ============================================================
            POLARIS BRANDING
        ============================================================ */}

        <View style={styles.branding}>
          <View style={styles.symbolContainer}>
            <Ionicons
              name="sparkles-outline"
              size={46}
              color="#F4F7FA"
            />
          </View>

          <PolarisText
            weight="regular"
            className="text-white"
            style={styles.wordmark}
          >
            POLARIS
          </PolarisText>

          <PolarisText
            weight="regular"
            className="text-[#B8C1CC]"
            style={styles.tagline}
          >
            WHERE STORIES ALIGN.
          </PolarisText>
        </View>

        {/* ============================================================
            LOGIN CARD
        ============================================================ */}

        <View style={styles.card}>
          <PolarisText
            weight="regular"
            className="text-white"
            style={styles.heading}
          >
            Welcome Back
          </PolarisText>

          <PolarisText
            weight="regular"
            className="text-[#7E8997]"
            style={styles.subtitle}
          >
            Sign in to continue your movie journey.
          </PolarisText>

          {/* EMAIL */}

          <View style={styles.inputWrapper}>
            <Ionicons
              name="mail-outline"
              size={24}
              color="#E7EDF5"
              style={styles.inputIcon}
            />

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#697484"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              style={styles.input}
            />
          </View>

          {/* PASSWORD */}

          <View style={styles.inputWrapper}>
            <Ionicons
              name="lock-closed-outline"
              size={24}
              color="#E7EDF5"
              style={styles.inputIcon}
            />

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#697484"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              style={styles.input}
            />

            <Pressable
              onPress={() => setShowPassword((current) => !current)}
              hitSlop={12}
              style={styles.eyeButton}
            >
              <Ionicons
                name={
                  showPassword
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={24}
                color="#D8E0EA"
              />
            </Pressable>
          </View>

          {/* FORGOT PASSWORD */}

          <Pressable
            onPress={() => {}}
            style={styles.forgotButton}
          >
            <PolarisText
              weight="regular"
              className="text-[#9BA6B5]"
              style={styles.forgotText}
            >
              Forgot Password?
            </PolarisText>
          </Pressable>

          {/* SIGN IN */}

          <Pressable
            onPress={submit}
            disabled={loading}
            style={({ pressed }) => [
              styles.signInButton,
              pressed && !loading && styles.buttonPressed,
              loading && styles.buttonDisabled,
            ]}
          >
            {loading ? (
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />
            ) : (
              <>
                <PolarisText
                  weight="semiBold"
                  className="text-white"
                  style={styles.signInText}
                >
                  Sign In
                </PolarisText>

                <Ionicons
                  name="arrow-forward"
                  size={25}
                  color="#FFFFFF"
                />
              </>
            )}
          </Pressable>

          {/* OR */}

          <View style={styles.dividerRow}>
            <View style={styles.divider} />

            <PolarisText
              weight="regular"
              className="text-[#7E8997]"
              style={styles.orText}
            >
              OR
            </PolarisText>

            <View style={styles.divider} />
          </View>

          {/* SOCIAL LOGIN */}

          <View style={styles.socialRow}>
            <Pressable
              onPress={() => {}}
              style={({ pressed }) => [
                styles.socialButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <View style={styles.googleIcon}>
                <PolarisText
                  weight="bold"
                  className="text-white"
                  style={styles.googleG}
                >
                  G
                </PolarisText>
              </View>

              <PolarisText
                weight="medium"
                className="text-white"
                style={styles.socialText}
              >
                Continue with Google
              </PolarisText>
            </Pressable>

            <Pressable
              onPress={() => {}}
              style={({ pressed }) => [
                styles.socialButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Ionicons
                name="logo-apple"
                size={22}
                color="#FFFFFF"
              />

              <PolarisText
                weight="medium"
                className="text-white"
                style={styles.socialText}
              >
                Continue with Apple
              </PolarisText>
            </Pressable>
          </View>

          {/* SIGN UP */}

          <View style={styles.signupRow}>
            <PolarisText
              weight="regular"
              className="text-[#7E8997]"
              style={styles.signupText}
            >
              Don&apos;t have an account?
            </PolarisText>

            <Pressable
              onPress={() => router.push("/signup")}
              hitSlop={8}
            >
              <PolarisText
                weight="semiBold"
                className="text-white"
                style={styles.signupLink}
              >
                Sign Up
              </PolarisText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#06090E",
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 58,
    paddingBottom: 40,
  },

  // ============================================================
  // BRANDING
  // ============================================================

  branding: {
    alignItems: "center",
    marginBottom: 42,
  },

  symbolContainer: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  wordmark: {
    fontSize: 34,
    letterSpacing: 9,
    marginLeft: 9,
  },

  tagline: {
    fontSize: 11,
    letterSpacing: 4,
    marginTop: 9,
  },

  // ============================================================
  // CARD
  // ============================================================

  card: {
    width: "88%",
    maxWidth: 390,
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 28,

    backgroundColor: "rgba(10, 17, 25, 0.78)",

    borderWidth: 1,
    borderColor: "rgba(220, 235, 255, 0.18)",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.45,
    shadowRadius: 30,
    elevation: 12,
  },

  heading: {
    fontSize: 31,
    lineHeight: 38,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 28,
  },

  // ============================================================
  // INPUTS
  // ============================================================

  inputWrapper: {
    height: 62,
    borderRadius: 20,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "rgba(4, 9, 15, 0.72)",

    borderWidth: 1,
    borderColor: "rgba(220, 235, 255, 0.15)",

    marginBottom: 14,
  },

  inputIcon: {
    marginLeft: 19,
    marginRight: 15,
  },

  input: {
    flex: 1,
    height: "100%",

    color: "#F4F7FA",

    fontFamily: "Sen",
    fontSize: 16,
    paddingVertical: 0,
  },

  eyeButton: {
    width: 52,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  // ============================================================
  // FORGOT
  // ============================================================

  forgotButton: {
    alignSelf: "flex-end",
    marginTop: 0,
    marginBottom: 24,
    paddingVertical: 4,
  },

  forgotText: {
    fontSize: 13,
  },

  // ============================================================
  // SIGN IN
  // ============================================================

  signInButton: {
    height: 58,
    borderRadius: 29,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#18283B",

    borderWidth: 1,
    borderColor: "rgba(220, 235, 255, 0.34)",

    shadowColor: "#8FB8E8",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 5,
  },

  signInText: {
    fontSize: 16,
    marginRight: 16,
  },

  buttonPressed: {
    opacity: 0.72,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  // ============================================================
  // DIVIDER
  // ============================================================

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(220, 235, 255, 0.14)",
  },

  orText: {
    fontSize: 12,
    marginHorizontal: 14,
  },

  // ============================================================
  // SOCIAL
  // ============================================================

  socialRow: {
    flexDirection: "row",
    gap: 10,
  },

  socialButton: {
    flex: 1,
    minHeight: 52,

    borderRadius: 26,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 12,

    backgroundColor: "rgba(4, 9, 15, 0.62)",

    borderWidth: 1,
    borderColor: "rgba(220, 235, 255, 0.14)",
  },

  socialText: {
    fontSize: 11,
    marginLeft: 8,
  },

  googleIcon: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  googleG: {
    fontSize: 20,
  },

  // ============================================================
  // SIGN UP
  // ============================================================

  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },

  signupText: {
    fontSize: 13,
  },

  signupLink: {
    fontSize: 13,
    marginLeft: 5,
  },
});