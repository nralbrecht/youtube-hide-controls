import { AddonSettings } from "./settings";

export interface Preset {
  id: string;
  title: string;
  description?: string;
  settings: Partial<AddonSettings>;
}

export const presets: Preset[] = [
  {
    id: "hide",
    title: browser.i18n.getMessage("presetDropdownHideTitle"),
    description: browser.i18n.getMessage("presetDropdownHideDescription"),
    settings: {
      useMouse: true,
      trigger: {
        top: 0,
        left: 5,
        right: 5,
        bottom: 0,
      },
      invertTrigger: false,
      onlyFullscreen: false,
    },
  },
  {
    id: "show",
    title: browser.i18n.getMessage("presetDropdownShowTitle"),
    description: browser.i18n.getMessage("presetDropdownShowDescription"),
    settings: {
      useMouse: true,
      trigger: {
        top: 70,
        left: 10,
        right: 10,
        bottom: 80,
      },
      invertTrigger: true,
      onlyFullscreen: true,
    },
  },
  {
    id: "custom",
    title: browser.i18n.getMessage("presetDropdownCustomTitle"),
    settings: {},
  },
];

export function presetMatchesSettings(preset: Preset, settings: AddonSettings): boolean {
  // downcasting because interfaces are not indexable by string even if only valid keys are used
  const presetSettingsRecord = preset.settings as Record<string, any>;
  const settingsRecord = settings as Record<string, any>;

  console.log("presetMatchesSettings1", preset, settingsRecord);

  for (const key in presetSettingsRecord) {
    console.log("presetMatchesSettings2", key, presetSettingsRecord[key], settingsRecord[key]);
    if (presetSettingsRecord[key] !== settingsRecord[key]) {
      return false;
    }
  }

  return true;
}
