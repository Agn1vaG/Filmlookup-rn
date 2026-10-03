import PolarisText from "@/components/PolarisText";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

export default function Together() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const isSmallScreen = width < 360;

  const openEnterCode = () => {
    router.push("/together/enter-code");
  };

  const createSession = () => {
    router.push("/together/session");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: isSmallScreen ? 20 : 24,
          },
        ]}
      >
        {/* ============================================================
            HEADER
        ============================================================ */}

        <View style={styles.header}>
          <PolarisText
            weight="regular"
            style={[
              styles.title,
              {
                fontSize: isSmallScreen ? 43 : 50,
              },
            ]}
          >
            Together
          </PolarisText>

          <PolarisText
            weight="regular"
            style={styles.subtitle}
          >
            Find movies to watch together.
          </PolarisText>
        </View>

        {/* ============================================================
            JOIN / CREATE
        ============================================================ */}

        <View style={styles.sessionCard}>
          <BlurView
            intensity={18}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />

          <View style={styles.sessionContent}>
            {/* ENTER CODE */}

            <View style={styles.actionBlock}>
              <PolarisText
                weight="regular"
                style={styles.actionLabel}
              >
                Join a shared space
              </PolarisText>

              <Pressable
                onPress={openEnterCode}
                style={({ pressed }) => [
                  styles.actionButton,
                  pressed && styles.pressed,
                ]}
              >
                <PolarisText
                  weight="medium"
                  style={styles.actionButtonText}
                >
                  Enter Code
                </PolarisText>

                <Ionicons
                  name="arrow-forward"
                  size={22}
                  color="#F4F7FA"
                />
              </Pressable>
            </View>

            {/* DIVIDER */}

            <View style={styles.divider} />

            {/* GENERATE CODE */}

            <View style={styles.actionBlock}>
              <PolarisText
                weight="regular"
                style={styles.actionLabel}
              >
                Create a shared space
              </PolarisText>

              <Pressable
                onPress={createSession}
                style={({ pressed }) => [
                  styles.generateButton,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name="add"
                  size={25}
                  color="#F4F7FA"
                />

                <PolarisText
                  weight="medium"
                  style={styles.generateText}
                >
                  Generate Code
                </PolarisText>
              </Pressable>
            </View>
          </View>
        </View>

        {/* ============================================================
            HOW IT WORKS
        ============================================================ */}

        <View style={styles.howCard}>
          <BlurView
            intensity={15}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />

          <View style={styles.howHeader}>
            <View style={styles.headerLine} />

            <PolarisText
              weight="medium"
              style={styles.howTitle}
            >
              HOW IT WORKS
            </PolarisText>

            <View style={styles.headerLine} />
          </View>

          <View
            style={[
              styles.steps,
              isSmallScreen && styles.stepsSmall,
            ]}
          >
            <Step
              icon="link-outline"
              number="1"
              title="Share code"
              subtitle="Invite someone"
            />

            <Step
              icon="people-outline"
              number="2"
              title="Find movies"
              subtitle="Align your group's taste"
            />

            <Step
              icon="sparkles-outline"
              number="3"
              title="Find your match"
              subtitle="Discover movies everyone likes"
            />
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

/* ================================================================
   STEP
================================================================ */

function Step({
  icon,
  number,
  title,
  subtitle,
}: {
  icon:
    | "link-outline"
    | "people-outline"
    | "sparkles-outline";
  number: string;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.step}>
      <View style={styles.stepIcon}>
        <Ionicons
          name={icon}
          size={25}
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

/* ================================================================
   STYLES
================================================================ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0C0F",
  },

  scrollContent: {
    paddingTop: 54,
    paddingBottom: 30,
  },

  /* ---------------------------------------------------------------
     HEADER
  --------------------------------------------------------------- */

  header: {
    marginBottom: 34,
  },

  title: {
    color: "#F4F7FA",
    lineHeight: 58,
    letterSpacing: -1,
  },

  subtitle: {
    color: "#9AA5B4",
    fontSize: 17,
    lineHeight: 24,
    marginTop: 5,
  },

  /* ---------------------------------------------------------------
     SESSION CARD
  --------------------------------------------------------------- */

  sessionCard: {
    width: "100%",
    borderRadius: 25,
    overflow: "hidden",
    backgroundColor: "#0B1420",
    borderWidth: 1,
    borderColor: "rgba(220, 235, 255, 0.08)",
  },

  sessionContent: {
    padding: 22,
  },

  actionBlock: {
    width: "100%",
  },

  actionLabel: {
    color: "#AAB5C4",
    fontSize: 14,
    marginBottom: 14,
  },

  /* ---------------------------------------------------------------
     ENTER CODE
  --------------------------------------------------------------- */

  actionButton: {
    width: "100%",
    height: 58,
    borderRadius: 17,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#070D15",
    borderWidth: 1,
    borderColor: "rgba(220, 235, 255, 0.34)",
  },

  actionButtonText: {
    color: "#F4F7FA",
    fontSize: 15,
  },

  /* ---------------------------------------------------------------
     DIVIDER
  --------------------------------------------------------------- */

  divider: {
    height: 1,
    backgroundColor: "rgba(220, 235, 255, 0.08)",
    marginVertical: 22,
  },

  /* ---------------------------------------------------------------
     GENERATE
  --------------------------------------------------------------- */

  generateButton: {
    width: "100%",
    height: 58,
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#101D2D",
    borderWidth: 1,
    borderColor: "rgba(143, 184, 232, 0.55)",
  },

  generateText: {
    color: "#F4F7FA",
    fontSize: 15,
    marginLeft: 10,
  },

  pressed: {
    opacity: 0.68,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  /* ---------------------------------------------------------------
     HOW IT WORKS
  --------------------------------------------------------------- */

  howCard: {
    width: "100%",
    marginTop: 18,
    borderRadius: 25,
    overflow: "hidden",
    backgroundColor: "#0B1420",
    borderWidth: 1,
    borderColor: "rgba(220, 235, 255, 0.08)",
    padding: 20,
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
    fontSize: 10,
    letterSpacing: 2.1,
  },

  steps: {
    flexDirection: "row",
    marginTop: 28,
    gap: 10,
  },

  stepsSmall: {
    gap: 5,
  },

  step: {
    flex: 1,
    alignItems: "center",
    minWidth: 0,
  },

  stepIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111D2D",
    borderWidth: 1,
    borderColor: "rgba(143, 184, 232, 0.25)",
  },

  stepTitle: {
    color: "#F4F7FA",
    fontSize: 12,
    textAlign: "center",
    marginTop: 12,
  },

  stepSubtitle: {
    color: "#7E8997",
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center",
    marginTop: 5,
  },

  bottomSpacer: {
    height: 100,
  },
});