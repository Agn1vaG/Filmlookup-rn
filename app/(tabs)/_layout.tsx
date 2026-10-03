
import { Tabs, usePathname, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import {
  Animated,
  Image,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEffect, useMemo, useState } from "react";

import polarisExpand from "@/assets/icons/polaris-expand.png";
import polarisHome from "@/assets/icons/polaris-home.png";
import polarisSolo from "@/assets/icons/polaris-solo.png";
import polarisTogether from "@/assets/icons/polaris-together.png";
import polarisSettings from "@/assets/icons/polaris-settings.png";
import polarisShrink from "@/assets/icons/polaris-shrink.png";

const COLORS = {
  background: "#090B0F",
  white: "#FFFFFF",
  inactive: "#727780",
  border: "rgba(255,255,255,0.10)",
  reflection: "rgba(255,255,255,0.16)",
};

const ROUTES = [
  "search",
  "index",
  "solo",
  "together",
  "profile",
  "settings",
];

const ROUTE_LABELS: Record<string, string> = {
  search: "Search",
  index: "Home",
  solo: "Solo",
  together: "Together",
  profile: "Profile",
  settings: "Settings",
};

function PolarisNavIcon({
  icon,
  focused = false,
}: {
  icon: any;
  focused?: boolean;
}) {
  return (
    <View style={styles.navIcon}>
      {focused && (
        <View
          pointerEvents="none"
          style={styles.activeIndicator}
        />
      )}

      <Image
        source={icon}
        resizeMode="contain"
        style={{
          width: 28,
          height: 28,
          tintColor: focused
            ? COLORS.white
            : COLORS.inactive,
          opacity: focused ? 1 : 0.9,
        }}
      />
    </View>
  );
}

function PolarisSearchIcon({
  focused = false,
}: {
  focused?: boolean;
}) {
  return (
    <View style={styles.searchIcon}>
      {focused && (
        <View
          pointerEvents="none"
          style={styles.activeCircle}
        />
      )}

      <Ionicons
        name="search-outline"
        size={25}
        color={focused ? COLORS.white : COLORS.inactive}
      />
    </View>
  );
}

function GlassSurface({
  children,
  style,
}: {
  children: React.ReactNode;
  style: any;
}) {
  return (
    <View style={[styles.glassSurface, style]}>
      <BlurView
        pointerEvents="none"
        intensity={18}
        tint="dark"
        style={StyleSheet.absoluteFill}
      />

      <View
        pointerEvents="none"
        style={styles.topReflection}
      />

      {children}
    </View>
  );
}

function PolarisTabBar({ state, navigation }: any) {
  const pathname = usePathname();
  const router = useRouter();

  const [expanded, setExpanded] = useState(false);
  const [animation] = useState(
    () => new Animated.Value(0)
  );

  const currentRoute =
    state.routes[state.index]?.name ?? "index";

  useEffect(() => {
    Animated.spring(animation, {
      toValue: expanded ? 1 : 0,
      friction: 8,
      tension: 75,
      useNativeDriver: false,
    }).start();
  }, [expanded, animation]);

  const isFocused = (route: string) =>
    currentRoute === route ||
    pathname.endsWith(`/${route}`);

  const navigate = (route: string) => {
    setExpanded(false);

    if (
      ["index", "solo", "together", "search"].includes(route)
    ) {
      navigation.navigate(route);
    } else {
      router.push(`/(tabs)/${route}` as any);
    }
  };

  // Swipe to the next or previous destination.
  const swipeToRoute = (direction: number) => {
    const currentIndex = ROUTES.indexOf(currentRoute);
    const safeIndex = currentIndex >= 0 ? currentIndex : 0;

    const nextIndex =
      (safeIndex + direction + ROUTES.length) %
      ROUTES.length;

    navigate(ROUTES[nextIndex]);
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          expanded &&
          Math.abs(gesture.dx) > 18 &&
          Math.abs(gesture.dx) >
            Math.abs(gesture.dy) * 1.3,

        onPanResponderRelease: (_, gesture) => {
          if (Math.abs(gesture.dx) < 45) return;

          // Swipe left = next page; swipe right = previous.
          swipeToRoute(gesture.dx < 0 ? 1 : -1);
        },
      }),
    [expanded, currentRoute]
  );

  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.94, 1],
  });

  const collapsedOpacity = animation.interpolate({
    inputRange: [0, 0.25, 1],
    outputRange: [1, 0, 0],
  });

  const expandedOpacity = animation.interpolate({
    inputRange: [0, 0.35, 1],
    outputRange: [0, 0, 1],
  });

  const panelHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [64, 330],
  });

  const renderExpandedItem = (
    label: string,
    route: string,
    icon?: any
  ) => {
    const focused = isFocused(route);

    return (
      <Pressable
        key={route}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ selected: focused }}
        onPress={() => navigate(route)}
        style={styles.expandedItem}
      >
        <View style={styles.expandedItemIcon}>
          {route === "search" ? (
            <Ionicons
              name="search-outline"
              size={24}
              color={
                focused ? COLORS.white : COLORS.inactive
              }
            />
          ) : route === "profile" ? (
            <Ionicons
              name="person-circle-outline"
              size={25}
              color={
                focused ? COLORS.white : COLORS.inactive
              }
            />
          ) : (
            <Image
              source={icon}
              resizeMode="contain"
              style={{
                width: 28,
                height: 28,
                tintColor: focused
                  ? COLORS.white
                  : COLORS.inactive,
              }}
            />
          )}
        </View>

        <Text
          style={[
            styles.itemLabel,
            focused && styles.itemLabelFocused,
          ]}
        >
          {label}
        </Text>

        {focused && (
          <View style={styles.rightIndicator} />
        )}
      </Pressable>
    );
  };

  return (
    <View
      pointerEvents="box-none"
      style={styles.host}
    >
      {/* COLLAPSED NAVBAR */}

      <Animated.View
        pointerEvents={expanded ? "none" : "auto"}
        style={[
          styles.collapsedRow,
          {
            opacity: collapsedOpacity,
            transform: [{ scale }],
          },
        ]}
      >
        <GlassSurface style={styles.mainPill}>
          <Pressable
            onPress={() => navigate("index")}
            style={styles.compactButton}
            accessibilityLabel="Home"
          >
            <PolarisNavIcon
              icon={polarisHome}
              focused={isFocused("index")}
            />
          </Pressable>

          <Pressable
            onPress={() => navigate("solo")}
            style={styles.compactButton}
            accessibilityLabel="Solo"
          >
            <PolarisNavIcon
              icon={polarisSolo}
              focused={isFocused("solo")}
            />
          </Pressable>

          <Pressable
            onPress={() => navigate("together")}
            style={styles.compactButton}
            accessibilityLabel="Together"
          >
            <PolarisNavIcon
              icon={polarisTogether}
              focused={isFocused("together")}
            />
          </Pressable>

          <Pressable
            onPress={() => setExpanded(true)}
            style={styles.compactButton}
            accessibilityLabel="Expand navigation"
          >
            <PolarisNavIcon icon={polarisExpand} />
          </Pressable>
        </GlassSurface>

        {/* Search circle */}

        <Pressable
          onPress={() => navigate("search")}
          style={styles.searchButton}
          accessibilityLabel="Search"
        >
          <BlurView
            pointerEvents="none"
            intensity={18}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />

          <View
            pointerEvents="none"
            style={styles.searchReflection}
          />

          <PolarisSearchIcon
            focused={isFocused("search")}
          />
        </Pressable>
      </Animated.View>

      {/* EXPANDED NAVBAR
          Same bottom anchor, grows upward. */}

      {expanded && (
        <View
          pointerEvents="box-none"
          style={styles.expandedRow}
        >
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.expandedPanelWrapper,
              {
                height: panelHeight,
                opacity: expandedOpacity,
                transform: [{ scale }],
              },
            ]}
          >
            <GlassSurface style={styles.expandedPanel}>
              {renderExpandedItem("Search", "search")}
              {renderExpandedItem("Home", "index", polarisHome)}
              {renderExpandedItem("Solo", "solo", polarisSolo)}
              {renderExpandedItem(
                "Together",
                "together",
                polarisTogether
              )}
              {renderExpandedItem("Profile", "profile")}
              {renderExpandedItem(
                "Settings",
                "settings",
                polarisSettings
              )}
            </GlassSurface>
          </Animated.View>

          {/* Search circle changes into Shrink circle.
              Its bottom edge remains aligned with the panel. */}

          <Pressable
            onPress={() => setExpanded(false)}
            style={styles.shrinkButton}
            accessibilityLabel="Collapse navigation"
          >
            <BlurView
              pointerEvents="none"
              intensity={18}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />

            <View
              pointerEvents="none"
              style={styles.searchReflection}
            />

            <Image
              source={polarisShrink}
              resizeMode="contain"
              style={styles.shrinkIcon}
            />
          </Pressable>
        </View>
      )}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <PolarisTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="solo" options={{ title: "Solo" }} />
      <Tabs.Screen name="together" options={{ title: "Together" }} />
      <Tabs.Screen name="search" options={{ title: "Search" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  host: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 21,
    height: 78,
    alignItems: "center",
    justifyContent: "center",
  },

  collapsedRow: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  glassSurface: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 10,
  },

  topReflection: {
    position: "absolute",
    zIndex: 1,
    top: 0,
    left: 32,
    right: 32,
    height: 1,
    backgroundColor: COLORS.reflection,
  },

  mainPill: {
    width: 280,
    height: 78,
    borderRadius: 39,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingHorizontal: 4,
  },

  compactButton: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },

  navIcon: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  activeIndicator: {
    position: "absolute",
    top: 5,
    width: 28,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.white,
  },

  searchButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 10,
  },

  searchReflection: {
    position: "absolute",
    top: 0,
    left: 14,
    right: 14,
    height: 1,
    backgroundColor: COLORS.reflection,
  },

  searchIcon: {
    width: 68,
    height: 68,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  activeCircle: {
    position: "absolute",
    width: 42,
    height: 42,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: COLORS.white,
  },

  expandedRow: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },

  expandedPanelWrapper: {
    width: 280,
    overflow: "hidden",
    borderRadius: 28,
  },

  expandedPanel: {
    width: 280,
    height: 330,
    borderRadius: 28,
    paddingVertical: 8,
    paddingHorizontal: 6,
    overflow: "hidden",
  },

  expandedItem: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    borderRadius: 16,
  },

  expandedItemIcon: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  itemLabel: {
    flex: 1,
    color: COLORS.inactive,
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },

  itemLabelFocused: {
    color: COLORS.white,
  },

  rightIndicator: {
    width: 3,
    height: 25,
    borderRadius: 2,
    backgroundColor: COLORS.white,
    marginRight: 4,
  },

  shrinkButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 0,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 10,
  },

  shrinkIcon: {
    width: 28,
    height: 28,
    tintColor: COLORS.white,
  },
});