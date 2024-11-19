import { NodeProps, useReactFlow } from "@xyflow/react";
import { StepTypes, TriageNode } from "../../../../../types.ts";
import { useCallback } from "react";
import clsx from "clsx";

export function TriageType(props: NodeProps<TriageNode>) {
  const { updateNodeData } = useReactFlow();
  const updateStepType = useCallback(
    (stepType) => {
      updateNodeData(props.id, { stepType, assignedLabel: undefined });
    },
    [props.id],
  );

  if (props.data.isRoot) return null;
  return (
    <div className="absolute bg-white w-[270px] flex flex-row items-center content-center left-[16px] top-[-48px] gap-[40px] px-4 py-2 rounded-se-[30px] rounded-ss-[30px] shadow-md">
      {[StepTypes.Step, StepTypes.Label].map((option) => (
        <div
          key={option}
          onClick={() => updateStepType(option)}
          className={clsx({
            "font-bold text-sm flex items-center justify-center px-3 py-1 border-dotted border-[2px] border-[lightgray] rounded-[20px] mr-[-25px]":
              true,
            "bg-black text-white border-[lightgray]":
              props.data.stepType === option,
            "bg-white hover:bg-gray-100 text-bold":
              props.data.stepType !== option,
          })}
        >
          {option === "step" ? "Triage Step" : "Assign Label"}
        </div>
      ))}
    </div>
  );
}
