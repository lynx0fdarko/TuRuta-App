import { SafeAreaView } from 'react-native-safe-area-context'
import { Tabs } from 'expo-router'

export default function TabsLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  )
}
