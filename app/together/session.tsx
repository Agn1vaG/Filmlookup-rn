import PolarisText from "@/components/PolarisText";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

export default function TogetherSession() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const { code } = useLocalSearchParams<{
    code?: string;
  }>();

  // UI placeholder for now.
  // This will eventually come from the backend.
  const sessionCode = code || "7K4M-92";

  const isSmallScreen = width < 360;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join my Polaris Together session.\n\nSession code: ${sessionCode}\n\nEnter this code in Polaris to join us.`,
      });
    } catch (error) {
      console.error("Failed to share session code:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingHorizontal: isSmallScreen ? 20 : 24,
          },
        ]}
      >
        {/* HEADER */}
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressedSmall,
            ]}
          >
            <Ionicons
              name="arrow-back"
              size={23}
              color="#F4F7FA"
            />
          </Pressable>

          <PolarisText
            weight="medium"
            style={styles.topTitle}
          >
            Together
          </PolarisText>

          <View style={styles.topSpacer} />
        </View>

        {/* HEADER */}
        <View style={styles.header}>
          <PolarisText
            weight="regular"
            style={[
              styles.title,
              {
                fontSize: isSmallScreen ? 39 : 43,
              },
            ]}
          >
            Your session
          </PolarisText>

          <PolarisText
            weight="regular"
            style={styles.subtitle}
          >
            Share the code with the people you want to
            discover movies with.
          </PolarisText>
        </View>

        {/* CODE CARD */}
        <View style={styles.codeCard}>
          <PolarisText
            weight="medium"
            style={styles.codeLabel}
          >
            SESSION CODE
          </PolarisText>

          <PolarisText
            weight="medium"
            style={[
              styles.sessionCode,
              {
                fontSize: isSmallScreen ? 34 : 40,
              },
            ]}
          >
            {sessionCode}
          </PolarisText>

          <PolarisText
            weight="regular"
            style={styles.codeHint}
          >
            Enter this code on another device to join.
          </PolarisText>

          <Pressable
            onPress={handleShare}
            style={({ pressed }) => [
              styles.shareButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name="share-outline"
              size={21}
              color="#F4F7FA"
            />

            <PolarisText
              weight="medium"
              style={styles.shareButtonText}
            >
              Share Code
            </PolarisText>
          </Pressable>
        </View>

        {/* WAITING STATE */}
        <View style={styles.waitingCard}>
          <View style={styles.waitingIcon}>
            <Ionicons
              name="people-outline"
              size={28}
              color="#F4F7FA"
            />
          </View>

          <View style={styles.waitingCopy}>
            <PolarisText
              weight="medium"
              style={styles.waitingTitle}
            >
              Waiting for someone to join
            </PolarisText>

            <PolarisText
              weight="regular"
              style={styles.waitingSubtitle}
            >
              Once they join, you can start finding
              movies that align with your group.
            </PolarisText>
          </View>
        </View>

        {/* HOW IT WORKS */}
        <View style={styles.howCard}>
          <View style={styles.howHeader}>
            <View style={styles.headerLine} />

            <PolarisText
              weight="medium"
              style={styles.howTitle}
            >
              WHAT HAPPENS NEXT
            </PolarisText>

            <View style={styles.headerLine} />
          </View>

          <View style={styles.steps}>
            <Step
              number="1"
              icon="share-outline"
              title="Share the code"
              subtitle="Invite someone to join"
            />

            <Step
              number="2"
              icon="people-outline"
              title="They join"
              subtitle="Your shared space connects"
            />

            <Step
              number="3"
              icon="sparkles-outline"
              title="Find movies"
              subtitle="Discover what you both like"
            />
          </View>
        </View>

        {/* CANCEL */}
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.cancelButton,
            pressed && styles.pressedSmall,
          ]}
        >
          <PolarisText
            weight="medium"
            style={styles.cancelText}
          >
            Cancel
          </PolarisText>
        </Pressable>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

function Step({
  number,
  icon,
  title,
  subtitle,
}: {
  number: string;
  icon:
    | "share-outline"
    | "people-outline"
    | "sparkles-outline";
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.step}>
      <View style={styles.stepIcon}>
        <Ionicons
          name={icon}
          size={23}
          color="#F4F7FA"
        />
      </View>

      <PolarisText
        weight="medium"
        style={styles.stepTitle}
      >
        {number}. {title}
      </PolarisText>

      <PolarisText
        weight="regular"
        style={styles.stepSubtitle}
      >
        {subtitle}
      </PolarisText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#06090E",
  },

  content: {
    paddingTop: 52,
    paddingBottom: 35,
  },

  topBar: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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

  topTitle: {
    color: "#AAB5C4",
    fontSize: 14,
    letterSpacing: 0.4,
  },

  topSpacer: {
    width: 44,
  },

  header: {
    marginTop: 48,
  },

  title: {
    color: "#F4F7FA",
    lineHeight: 52,
    letterSpacing: -0.8,
  },

  subtitle: {
    color: "#8994A3",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 7,
    maxWidth: 350,
  },

  codeCard: {
    marginTop: 32,
    padding: 24,
    borderRadius: 25,
    alignItems: "center",
    backgroundColor: "#0B1420",
    borderWidth: 1,
    borderColor: "rgba(143, 184, 232, 0.20)",
  },

  codeLabel: {
    color: "#7E8997",
    fontSize: 10,
    letterSpacing: 2,
  },

  sessionCode: {
    color: "#DCEBFF",
    letterSpacing: 4,
    marginTop: 16,
  },

  codeHint: {
    color: "#7E8997",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 10,
  },

  shareButton: {
    width: "100%",
    height: 56,
    marginTop: 22,
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    backgroundColor: "#17263B",
    borderWidth: 1,
    borderColor: "rgba(143, 184, 232, 0.50)",
  },

  shareButtonText: {
    color: "#F4F7FA",
    fontSize: 15,
  },

  waitingCard: {
    marginTop: 18,
    padding: 19,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0B1420",
    borderWidth: 1,
    borderColor: "rgba(220, 235, 255, 0.08)",
  },

  waitingIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111D2D",
    borderWidth: 1,
    borderColor: "rgba(143, 184, 232, 0.25)",
  },

  waitingCopy: {
    flex: 1,
    marginLeft: 15,
  },

  waitingTitle: {
    color: "#F4F7FA",
    fontSize: 14,
  },

  waitingSubtitle: {
    color: "#7E8997",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },

  howCard: {
    marginTop: 18,
    padding: 20,
    borderRadius: 25,
    backgroundColor: "#0B1420",
    borderWidth: 1,
    borderColor: "rgba(220, 235, 255, 0.08)",
  },

  howHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },

  headerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(220, 235, 255, 0.12)",
  },

  howTitle: {
    color: "#7F8A99",
    fontSize: 9,
    letterSpacing: 1.8,
  },

  steps: {
    flexDirection: "row",
    gap: 8,
    marginTop: 26,
  },

  step: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
  },

  stepIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111D2D",
    borderWidth: 1,
    borderColor: "rgba(143, 184, 232, 0.22)",
  },

  stepTitle: {
    color: "#F4F7FA",
    fontSize: 11,
    textAlign: "center",
    marginTop: 11,
  },

  stepSubtitle: {
    color: "#7E8997",
    fontSize: 9,
    lineHeight: 14,
    textAlign: "center",
    marginTop: 5,
  },

  cancelButton: {
    height: 50,
    marginTop: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelText: {
    color: "#687482",
    fontSize: 13,
  },

  pressed: {
    opacity: 0.68,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  pressedSmall: {
    opacity: 0.65,
  },

  bottomSpacer: {
    height: 60,
  },
});