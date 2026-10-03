import PolarisText from "@/components/PolarisText";
import { Ionicons } from "@expo/vector-icons";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useState } from "react";

type Filter = "for-you" | "mood" | "genre" | "saved";

export default function Solo() {
  const [activeFilter, setActiveFilter] =
    useState<Filter>("for-you");

  const selectFilter = (filter: Filter) => {
    setActiveFilter(filter);
  };

  const handlePreferences = () => {
    Alert.alert(
      "Preferences",
      "Preference setup will be added here."
    );
  };

  const handleSurpriseMe = () => {
    Alert.alert(
      "Surprise Me",
      "Your personalized surprise will appear here."
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <PolarisText
              weight="regular"
              style={styles.title}
            >
              Solo
            </PolarisText>

            <PolarisText
              weight="regular"
              style={styles.subtitle}
            >
              Movies, your way.
            </PolarisText>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.avatar,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => {}}
          >
            <Ionicons
              name="person"
              size={25}
              color="#DCEBFF"
            />
          </Pressable>
        </View>

        {/* FILTERS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          <FilterPill
            label="For You"
            active={activeFilter === "for-you"}
            onPress={() => selectFilter("for-you")}
          />

          <FilterPill
            label="By Mood"
            active={activeFilter === "mood"}
            onPress={() => selectFilter("mood")}
          />

          <FilterPill
            label="By Genre"
            active={activeFilter === "genre"}
            onPress={() => selectFilter("genre")}
          />

          <FilterPill
            label="Saved Filters"
            active={activeFilter === "saved"}
            onPress={() => selectFilter("saved")}
          />
        </ScrollView>

        {/* EMPTY STATE */}
        <View style={styles.emptySection}>
          {/* POLARIS VISUAL */}
          <View style={styles.cardStack}>
            <View
              style={[
                styles.movieCard,
                styles.backCard,
                styles.backCardOne,
              ]}
            />

            <View
              style={[
                styles.movieCard,
                styles.backCard,
                styles.backCardTwo,
              ]}
            />

            <View style={[styles.movieCard, styles.frontCard]}>
              <View style={styles.cardGlow} />

              <Ionicons
                name="sparkles"
                size={58}
                color="#F4F7FA"
              />
            </View>

            <View style={styles.orbit} />

            <View
              style={[
                styles.orbitDot,
                styles.orbitDotOne,
              ]}
            />

            <View
              style={[
                styles.orbitDot,
                styles.orbitDotTwo,
              ]}
            />

            <View
              style={[
                styles.orbitDot,
                styles.orbitDotThree,
              ]}
            />
          </View>

          {/* COPY */}
          <View style={styles.copy}>
            <PolarisText
              weight="regular"
              style={styles.emptyTitle}
            >
              Your next movie is waiting.
            </PolarisText>

            <PolarisText
              weight="regular"
              style={styles.emptyDescription}
            >
              Set your preferences or pick a mood to get
              personalized recommendations.
            </PolarisText>
          </View>

          {/* SET PREFERENCES */}
          <Pressable
            onPress={handlePreferences}
            style={({ pressed }) => [
              styles.preferenceButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <View style={styles.preferenceIcon}>
              <Ionicons
                name="options-outline"
                size={21}
                color="#F4F7FA"
              />
            </View>

            <PolarisText
              weight="medium"
              style={styles.preferenceText}
            >
              Set Your Preferences
            </PolarisText>

            <Ionicons
              name="arrow-forward"
              size={21}
              color="#DCEBFF"
            />
          </Pressable>

          {/* OR */}
          <View style={styles.orRow}>
            <View style={styles.orLine} />

            <PolarisText
              weight="regular"
              style={styles.orText}
            >
              OR
            </PolarisText>

            <View style={styles.orLine} />
          </View>

          {/* SURPRISE ME */}
          <Pressable
            onPress={handleSurpriseMe}
            style={({ pressed }) => [
              styles.surpriseButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <View style={styles.surpriseIcon}>
              <Ionicons
                name="dice-outline"
                size={24}
                color="#F4F7FA"
              />
            </View>

            <View style={styles.surpriseCopy}>
              <PolarisText
                weight="medium"
                style={styles.actionTitle}
              >
                Surprise Me
              </PolarisText>

              <PolarisText
                weight="regular"
                style={styles.actionSubtitle}
              >
                Find something new
              </PolarisText>
            </View>

            <Ionicons
              name="arrow-forward"
              size={21}
              color="#AFC9E8"
            />
          </Pressable>
        </View>

        {/* SPACE FOR CUSTOM BOTTOM NAVBAR */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

/* ================================================================
   FILTER PILL
================================================================ */

function FilterPill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.filter,
        active && styles.filterActive,
        pressed && styles.filterPressed,
      ]}
    >
      <PolarisText
        weight={active ? "medium" : "regular"}
        style={[
          styles.filterText,
          active && styles.filterTextActive,
        ]}
      >
        {label}
      </PolarisText>
    </Pressable>
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
    paddingTop: 48,
    paddingHorizontal: 24,
  },

  /* ---------------------------------------------------------------
     HEADER
  --------------------------------------------------------------- */

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 38,
  },

  title: {
    color: "#F4F7FA",
    fontSize: 54,
    lineHeight: 62,
    letterSpacing: -1.2,
  },

  subtitle: {
    color: "#9BA6B5",
    fontSize: 22,
    lineHeight: 29,
    marginTop: 3,
    letterSpacing: 0.2,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    backgroundColor: "#0B1420",
    borderWidth: 1,
    borderColor: "rgba(220, 235, 255, 0.18)",
  },

  /* ---------------------------------------------------------------
     FILTERS
  --------------------------------------------------------------- */

  filtersContent: {
    gap: 12,
    paddingRight: 8,
  },

  filter: {
    height: 58,
    minWidth: 140,
    paddingHorizontal: 22,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0B1119",
    borderWidth: 1,
    borderColor: "rgba(220, 235, 255, 0.10)",
  },

  filterActive: {
    backgroundColor: "#17263B",
    borderColor: "rgba(220, 235, 255, 0.58)",
  },

  filterPressed: {
    opacity: 0.72,
  },

  filterText: {
    color: "#8994A3",
    fontSize: 16,
  },

  filterTextActive: {
    color: "#F4F7FA",
  },

  /* ---------------------------------------------------------------
     EMPTY STATE
  --------------------------------------------------------------- */

  emptySection: {
    alignItems: "center",
    marginTop: 34,
  },

  cardStack: {
    width: 310,
    height: 440,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  movieCard: {
    position: "absolute",
    width: 185,
    height: 275,
    borderRadius: 18,
    backgroundColor: "#0D151F",
    borderWidth: 1,
    borderColor: "rgba(220, 235, 255, 0.20)",
  },

  backCard: {
    opacity: 0.65,
  },

  backCardOne: {
    transform: [
      {
        rotate: "-12deg",
      },
    ],
    left: 52,
    top: 82,
  },

  backCardTwo: {
    transform: [
      {
        rotate: "-6deg",
      },
    ],
    left: 65,
    top: 74,
  },

  frontCard: {
    alignItems: "center",
    justifyContent: "center",
    left: 73,
    top: 66,
    transform: [
      {
        rotate: "-1deg",
      },
    ],
    overflow: "hidden",
    backgroundColor: "#101A26",
  },

  cardGlow: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(150, 190, 255, 0.07)",
    shadowColor: "#FFFFFF",
    shadowOpacity: 0.20,
    shadowRadius: 45,
  },

  orbit: {
    position: "absolute",
    width: 310,
    height: 145,
    borderRadius: 155,
    borderWidth: 1,
    borderColor: "rgba(220, 235, 255, 0.26)",
    transform: [
      {
        rotate: "-9deg",
      },
    ],
  },

  orbitDot: {
    position: "absolute",
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#E9F4FF",
    shadowColor: "#FFFFFF",
    shadowOpacity: 0.65,
    shadowRadius: 10,
  },

  orbitDotOne: {
    left: 27,
    top: 270,
  },

  orbitDotTwo: {
    right: 18,
    top: 188,
  },

  orbitDotThree: {
    left: 150,
    top: 75,
    width: 7,
    height: 7,
  },

  /* ---------------------------------------------------------------
     COPY
  --------------------------------------------------------------- */

  copy: {
    alignItems: "center",
    paddingHorizontal: 12,
    marginTop: 4,
    marginBottom: 30,
  },

  emptyTitle: {
    color: "#F4F7FA",
    fontSize: 27,
    lineHeight: 34,
    textAlign: "center",
  },

  emptyDescription: {
    color: "#8E99A8",
    fontSize: 16,
    lineHeight: 25,
    textAlign: "center",
    marginTop: 10,
    maxWidth: 360,
  },

  /* ---------------------------------------------------------------
     SET PREFERENCES
  --------------------------------------------------------------- */

  preferenceButton: {
    width: "100%",
    height: 60,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 17,
    backgroundColor: "#17263B",
    borderWidth: 1,
    borderColor: "rgba(143, 184, 232, 0.55)",
  },

  preferenceIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(220, 235, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(220, 235, 255, 0.12)",
  },

  preferenceText: {
    flex: 1,
    color: "#F4F7FA",
    fontSize: 15,
    marginLeft: 13,
  },

  /* ---------------------------------------------------------------
     SURPRISE ME
  --------------------------------------------------------------- */

  surpriseButton: {
    width: "100%",
    height: 68,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 17,
    backgroundColor: "#0B1420",
    borderWidth: 1,
    borderColor: "rgba(220, 235, 255, 0.14)",
  },

  surpriseIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111D2D",
    borderWidth: 1,
    borderColor: "rgba(143, 184, 232, 0.20)",
  },

  surpriseCopy: {
    flex: 1,
    marginLeft: 13,
  },

  actionTitle: {
    color: "#F4F7FA",
    fontSize: 15,
  },

  actionSubtitle: {
    color: "#7E8997",
    fontSize: 13,
    marginTop: 3,
  },

  /* ---------------------------------------------------------------
     OR
  --------------------------------------------------------------- */

  orRow: {
    width: "78%",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 17,
  },

  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(220, 235, 255, 0.14)",
  },

  orText: {
    color: "#8994A3",
    fontSize: 12,
    marginHorizontal: 14,
  },

  /* ---------------------------------------------------------------
     PRESS STATES
  --------------------------------------------------------------- */

  buttonPressed: {
    opacity: 0.72,
    transform: [
      {
        scale: 0.985,
      },
    ],
  },

  /* ---------------------------------------------------------------
     NAVBAR SPACE
  --------------------------------------------------------------- */

  bottomSpacer: {
    height: 125,
  },
});