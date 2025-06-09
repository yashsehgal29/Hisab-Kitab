import { Slot, Stack } from "expo-router";
import "./globals.css";
import { ClerkProvider } from "@clerk/clerk-expo";
import { useEffect } from "react";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { useFonts } from "expo-font";
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    agile: require("../assets/fonts/agile.otf"),
    mooxy: require("../assets/fonts/mooxy.ttf")
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <Slot screenOptions={{ headerShown: false }} />
    </ClerkProvider>
  );
}
