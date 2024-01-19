import { defineStore } from "pinia";
import axios from "axios";

interface MaterialIconsState {
  icons: Array<string>;
  searchedIcons: Array<string>;
}

export const useMaterialIconsStore = defineStore("materialIconsStore", {
  state: () => ({
    icons: [],
    searchedIcons: [],
  }),
  getters: {
    getIcons: (state: MaterialIconsState) => state.icons,
    getSearchedIcons: (state: MaterialIconsState) => state.searchedIcons,
  },
  actions: {
    search(query: string) {
      if (query === "") return (this.searchedIcons = this.icons);
      this.searchedIcons = this.icons.filter((icon: string) => icon.includes(query));
    },
    async load() {
      const { data } = await axios.get(
        "https://raw.githubusercontent.com/google/material-design-icons/main/font/MaterialIcons-Regular.codepoints",
      );
      this.icons = data
        .split("\n")
        .filter((line: string) => line.trim() !== "")
        .map((line: string) => line.split(" ")[0]);
      this.searchedIcons = this.icons;
    },
  },
});
