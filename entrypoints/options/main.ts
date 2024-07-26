import { hotKeyToString } from "@/utils/hotkey";
import { Settings } from "~/utils/settings.js";

const injectOptionButtonInput = document.querySelector<HTMLInputElement>(
  "#injectOptionButton input"
)!;
const hideVideoOverlaysInput = document.querySelector<HTMLInputElement>(
  "#hideVideoOverlays input"
)!;
const hidePlayPauseAnimationInput = document.querySelector<HTMLInputElement>(
  "#hidePlayPauseAnimation input"
)!;

const mouseSection = document.querySelector("#useMouse")!;
const useMouseInput = document.querySelector<HTMLInputElement>("#useMouse .section-header input")!;

const presetSelect = document.querySelector<HTMLSelectElement>("#preset select")!;
const presetSelectStyled = document.querySelector<HTMLElement>("#preset .select-styled")!;
const presetSelectOptions = document.querySelector<HTMLElement>("#preset .select-options")!;

const triggerOverlayWidth = 300;
const triggerOverlayHeight = 168;
const triggerOverlay = document.querySelector<HTMLElement>(".trigger-overlay")!;
const triggerTop = document.querySelector<HTMLInputElement>("#top")!;
const triggerLeft = document.querySelector<HTMLInputElement>("#left")!;
const triggerRight = document.querySelector<HTMLInputElement>("#right")!;
const triggerBottom = document.querySelector<HTMLInputElement>("#bottom")!;

const invertTrigger = document.querySelector<HTMLInputElement>("#invertTrigger input")!;
const onlyFullscreen = document.querySelector<HTMLInputElement>("#onlyFullscreen input")!;

const hotkeySection = document.querySelector("#useHotkey")!;
const useHotkeyInput = document.querySelector<HTMLInputElement>(
  "#useHotkey .section-header input"
)!;
const hotkeyInput = document.querySelector<HTMLInputElement>("#hotkey input")!;

