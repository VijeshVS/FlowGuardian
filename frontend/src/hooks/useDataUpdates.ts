import { useEffect } from "react";
import { PipelineData } from "../types";
import { generateRandomTemperature } from "../utils/temperatureUtils";
import { getSystemStatus } from "../utils/flowUtils";

export function useDataUpdates(
  setPipelineData: React.Dispatch<React.SetStateAction<PipelineData[]>>
) {
  useEffect(() => {
    // WebSocket setup
    const ws = new WebSocket("ws://localhost:3000");

    ws.onopen = () => {
      console.log("WebSocket connection established.");
    };

    ws.onmessage = (message) => {
      try {
        const receivedData = JSON.parse(message.data);
        setPipelineData((currentData) =>
          currentData.map((data) => {
            const flowRate1 = receivedData.end1Pressure;
            const flowRate2 = receivedData.end2Pressure;
            const temperature = generateRandomTemperature();
            const { status } = getSystemStatus(Math.abs(flowRate1 - flowRate2));

            return {
              ...data,
              flowRate1,
              flowRate2,
              temperature,
              status,
              timestamp: new Date().toISOString(),
            };
          })
        );
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, [setPipelineData]);
}
