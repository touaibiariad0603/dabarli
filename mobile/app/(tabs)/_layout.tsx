import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Redirect, Tabs } from "expo-router";
import { Platform, StyleSheet, View } from "react-native"; // ← add Platform, View
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabsLayout = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const insets = useSafeAreaInsets();

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/(auth)" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#F59E0B",
        tabBarInactiveTintColor: "#78716C",

         sceneStyle: { backgroundColor: "#0F0E0C" },

        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={60}
              tint="dark"
              pointerEvents="none"
              style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
            />
          ) : (
            <View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFill,
                {
                  borderRadius: 24,
                  borderWidth: 0.5,
                  backgroundColor: "rgba(15, 14, 12, 0.92)",   // #0F0E0C with opacity
                  borderColor: "rgba(245, 158, 11, 0.08)",      // subtle amber border glow
                },
              ]}
            />
          ),

        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 30 + insets.bottom,
          paddingTop: 5,
          marginHorizontal: 100,
          marginBottom: insets.bottom > 0 ? insets.bottom : 10,
          borderRadius: 24,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",  // ← string not number
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Shop",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    <Tabs.Screen
        name="diagnostic"
        options={{
        title: "Diagnostic",
        tabBarIcon: ({ color, size }) => (
        <Ionicons
        name="car-sport"
        size={size}
        color={color}
      />
    ),
  }}
/>
    </Tabs>
  );
};

export default TabsLayout;