function updateSectionEnabledState(): void {
  // mouse section
  if (useMouseInput.checked) {
    mouseSection.classList.remove("disabled");
  } else {
    mouseSection.classList.add("disabled");
  }

  for (const input of mouseSection.querySelectorAll<HTMLInputElement>(
    ".section-settings input, .section-settings select"
  )) {
    input.disabled = !useMouseInput.checked;
  }

  // hotkey section
  if (useHotkeyInput.checked) {
    hotkeySection.classList.remove("disabled");
  } else {
    hotkeySection.classList.add("disabled");
  }

  for (const input of hotkeySection.querySelectorAll<HTMLInputElement>(".section-settings input")) {
    input.disabled = !useHotkeyInput.checked;
  }
}
async function updateDomWithSettings(): Promise<void> {
  triggerTop.value = String(await settings.triggerTop.getValue());
  triggerLeft.value = String(await settings.triggerLeft.getValue());
  triggerRight.value = String(await settings.triggerRight.getValue());
  triggerBottom.value = String(await settings.triggerBottom.getValue());

  useMouseInput.checked = await settings.useMouse.getValue();

  hotkeyInput.value = hotKeyToString(await settings.hotkey.getValue());

  useHotkeyInput.checked = await settings.useHotkey.getValue();

  invertTrigger.checked = await settings.invertTrigger.getValue();
  onlyFullscreen.checked = await settings.onlyFullscreen.getValue();

  injectOptionButtonInput.checked = await settings.injectOptionButton.getValue();
  hideVideoOverlaysInput.checked = await settings.hideVideoOverlays.getValue();
  hidePlayPauseAnimationInput.checked = await settings.hidePlayPauseAnimation.getValue();

  updateSectionEnabledState();
}
function updateTriggerVisualisation(): void {
  const top = Number(triggerTop.value);
  const left = Number(triggerLeft.value);
  const right = Number(triggerRight.value);
  const bottom = Number(triggerBottom.value);

  const topSize = Math.min(
    triggerOverlayHeight / 2,
    Math.max(2, ((Math.atan(top / 100) / (Math.PI / 2)) * triggerOverlayHeight) / 2)
  );
  const leftSize = Math.min(
    triggerOverlayWidth / 2,
    Math.max(2, ((Math.atan(left / 100) / (Math.PI / 2)) * triggerOverlayWidth) / 2)
  );
  const rightSize = Math.min(
    triggerOverlayWidth / 2,
    Math.max(2, ((Math.atan(right / 100) / (Math.PI / 2)) * triggerOverlayWidth) / 2)
  );
  const bottomSize = Math.min(
    triggerOverlayHeight / 2,
    Math.max(2, ((Math.atan(bottom / 100) / (Math.PI / 2)) * triggerOverlayHeight) / 2)
  );

  triggerOverlay.style.borderTopWidth = `${topSize}px`;
  triggerOverlay.style.borderLeftWidth = `${leftSize}px`;
  triggerOverlay.style.borderRightWidth = `${rightSize}px`;
  triggerOverlay.style.borderBottomWidth = `${bottomSize}px`;

  let backgroundColor;
  let bottomTopBorderColor;
  let leftRightBorderColor;
  const disabledBorderColor = "red";

  if (invertTrigger.checked) {
    backgroundColor = "#c8f1aa";
    bottomTopBorderColor = "#f4f4f4";
    leftRightBorderColor = "#e4e4e4";
  } else {
    backgroundColor = "transparent";
    bottomTopBorderColor = "#c8f1aa";
    leftRightBorderColor = "#80bd55";
  }

  triggerOverlay.style.backgroundColor = backgroundColor;

  if (top <= 0) triggerOverlay.style.borderTopColor = disabledBorderColor;
  else triggerOverlay.style.borderTopColor = bottomTopBorderColor;

  if (left <= 0) triggerOverlay.style.borderLeftColor = disabledBorderColor;
  else triggerOverlay.style.borderLeftColor = leftRightBorderColor;

  if (right <= 0) triggerOverlay.style.borderRightColor = disabledBorderColor;
  else triggerOverlay.style.borderRightColor = leftRightBorderColor;

  if (bottom <= 0) triggerOverlay.style.borderBottomColor = disabledBorderColor;
  else triggerOverlay.style.borderBottomColor = bottomTopBorderColor;
}
function updatePreset(): void {
  if (
    triggerTop.value == "0" &&
    triggerLeft.value == "5" &&
    triggerRight.value == "5" &&
    triggerBottom.value == "0" &&
    invertTrigger.checked === false &&
    onlyFullscreen.checked === false
  ) {
    presetSelect.value = "hide";
  } else if (
    triggerTop.value == "70" &&
    triggerLeft.value == "10" &&
    triggerRight.value == "10" &&
    triggerBottom.value == "80" &&
    invertTrigger.checked === true &&
    onlyFullscreen.checked === true
  ) {
    presetSelect.value = "show";
  } else {
    presetSelect.value = "custom";
  }

  for (const selectOption of presetSelectOptions.children) {
    if (selectOption.getAttribute("rel") === presetSelect.value) {
      presetSelectStyled.innerText = selectOption.querySelector<HTMLElement>(".title")!.innerText;
    }
  }
}

const settings = new Settings();

updateDomWithSettings()
  .then(() => {
    updateTriggerVisualisation();
    updatePreset();
  })
  .catch((error: unknown) => {
    console.error("updateDomWithSettings error", error);
  });

triggerTop.addEventListener("input", async () => {
  if (triggerTop.validity.valid) {
    await settings.triggerTop.setValue(Number(triggerTop.value));

    updateTriggerVisualisation();
    updatePreset();
  }
});
triggerLeft.addEventListener("input", async () => {
  if (triggerLeft.validity.valid) {
    await settings.triggerLeft.setValue(Number(triggerLeft.value));

    updateTriggerVisualisation();
    updatePreset();
  }
});
triggerRight.addEventListener("input", async () => {
  if (triggerRight.validity.valid) {
    await settings.triggerRight.setValue(Number(triggerRight.value));

    updateTriggerVisualisation();
    updatePreset();
  }
});
triggerBottom.addEventListener("input", async () => {
  if (triggerBottom.validity.valid) {
    await settings.triggerBottom.setValue(Number(triggerBottom.value));

    updateTriggerVisualisation();
    updatePreset();
  }
});

