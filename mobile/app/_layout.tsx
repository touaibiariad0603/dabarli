import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import * as Sentry from '@sentry/react-native';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import "../global.css";

Sentry.init({
  dsn: 'https://31d3f042d1c12b73e546acb670193029@o4511172235100160.ingest.de.sentry.io/4511208351727696',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

const queryClient = new QueryClient();

export default Sentry.wrap(function RootLayout() {
  return (
  <ClerkProvider tokenCache={tokenCache}>

    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{headerShown:false }}/>
    </QueryClientProvider>
    </ClerkProvider>
  );
});