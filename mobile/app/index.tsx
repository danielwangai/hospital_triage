import { Button, View } from "tamagui";
import { Text } from "react-native";
import { router } from "expo-router";

export default function IndexScreen() {
  const goToTriage = () => {
    router.push("/triage");
  };
  return (
    <View
      ai="center"
      f={1}
      pt={20}
      gap={20}
      $theme-light={{ bg: "$red2" }}
      $theme-dark={{ bg: "$gray2Dark" }}
    >
      <Button
        onPress={goToTriage}
        size="$5"
        bg="$red10"
        br={50}
        my={20}
        w="90%"
        pressStyle={{ bg: "$red8" }}
        textProps={{ color: "white", fow: "bold" }}
      >
        START TRIAGE
      </Button>
    </View>
  );
}
