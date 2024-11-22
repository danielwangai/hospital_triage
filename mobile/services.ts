import {Platform} from "react-native";
import {TriageStep} from "@/types";

const HOST = Platform.OS === "android" ? "10.0.2.2" : "127.0.0.1";
const URL = `http://${HOST}:3000`

export async function getTriageDecisionTree(nextStepId: string = ""): Promise<TriageStep> {
    return fetch(`${URL}/triage/decision-tree?nextStepId=${nextStepId}`)
        .then(res => res.json());
}
