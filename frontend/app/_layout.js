// app/_layout.js
import 'react-native-reanimated'
import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="(drawer)" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
