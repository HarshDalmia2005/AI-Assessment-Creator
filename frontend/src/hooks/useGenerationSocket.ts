"use client";

import { useEffect } from "react";
import { useAssignmentStore } from "@/store/assignmentStore";

export function useGenerationSocket(): void {
  const setSocketStatus = useAssignmentStore((state) => state.setSocketStatus);

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
    if (!wsUrl) {
      setSocketStatus("disconnected");
      return;
    }

    setSocketStatus("connecting");
    const socket = new WebSocket(wsUrl);

    socket.addEventListener("open", () => {
      setSocketStatus("connected");
    });

    socket.addEventListener("close", () => {
      setSocketStatus("disconnected");
    });

    socket.addEventListener("error", () => {
      setSocketStatus("disconnected");
    });

    return () => {
      socket.close();
    };
  }, [setSocketStatus]);
}
