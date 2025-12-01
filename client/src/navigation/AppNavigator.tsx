import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Platform } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import LobbyScreen from "../screens/LobbyScreen";
import KioskScreen from "../screens/KioskScreen";

export type RootStackParamList = {
  Home: undefined;
  Lobby: { nickname: string; avatarColor?: string } | undefined;
  Kiosk: { nickname: string } | undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#FAFAFA",
    primary: "#4F46E5",
    card: "#ffffff",
    text: "#0F172A",
    border: "rgba(79,70,229,0.1)",
  },
};

const screenOptions = {
  headerStyle: {
    backgroundColor: "#ffffff",
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTintColor: "#0F172A",
  headerTitleStyle: {
    fontWeight: "800" as const,
    fontSize: 18,
    letterSpacing: 0.2,
  },
  cardStyle: {
    backgroundColor: "#FAFAFA",
  },
  animationEnabled: Platform.OS !== "web",
};

const AppNavigator = () => (
  <NavigationContainer theme={theme}>
    <Stack.Navigator initialRouteName="Home" screenOptions={screenOptions}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "CampusDrop" }}
      />
      <Stack.Screen
        name="Lobby"
        component={LobbyScreen}
        options={{ title: "Lobby" }}
      />
      <Stack.Screen
        name="Kiosk"
        component={KioskScreen}
        options={{ title: "Host Kiosk" }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
