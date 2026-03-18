import { slidingDoorApiService } from "./slidingDoorApiService";
import { slidingDoorMockService } from "./slidingDoorMockService";

// Switch between real API and mock data via environment variable
// VITE_USE_MOCK=true in .env to force mock data
const useMock = import.meta.env.VITE_USE_MOCK === "true";

export const slidingDoorService = useMock
  ? slidingDoorMockService
  : slidingDoorApiService;