injectOptionButtonInput.addEventListener("click", async () => {
  await settings.injectOptionButton.setValue(injectOptionButtonInput.checked);
});
hideVideoOverlaysInput.addEventListener("click", async () => {
  await settings.hideVideoOverlays.setValue(hideVideoOverlaysInput.checked);
});
hidePlayPauseAnimationInput.addEventListener("click", async () => {
  await settings.hidePlayPauseAnimation.setValue(hidePlayPauseAnimationInput.checked);
});

useHotkeyInput.addEventListener("click", async () => {
  hotkeyInput.disabled = !useHotkeyInput.checked;
  if (useHotkeyInput.checked) {
    hotkeySection.classList.remove("disabled");
  } else {
    hotkeySection.classList.add("disabled");
  }
  updateSectionEnabledState();

  await settings.useHotkey.setValue(useHotkeyInput.checked);
});

useMouseInput.addEventListener("click", async () => {
  if (useMouseInput.checked) {
    mouseSection.classList.remove("disabled");
  } else {
    mouseSection.classList.add("disabled");
  }
  updateSectionEnabledState();

  await settings.useMouse.setValue(useMouseInput.checked);
});

hotkeyInput.addEventListener("keydown", async (event) => {
  if (event.keyCode < 20 && event.keyCode > 15) return;
  if ((event.target as HTMLInputElement).name !== "hotkey") return;

  event.preventDefault();

  const hotkey = {
    shiftKey: event.shiftKey,
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
    altKey: event.altKey,
    code: event.code,
    key: event.key,
  };

  hotkeyInput.value = hotKeyToString(hotkey);

  await settings.hotkey.setValue(hotkey);
});

invertTrigger.addEventListener("click", async () => {
  updateTriggerVisualisation();
  updatePreset();
  await settings.invertTrigger.setValue(invertTrigger.checked);
});

onlyFullscreen.addEventListener("click", async () => {
  updatePreset();
  await settings.onlyFullscreen.setValue(onlyFullscreen.checked);
});

// preset select
presetSelectStyled.addEventListener("click", (event) => {
  event.stopPropagation();
  if (presetSelect.disabled) {
    return;
  }

  if (presetSelectStyled.classList.contains("active")) {
    presetSelectStyled.classList.remove("active");
    presetSelectOptions.style.display = "none";
  } else {
    presetSelectStyled.classList.add("active");
    presetSelectOptions.style.display = "block";
  }
});

for (const selectOption of presetSelectOptions.children) {
  selectOption.addEventListener("click", async (event) => {
    event.stopPropagation();
    if (presetSelect.disabled) {
      return;
    }

    const chosenPreset = selectOption.getAttribute("rel")!;

    presetSelectStyled.innerText = selectOption.querySelector<HTMLElement>(".title")!.innerText;
    presetSelectStyled.classList.remove("active");
    presetSelect.value = chosenPreset;

    presetSelectOptions.style.display = "none";

    if (chosenPreset === "hide") {
      useMouseInput.checked = true;
      await settings.useMouse.setValue(useMouseInput.checked);
      triggerTop.value = "0";
      await settings.triggerTop.setValue(0);
      triggerLeft.value = "5";
      await settings.triggerLeft.setValue(5);
      triggerRight.value = "5";
      await settings.triggerRight.setValue(5);
      triggerBottom.value = "0";
      await settings.triggerBottom.setValue(0);
      invertTrigger.checked = false;
      await settings.invertTrigger.setValue(invertTrigger.checked);
      onlyFullscreen.checked = false;
      await settings.onlyFullscreen.setValue(onlyFullscreen.checked);

      updateTriggerVisualisation();
      updateSectionEnabledState();
    } else if (chosenPreset === "show") {
      useMouseInput.checked = true;
      await settings.useMouse.setValue(useMouseInput.checked);
      triggerTop.value = "70";
      await settings.triggerTop.setValue(70);
      triggerLeft.value = "10";
      await settings.triggerLeft.setValue(10);
      triggerRight.value = "10";
      await settings.triggerRight.setValue(10);
      triggerBottom.value = "80";
      await settings.triggerBottom.setValue(80);
      invertTrigger.checked = true;
      await settings.invertTrigger.setValue(invertTrigger.checked);
      onlyFullscreen.checked = true;
      await settings.onlyFullscreen.setValue(onlyFullscreen.checked);

      updateTriggerVisualisation();
      updateSectionEnabledState();
    }
  });
}

