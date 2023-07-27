import { writable } from "svelte/store";
import { DEFAULT_THEME } from "Const";

function createCreatorTheme() {
  const { subscribe, set, update } = writable<Store.CreatorThemeStore>({
    state: "new",
    loadedTemplateId: "",
    previewMaskVisible: true,
    zoom: 1,
    theme: structuredClone(DEFAULT_THEME),
  });

  return {
    subscribe,
    update,
    set,
    reset: () =>
      set({
        state: "new",
        loadedTemplateId: "",
        previewMaskVisible: true,
        zoom: 1,
        theme: structuredClone(DEFAULT_THEME),
      }),
    setTheme: (theme: Themes.Theme) =>
      update((store) => ({
        ...store,
        theme,
      })),
    setColor: (key: string, value: string) =>
      update((store) => ({
        ...store,
        theme: {
          ...store.theme,
          palette: {
            ...store.theme.palette,
            [key]: value,
          },
        },
      })),
    setPaletteTheme: (theme: Themes.Theme) =>
      update((store) => ({
        ...store,
        loadedTemplateId: theme.id,
        state: "new",
        theme: {
          ...store.theme,
          palette: theme.palette,
        },
      })),
    setEditTheme: (theme: Themes.Theme) =>
      update((store) => ({
        ...store,
        state: "edit",
        theme,
      })),
    togglePreviewVisible: () =>
      update((store) => ({
        ...store,
        previewMaskVisible: !store.previewMaskVisible,
      })),
  };
}

export const creatorTheme = createCreatorTheme();
