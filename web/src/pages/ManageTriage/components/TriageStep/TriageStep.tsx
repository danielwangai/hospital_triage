import { NodeProps } from "postcss";
import { TriageNode } from "../../../../types.ts";
import { Handle, Position, useEdges } from "@xyflow/react";
import { useMemo } from "react";
import clsx from "clsx";
import { TriageInput } from "./comoponoents/TriageInput.tsx";

export function TriageStep(props: NodeProps<TriageNode>) {
  const edges = useEdges();
  const isConnectable = useMemo(() => {
    return !edges.find((e) => e.target === props.id);
  }, [edges, props.id]);

  return (
    <>
      <div className="w-[300px] flex flex-col items-center rounded-[20px] border-[3px] border-black p-5 shadow-lg background-white">
        <TriageInput {...props} />
        {/*    options*/}
        {/*    type*/}
        {/*    label*/}
      </div>
      {/*{!props.data.isRoot && (*/}
      <Handle
        type="target"
        position={Position.Left}
        id={props.id}
        isConnectable={isConnectable}
        className={clsx({
          "flex items-center justify-center w-[40px] h-[40px] rounded-full hover:bg-gray-200 mr-[-25px]":
            true,
          "bg-black border-none": !isConnectable,
          "border-dotted border-[2px] border-[lightgray] bg-white":
            isConnectable,
        })}
      >
        🔗
      </Handle>
      {/*)}*/}
    </>
  );
}
