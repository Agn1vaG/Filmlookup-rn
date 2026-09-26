import { Tabs } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { BlurView } from "expo-blur";

import { Image, Pressable, View } from "react-native";

import polarisExpand from "@/assets/icons/polaris-expand.png";
import polarisHome from "@/assets/icons/polaris-home.png";
import polarisSolo from "@/assets/icons/polaris-solo.png";
import polarisTogether from "@/assets/icons/polaris-together.png";

/*
|--------------------------------------------------------------------------
| POLARIS NAV ICON
|--------------------------------------------------------------------------
*/

function PolarisNavIcon({
  icon,
  focused = false,
}: {
  icon: any;
  focused?: boolean;
}) {
  return (
    <View
      style={{
        width: 52,
        height: 52,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* ACTIVE INDICATOR */}

      {focused && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 5,
            width: 28,
            height: 3,
            borderRadius: 2,
            backgroundColor: "#FFFFFF",
          }}
        />
      )}

      {/* ICON */}

      <Image
        source={icon}
        resizeMode="contain"
        style={{
          width: 24,
          height: 24,
          tintColor: focused
            ? "#FFFFFF"
            : "#727780",
          opacity: focused ? 1 : 0.9,
        }}
      />
    </View>
  );
}

/*
|--------------------------------------------------------------------------
| POLARIS SEARCH ICON
|--------------------------------------------------------------------------
*/

function PolarisSearchIcon({
  focused = false,
}: {
  focused?: boolean;
}) {
  return (
    <View
      style={{
        width: 60,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* ACTIVE CIRCLE */}

      {focused && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            width: 42,
            height: 42,
            borderRadius: 28,
            borderWidth: 2,
            borderColor: "#FFFFFF",
          }}
        />
      )}

      {/* SEARCH ICON */}

      <Ionicons
        name="search-outline"
        size={25}
        color={
          focused
            ? "#FFFFFF"
            : "#727780"
        }
      />
    </View>
  );
}

/*
|--------------------------------------------------------------------------
| POLARIS TAB BAR
|--------------------------------------------------------------------------
*/

function PolarisTabBar({
  state,
  navigation,
}: any) {
  const currentRoute =
    state.routes[state.index]?.name;

  const navigate = (routeName: string) => {
    navigation.navigate(routeName);
  };

  const homeFocused =
    currentRoute === "index";

  const soloFocused =
    currentRoute === "save";

  const togetherFocused =
    currentRoute === "profile";

  const searchFocused =
    currentRoute === "search";

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 21,
        height: 64,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
      }}
    >
      {/*
      |--------------------------------------------------------------------------
      | MAIN NAVIGATION PILL
      |--------------------------------------------------------------------------
      */}

      <View
        style={{
          width: 236,
          height: 64,
          borderRadius: 32,
          overflow: "hidden",
          backgroundColor: "#090B0F",
          borderWidth: 1,
          borderColor:
            "rgba(255, 255, 255, 0.10)",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
          paddingHorizontal: 4,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.45,
          shadowRadius: 20,
          elevation: 10,
        }}
      >
        {/* SUBTLE GLASS */}

        <BlurView
          pointerEvents="none"
          intensity={18}
          tint="dark"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />

        {/* SUBTLE TOP REFLECTION */}

        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 32,
            right: 32,
            height: 1,
            backgroundColor:
              "rgba(255, 255, 255, 0.16)",
          }}
        />

        {/* HOME */}

        <Pressable
          onPress={() => navigate("index")}
          style={{
            width: 52,
            height: 52,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PolarisNavIcon
            icon={polarisHome}
            focused={homeFocused}
          />
        </Pressable>

        {/* SOLO */}

        <Pressable
          onPress={() => navigate("save")}
          style={{
            width: 52,
            height: 52,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PolarisNavIcon
            icon={polarisSolo}
            focused={soloFocused}
          />
        </Pressable>

        {/* TOGETHER */}

        <Pressable
          onPress={() => navigate("profile")}
          style={{
            width: 52,
            height: 52,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PolarisNavIcon
            icon={polarisTogether}
            focused={togetherFocused}
          />
        </Pressable>

        {/* EXPAND */}

        <Pressable
          onPress={() => {}}
          style={{
            width: 52,
            height: 52,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PolarisNavIcon
            icon={polarisExpand}
            focused={false}
          />
        </Pressable>
      </View>

      {/*
      |--------------------------------------------------------------------------
      | SEARCH BUTTON
      |--------------------------------------------------------------------------
      */}

      <Pressable
        onPress={() => navigate("search")}
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#090B0F",
          borderWidth: 1,
          borderColor:
            "rgba(255, 255, 255, 0.10)",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.45,
          shadowRadius: 20,
          elevation: 10,
        }}
      >
        {/* SEARCH GLASS */}

        <BlurView
          pointerEvents="none"
          intensity={18}
          tint="dark"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />

        {/* SEARCH TOP REFLECTION */}

        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 14,
            right: 14,
            height: 1,
            backgroundColor:
              "rgba(255, 255, 255, 0.16)",
          }}
        />

        <PolarisSearchIcon
          focused={searchFocused}
        />
      </Pressable>
    </View>
  );
}

/*
|--------------------------------------------------------------------------
| TABS
|--------------------------------------------------------------------------
*/

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => (
        <PolarisTabBar {...props} />
      )}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
        }}
      />

      <Tabs.Screen
        name="save"
        options={{
          title: "Solo",
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Together",
        }}
      />
    </Tabs>
  );
}