import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SidebarState {
	collapsed: boolean;
	toggle: () => void;
	hidden: boolean;
	switchHidden: (status: boolean) => void;
	activeGroup: string | null;
	setActiveGroup: (group: string | null) => void;
}

export const useSidebarStore = create<SidebarState>()(
	persist(
		(set) => ({
			collapsed: true,
			toggle: () => set((state) => ({ collapsed: !state.collapsed })),
			hidden: true,
			switchHidden: (status: boolean) => set({ hidden: status }),
			activeGroup: null,
			setActiveGroup: (group: string | null) => set({ activeGroup: group }),
		}),
		{
			name: "sidebar-storage",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
