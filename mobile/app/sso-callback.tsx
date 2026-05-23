import { ActivityIndicator, Text, View } from "react-native";

export default function SSOCallback() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator size="large" />
      <Text className="mt-4 text-text-secondary">
        Completing sign in...
      </Text>
    </View>
  );
}