
import { StyleSheet, Text, View } from "react-native";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0C0F",
    paddingHorizontal: 24,
    paddingTop: 64,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "600",
  },
});