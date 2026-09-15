import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StampRecord, StampSlotId } from "@/types";

interface StampState {
  records: StampRecord[];
  collect: (slotId: StampSlotId, placeId: string) => void;
  reset: () => void;
}

export const useStampStore = create<StampState>()(
  persist(
    (set) => ({
      records: [],
      collect: (slotId, placeId) =>
        set((state) => ({
          records: state.records.some((r) => r.slotId === slotId)
            ? state.records
            : [
                ...state.records,
                { slotId, placeId, collectedAt: new Date().toISOString() },
              ],
        })),
      reset: () => set({ records: [] }),
    }),
    { name: "wongok-stamps" }
  )
);

// 두 좌표 사이 거리(m) — GPS 위치 인증용 하버사인 공식
export function distanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}
