import { create } from 'zustand'

interface HeaderState {
  pageTitle: string
  setPageTitle: (path: string) => void
  breadCrumbs: {
    to: string
    name: string
  }[]
  setBreadCrumbs: (list: HeaderState['breadCrumbs']) => void
}

export const useHeaderStore = create<HeaderState>(set => ({
  pageTitle: '',
  setPageTitle: path => set({ pageTitle: path }),
  breadCrumbs: [],
  setBreadCrumbs: (list: HeaderState['breadCrumbs']) =>
    set({ breadCrumbs: list })
}))
