import { useSSO } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { Alert, Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

function useSocialAuth() {
  const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
  const { startSSOFlow } = useSSO();
  const router = useRouter();

  const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
    setLoadingStrategy(strategy);

    try {
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: "mobile",
        path: "sso-callback",
      });

      console.log("CLERK REDIRECT URL:", redirectUrl);

      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy,
          redirectUrl,
        });

      console.log("createdSessionId:", createdSessionId);
      console.log("signIn status:", signIn?.status);
      console.log("signUp status:", signUp?.status);

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/(tabs)");
        return;
      }

      Alert.alert(
        "Login not completed",
        "Copy the CLERK REDIRECT URL from the terminal and add it in Clerk Dashboard > Redirect URLs."
      );
    } catch (error) {
      console.log("Social auth error:", JSON.stringify(error, null, 2));
      Alert.alert("Error", "Failed to sign in. Please try again.");
    } finally {
      setLoadingStrategy(null);
    }
  };

  return { loadingStrategy, handleSocialAuth };
}

export default useSocialAuth;