import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import React from "react";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false, // Optional: Adjust as needed
});

export default function RootLayout() {
  return (
    <ConvexProvider client={convex}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Recordings",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="recording/[id]"
          options={{
            title: "Recording",
            headerShown: true,
            presentation: "card",
          }}
        />
      </Stack>
    </ConvexProvider>
  );
}
