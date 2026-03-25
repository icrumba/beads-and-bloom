"use client";

import { useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useTaskStore } from "@/store/task-store";
import { useSSE } from "@/hooks/use-sse";

export default function Home() {
  const fetchTasks = useTaskStore((s) => s.fetchTasks);
  useSSE();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <AppShell>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "#9CA3AF",
          fontSize: 14,
        }}
      >
        Loading board...
      </div>
    </AppShell>
  );
}
