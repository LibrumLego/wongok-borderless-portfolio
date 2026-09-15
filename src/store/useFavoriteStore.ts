import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoriteState {
  ids: string[];
  add: (placeId: string) => void;
  remove: (placeId: string) => void;
  toggle: (placeId: string) => void;
  has: (placeId: string) => boolean;
  clear: () => void;
}

/** 이전 버전이나 수동 편집으로 중복된 로컬 저장값이 남아도 한 장소는 한 번만 유지한다. */
function normalizeFavoriteIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return [
    ...new Set(value.filter((id): id is string => typeof id === "string" && id.trim().length > 0)),
  ];
}

/**
 * 찜한 장소.
 *
 * 여러 장소를 훑다 보면 "여기 가볼까" 싶은 곳을 따로 모아둘 데가 필요하다.
 * 로그인 없이 쓰는 서비스라 브라우저에만 저장한다(스탬프와 같은 방식).
 * 기기를 바꾸면 사라지는 건 감수하되, 그래서 스탬프처럼 성취로 취급하지 않고
 * 어디까지나 둘러보기 보조 도구로만 쓴다.
 */
export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      ids: [],
      add: (placeId) =>
        set((state) =>
          state.ids.includes(placeId) ? {} : { ids: [...state.ids, placeId] }
        ),
      remove: (placeId) =>
        set((state) => ({
          ids: state.ids.filter((id) => id !== placeId),
        })),
      toggle: (placeId) =>
        set((state) => ({
          ids: state.ids.includes(placeId)
            ? state.ids.filter((id) => id !== placeId)
            : [...state.ids, placeId],
        })),
      has: (placeId) => get().ids.includes(placeId),
      clear: () => set({ ids: [] }),
    }),
    {
      name: "wongok-favorites",
      partialize: (state) => ({ ids: state.ids }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState && typeof persistedState === "object"
          ? persistedState as { ids?: unknown }
          : undefined;

        return {
          ...currentState,
          ids: normalizeFavoriteIds(persisted?.ids),
        };
      },
    }
  )
);
