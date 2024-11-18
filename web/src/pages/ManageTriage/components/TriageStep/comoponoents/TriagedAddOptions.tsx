import { NodeProps } from "postcss";
import {
  CustomNodeTypes,
  TriageNode,
  TriageOptionNode,
} from "../../../../../types.ts";
import { useCallback, useMemo } from "react";
import { useNodes, useReactFlow } from "@xyflow/react";

export function TriagedAddOptions(props: NodeProps<TriageNode>) {
  const nodes = useNodes();
  const { addNodes } = useReactFlow();

  console.log(nodes);

  const optionSiblings = useMemo(() => {
    return nodes.filter(({ parentId }) => parentId === props.id);
  }, [props.parentId, nodes]) as unknown as TriageOptionNode;

  const onAddOption = useCallback(() => {
    const newSibling: TriageOptionNode = {
      id: crypto.randomUUID(),
      parentId: props.id,
      type: CustomNodeTypes.TriageOptions,
      position: { x: 25, y: 0 },
      data: { value: "", index: 0 },
    };

    let y = 0;
    if (optionSiblings.length) {
      const lastSibling = optionSiblings[optionSiblings.length - 1];
      y = lastSibling.position.y + 90;
    } else {
      y = props.height;
    }

    newSibling.position = { x: 25, y };

    addNodes([newSibling]);
  }, [optionSiblings, props.id]);

  if (props.data.stepType === "label") return null;

  return (
    <>
      <h1>Options</h1>
      <div
        onClick={onAddOption}
        className="nodrag flex items-center justify-center w-full h-10 border-dotted border-[3px] rounded-[10px] hover:bg-gray-100"
        style={{ marginBottom: 90 * optionSiblings.length + "px" }}
      >
        <h1 className="text-xl font-bold text-gray-400">+</h1>
      </div>
    </>
  );
}
