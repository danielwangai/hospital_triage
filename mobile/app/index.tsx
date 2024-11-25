import { Button, View } from "tamagui";
import { Text } from "react-native";
import {router, useFocusEffect} from "expo-router";
import {LiveQueue} from "@/components/LiveQueue";
import {useQuery} from "@tanstack/react-query";
import {getQueue} from "@/services";
import {PatientQueueData} from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {PatientInfo} from "@/components/PatientInfo";

export default function IndexScreen() {
  const queue = useQuery({queryKey: ["queue"], queryFn: getQueue})
  const patient = useQuery({
    queryKey: ["patient"],
    queryFn: async () => AsyncStorage.getItem('patient')
        .then(data => data && JSON.parse(data) as PatientQueueData || null)
  });

  const goToTriage = () => {
    router.push("/triage");
  };

  useFocusEffect(() => {
    patient.refetch();
    queue.refetch();
  });
  return (
    <View
      ai="center"
      f={1}
      pt={20}
      gap={20}
      $theme-light={{ bg: "$red2" }}
      $theme-dark={{ bg: "$gray2Dark" }}
    >
      {patient.data ? (
          <PatientInfo patient={patient.data} />
      ) : (
          <Button
              onPress={goToTriage}
              size={"$5"}
              bg="$red10"
              br={50}
              my={20}
              w={"90%"}
              pressStyle={{ backgroundColor: "$red8" }}
              textProps={{ color: "white", fow: "bold", fos: 20 }}
          >
            ✚   START TRIAGE   ✚
          </Button>
      )}
      <LiveQueue data={queue.data} isLoading={queue.isLoading} refetch={queue.refetch} />
    </View>
  );
}