document.addEventListener("click", () => {
  presetSelectStyled.classList.remove("active");
  presetSelectOptions.style.display = "none";
});

document.querySelector<HTMLElement>("#general .section-title")!.innerText =
  browser.i18n.getMessage("generalSectionTitle");
document.querySelector<HTMLElement>("#injectOptionButton .preference-title")!.innerText =
  browser.i18n.getMessage("injectOptionButtonPreferenceTitle");
document.querySelector<HTMLElement>("#injectOptionButton .preference-description")!.innerText =
  browser.i18n.getMessage("injectOptionButtonPreferenceDescription");
document.querySelector<HTMLElement>("#hideVideoOverlays .preference-title")!.innerText =
  browser.i18n.getMessage("hideVideoOverlaysPreferenceTitle");
document.querySelector<HTMLElement>("#hideVideoOverlays .preference-description")!.innerText =
  browser.i18n.getMessage("hideVideoOverlaysPreferenceDescription");
document.querySelector<HTMLElement>("#hidePlayPauseAnimation .preference-title")!.innerText =
  browser.i18n.getMessage("hidePlayPauseAnimationPreferenceTitle");
document.querySelector<HTMLElement>("#hidePlayPauseAnimation .preference-description")!.innerText =
  browser.i18n.getMessage("hidePlayPauseAnimationPreferenceDescription");

document.querySelector<HTMLElement>("#useMouse .section-title")!.innerText =
  browser.i18n.getMessage("useMouseSectionTitle");
document.querySelector<HTMLElement>("#preset .preference-title")!.innerText =
  browser.i18n.getMessage("presetPreferenceTitle");
document.querySelector<HTMLElement>("#preset .preference-description")!.innerText =
  browser.i18n.getMessage("presetPreferenceDescription");
document.querySelector<HTMLElement>("#preset li[rel=hide] .title")!.innerText =
  browser.i18n.getMessage("presetDropdownHideTitle");
document.querySelector<HTMLElement>("#preset li[rel=hide] .description")!.innerText =
  browser.i18n.getMessage("presetDropdownHideDescription");
document.querySelector<HTMLElement>("#preset li[rel=show] .title")!.innerText =
  browser.i18n.getMessage("presetDropdownShowTitle");
document.querySelector<HTMLElement>("#preset li[rel=show] .description")!.innerText =
  browser.i18n.getMessage("presetDropdownShowDescription");
document.querySelector<HTMLElement>("#preset li[rel=custom] .title")!.innerText =
  browser.i18n.getMessage("presetDropdownCustomTitle");
document.querySelector<HTMLElement>("#triggerDistance .preference-title")!.innerText =
  browser.i18n.getMessage("triggerDistancePreferenceTitle");
document.querySelector<HTMLElement>("#triggerDistance .preference-description")!.innerHTML =
  browser.i18n.getMessage("triggerDistancePreferenceDescription");
document.querySelector<HTMLElement>("#invertTrigger .preference-title")!.innerText =
  browser.i18n.getMessage("invertTriggerPreferenceTitle");
document.querySelector<HTMLElement>("#invertTrigger .preference-description")!.innerText =
  browser.i18n.getMessage("invertTriggerPreferenceDescription");
document.querySelector<HTMLElement>("#onlyFullscreen .preference-title")!.innerText =
  browser.i18n.getMessage("onlyFullscreenPreferenceTitle");
document.querySelector<HTMLElement>("#onlyFullscreen .preference-description")!.innerText =
  browser.i18n.getMessage("onlyFullscreenPreferenceDescription");

document.querySelector<HTMLElement>("#useHotkey .section-title")!.innerText =
  browser.i18n.getMessage("useHotkeySectionTitle");
document.querySelector<HTMLElement>("#hotkey .preference-title")!.innerText =
  browser.i18n.getMessage("hotkeyPreferenceTitle");
document.querySelector<HTMLElement>("#hotkey .preference-description")!.innerHTML =
  browser.i18n.getMessage("hotkeyPreferenceDescription");
hotkeyInput.placeholder = browser.i18n.getMessage("hotkeyPreferencePlaceholder");
