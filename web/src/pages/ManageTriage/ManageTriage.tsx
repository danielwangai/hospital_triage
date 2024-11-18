import { useCallback, useState } from "react";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  MarkerType,
  MiniMap,
  Node,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  ReactFlow,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import clsx from "clsx";
import { useDebouncedCallback } from "../../hooks/useDebouncedCallback.ts";
import { CustomNodeTypes, StepTypes } from "../../types.ts";
import { EmptyNode } from "./components/EmptyNode.tsx";
import { TriageStep } from "./components/TriageStep/TriageStep.tsx";

const nodeTypes = {
  triageStep: TriageStep,
  // triageOption
};

const defaultEdgeOptions = {
  style: { strokeWidth: 3, stroke: "black" },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "black",
  },
};

const connectionLineStyle = {
  strokeWidth: 3,
  stroke: "black",
};

export default function App() {
  const initialNodes = [
    { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
    { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
  ];
  const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [savingChanges, setSavingChanges] = useState<boolean>(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);

  const onNodesChange: OnNodesChange<Node> = useCallback((changes) => {
    // give ui feedback that changes are being made and saved to db
    setSavingChanges(true);
    setLastUpdatedAt(performance.now());
    setNodes((nodes: Node[]) => applyNodeChanges(changes, nodes));
  }, []);

  const onEdgesChange: OnEdgesChange<Edge> = useCallback((changes) => {
    // give ui feedback that changes are being made and saved to db
    setSavingChanges(true);
    setLastUpdatedAt(performance.now());
    setEdges((edges: Edge[]) => applyEdgeChanges(changes, edges));
  }, []);

  const onConnect: OnConnect = useCallback(
    (params) => {
      setSavingChanges(true);
      setLastUpdatedAt(performance.now());
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges],
  );

  const createRootNode = useCallback(() => {
    setNodes([
      {
        id: crypto.randomUUID(),
        type: CustomNodeTypes.TriageStep,
        position: { x: 100, y: 100 },
        data: { value: "", isRoot: true, stepType: StepTypes.Step },
      },
    ]);
  }, []);

  useDebouncedCallback(
    () => {
      if (!lastUpdatedAt) return;
      setSavingChanges(false);
    },
    [lastUpdatedAt],
    1500,
  );

  if (!nodes.length) return <EmptyNode onClick={createRootNode} />;

  return (
    <>
      <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView // show everything on initial load
          nodeTypes={nodeTypes}
          className="bg-red-50"
          defaultEdgeOptions={defaultEdgeOptions}
          connectionLineStyle={connectionLineStyle}
        >
          <Controls />
          <MiniMap />
          {/*<Background variant="dots" gap={12} size={1} />*/}
          <Background variant={BackgroundVariant.Dots} />
        </ReactFlow>
      </div>
      <div
        className={clsx(
          "absolute top-[78px] left-2 p-2 rounded-lg text-sm z-10",
          savingChanges ? "bg-black text-white" : "bg-white text-black",
        )}
      >
        {savingChanges ? "⏳ Saving Changes" : "✅ Changes saved!"}
      </div>
    </>
  );
}
