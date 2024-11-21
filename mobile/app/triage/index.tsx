import {View, Text, Button} from "tamagui";
import {useRef, useState} from "react";
import {ActivityIndicator, Animated, Dimensions, Easing, FlatList} from "react-native";
import {TriageOption, TriageStep} from "@/types";
import {useMutation, useQuery} from "@tanstack/react-query";
import {getTriageDecisionTree} from "@/services";
import {router} from "expo-router";

const animationConfig = {
    duration: 100,
    easing: Easing.ease,
    useNativeDriver: true,
}

export default function TriageScreen() {
  const [nextStep, setNextStep] = useState<TriageStep["step"]>();
  const ref = useRef(new Animated.Value(0));

  const query = useQuery({
      queryKey: ["triage", { nextStep }],
      queryFn: () => getTriageDecisionTree(nextStep),
  })
    if (query.isError) {
        return (<View f={1} ai={"center"} jc="center">
            <Text>Error Loading Triage</Text>
        </View>)
    }

  const mutation = useMutation({
      mutationKey: ["triage", "confirm"],
      mutationFn: async () => {},
      onSuccess: () => router.back(),
  });

    async function onNextStep(option: TriageStep) {
        Animated.timing(ref.current, {
            toValue: -Dimensions.get("window").width,
            ...animationConfig
        }).start(() => {
            if(option.assignedLabel) mutation.mutate();
            if(option.nextStep) setNextStep(option.nextStep);

            ref.current.setValue(Dimensions.get("window").width);
            Animated.timing(ref.current, {
                toValue: 0,
                ...animationConfig,
            }).start();
        })
    }
  return (
    <View f={1} ai="center" jc="center" bg="$red9">
      <View pos="absolute">
          <Text opacity={0.7} color="red" fos={300}>
              🚑
          </Text>
      </View>

          <Animated.View
              style={{transform: [{translateX: ref.current}], flex: 1, width: "100%"}}
          >
              {query.isLoading ? (
                  <View f={1} ai="center" jc="center">
                      <ActivityIndicator animating size="large" />
                  </View>
              ) : (
                  <>
                      <View h="20%" ai="center" jc="center">
                          <Text px="$3" fos={30} fow={400} color="white" fost="italic">
                              {query.data?.step}
                          </Text>
                      </View>
                      <FlatList
                          data={query.data?.options}
                          keyExtractor={({ value }) => value}
                          style={{ width: "100%" }}
                          renderItem={({ item }) => (
                              <Button
                                  onPress={() => onNextStep(item)}
                                  bg="white"
                                  m={20}
                                  w="90%"
                                  br={50}
                                  size="$6"
                                  textProps={{ fos: 22, fow: "bold" }}
                                  pressStyle={{ bg: "$red5" }}
                              >
                                  {item.value}
                              </Button>
                          )}
                      />
                  </>
              )}
          </Animated.View>
    </View>
  );
}
