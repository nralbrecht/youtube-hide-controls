<script lang="ts">
  import type { Preset } from "@/utils/presets";
  import { presetMatchesSettings, presets } from "@/utils/presets";
  import { addonSettings } from "@/utils/settings";
  import type { AddonSettings } from "@/utils/settings";
  import { browser } from "wxt/browser";
  import { hotKeyToString } from "~/utils/hotkey";

  let settings: AddonSettings = defaultAddonSettings;

  addonSettings
    .getValue()
    .then((newAddonSettings) => {
      settings = newAddonSettings;
    })
    .catch((error) => {
      console.error("error fetching addon setting", error);
    });

  addonSettings.watch((newAddonSettings) => {
    settings = newAddonSettings;
  });

  async function updateAppSettings(): Promise<void> {
    await addonSettings.setValue(settings);
  }

  function handleHotKeyKeyDown(event: KeyboardEvent): void {
    if (event.keyCode < 20 && event.keyCode > 15) return;
    if ((event.target as HTMLInputElement).name !== "hotkey") return;

    event.preventDefault();

    settings.hotkey = {
      shiftKey: event.shiftKey,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      altKey: event.altKey,
      code: event.code,
      key: event.key,
    };
  }

  let presetSelectActive = false;
  function handlePresetSelectClick(): void {
    if (!settings.useMouse) {
      return;
    }

    presetSelectActive = !presetSelectActive;
  }

  function handlePresetOptionClick(clickedPresetId: string): void {
    presetSelectActive = false;

    const clickedPreset = getPresetById(clickedPresetId);
    console.log("handlePresetOptionClick", clickedPresetId, clickedPreset);

    settings = {
      ...settings,
      ...clickedPreset.settings,
    };
  }

  function getCurrentPreset(addonSettings: AddonSettings): Preset {
    const matchingPreset = presets.find((preset) => {
      console.log("getCurrentPreset find", preset);
      return presetMatchesSettings(preset, addonSettings);
    });

    if (matchingPreset) {
      return matchingPreset;
    }

    return presets[presets.length - 1];
  }
  function getPresetById(presetId: string): Preset {
    const matchingPreset = presets.find((preset) => {
      return preset.id === presetId;
    });

    if (matchingPreset) {
      return matchingPreset;
    }

    return presets[presets.length - 1];
  }

  $: currentPreset = getCurrentPreset(settings);

  let triggerOverlayElement: HTMLElement | undefined;
  const TRIGGER_OVERLAY_WIDTH = 300;
  const TRIGGER_OVERLAY_HEIGHT = 168;
  $: {
    const topSize = Math.min(
      TRIGGER_OVERLAY_HEIGHT / 2,
      Math.max(
        2,
        ((Math.atan(settings.trigger.top / 100) / (Math.PI / 2)) * TRIGGER_OVERLAY_HEIGHT) / 2
      )
    );
    const leftSize = Math.min(
      TRIGGER_OVERLAY_WIDTH / 2,
      Math.max(
        2,
        ((Math.atan(settings.trigger.left / 100) / (Math.PI / 2)) * TRIGGER_OVERLAY_WIDTH) / 2
      )
    );
    const rightSize = Math.min(
      TRIGGER_OVERLAY_WIDTH / 2,
      Math.max(
        2,
        ((Math.atan(settings.trigger.right / 100) / (Math.PI / 2)) * TRIGGER_OVERLAY_WIDTH) / 2
      )
    );
    const bottomSize = Math.min(
      TRIGGER_OVERLAY_HEIGHT / 2,
      Math.max(
        2,
        ((Math.atan(settings.trigger.bottom / 100) / (Math.PI / 2)) * TRIGGER_OVERLAY_HEIGHT) / 2
      )
    );

    if (triggerOverlayElement) {
      triggerOverlayElement.style.borderTopWidth = `${topSize}px`;
      triggerOverlayElement.style.borderLeftWidth = `${leftSize}px`;
      triggerOverlayElement.style.borderRightWidth = `${rightSize}px`;
      triggerOverlayElement.style.borderBottomWidth = `${bottomSize}px`;

      let backgroundColor;
      let bottomTopBorderColor;
      let leftRightBorderColor;
      const disabledBorderColor = "red";

      if (settings.invertTrigger) {
        backgroundColor = "#c8f1aa";
        bottomTopBorderColor = "#f4f4f4";
        leftRightBorderColor = "#e4e4e4";
      } else {
        backgroundColor = "transparent";
        bottomTopBorderColor = "#c8f1aa";
        leftRightBorderColor = "#80bd55";
      }

      triggerOverlayElement.style.backgroundColor = backgroundColor;

      if (settings.trigger.top <= 0)
        triggerOverlayElement.style.borderTopColor = disabledBorderColor;
      else triggerOverlayElement.style.borderTopColor = bottomTopBorderColor;

      if (settings.trigger.left <= 0)
        triggerOverlayElement.style.borderLeftColor = disabledBorderColor;
      else triggerOverlayElement.style.borderLeftColor = leftRightBorderColor;

      if (settings.trigger.right <= 0)
        triggerOverlayElement.style.borderRightColor = disabledBorderColor;
      else triggerOverlayElement.style.borderRightColor = leftRightBorderColor;

      if (settings.trigger.bottom <= 0)
        triggerOverlayElement.style.borderBottomColor = disabledBorderColor;
      else triggerOverlayElement.style.borderBottomColor = bottomTopBorderColor;
    }
  }
</script>

{@debug settings}
{@debug currentPreset}

<svelte:document on:click={() => (presetSelectActive = false)} />

<div class="section" id="general">
  <div class="section-header">
    <div class="section-title">{browser.i18n.getMessage("generalSectionTitle")}</div>
  </div>
  <div class="section-settings">
    <div class="preference no-border" id="injectOptionButton">
      <label class="preference-header">
        <label class="switch">
          <input
            type="checkbox"
            name="injectOptionButton"
            bind:checked={settings.injectOptionButton}
            on:click={updateAppSettings}
          />
          <span class="slider"></span>
        </label>
        <div class="preference-title">
          {browser.i18n.getMessage("injectOptionButtonPreferenceTitle")}
        </div>
      </label>
      <div class="preference-input">
        <div class="preference-description">
          {browser.i18n.getMessage("injectOptionButtonPreferenceDescription")}
        </div>
      </div>
    </div>
    <div class="preference" id="hideVideoOverlays">
      <label class="preference-header">
        <label class="switch">
          <input
            type="checkbox"
            name="hideVideoOverlays"
            bind:checked={settings.hideVideoOverlays}
            on:click={updateAppSettings}
          />
          <span class="slider"></span>
        </label>
        <div class="preference-title">
          {browser.i18n.getMessage("hideVideoOverlaysPreferenceTitle")}
        </div>
      </label>
      <div class="preference-input">
        <div class="preference-description">
          {browser.i18n.getMessage("hideVideoOverlaysPreferenceDescription")}
        </div>
      </div>
    </div>
    <div class="preference" id="hidePlayPauseAnimation">
      <label class="preference-header">
        <label class="switch">
          <input
            type="checkbox"
            name="hidePlayPauseAnimation"
            bind:checked={settings.hidePlayPauseAnimation}
            on:click={updateAppSettings}
          />
          <span class="slider"></span>
        </label>
        <div class="preference-title">
          {browser.i18n.getMessage("hidePlayPauseAnimationPreferenceTitle")}
        </div>
      </label>
      <div class="preference-input">
        <div class="preference-description">
          {browser.i18n.getMessage("hidePlayPauseAnimationPreferenceDescription")}
        </div>
      </div>
    </div>
  </div>
</div>

<div class="section" id="useMouse" class:disabled={!settings.useMouse}>
  <label class="section-header">
    <label class="switch">
      <input
        type="checkbox"
        name="useMouse"
        bind:checked={settings.useMouse}
        on:click={updateAppSettings}
      />
      <span class="slider"></span>
    </label>
    <div class="section-title">{browser.i18n.getMessage("useMouseSectionTitle")}</div>
  </label>
  <div class="section-settings">
    <div class="preference no-border" id="preset">
      <div class="preference-header">
        <div class="preference-title">{browser.i18n.getMessage("presetPreferenceTitle")}</div>
      </div>
      <div class="preference-input">
        <div class="preference-description">
          {browser.i18n.getMessage("presetPreferenceDescription")}
        </div>
        <div class="select">
          <div
            class="select-styled"
            class:active={presetSelectActive}
            on:click|stopPropagation={handlePresetSelectClick}
          >
            {currentPreset.title}
          </div>
          {#if presetSelectActive}
            <ul class="select-options">
              {#each presets as preset}
                <li
                  class:active={currentPreset.id === preset.id}
                  on:click|stopPropagation={() => handlePresetOptionClick(preset.id)}
                >
                  <div class="title">{preset.title}</div>
                  {#if preset.description}
                    <div class="description">
                      {preset.description}
                    </div>
                  {/if}
                </li>
              {/each}
            </ul>
          {/if}
        </div>
      </div>
    </div>
    <div class="preference" id="triggerDistance">
      <div class="preference-header">
        <div class="preference-title">
          {browser.i18n.getMessage("triggerDistancePreferenceTitle")}
        </div>
      </div>
      <div class="preference-input">
        <div class="preference-description">
          {@html browser.i18n.getMessage("triggerDistancePreferenceDescription")}
        </div>
        <div class="trigger-wrapper">
          <div class="trigger-inputs">
            <input
              type="number"
              name="Left"
              id="left"
              min="0"
              step="1"
              bind:value={settings.trigger.left}
              on:input={updateAppSettings}
              disabled={!settings.useMouse}
            />
            <input
              type="number"
              name="Top"
              id="top"
              min="0"
              step="1"
              bind:value={settings.trigger.top}
              on:input={updateAppSettings}
              disabled={!settings.useMouse}
            />
            <input
              type="number"
              name="Right"
              id="right"
              min="0"
              step="1"
              bind:value={settings.trigger.right}
              on:input={updateAppSettings}
              disabled={!settings.useMouse}
            />
            <input
              type="number"
              name="Bottom"
              id="bottom"
              min="0"
              step="1"
              bind:value={settings.trigger.bottom}
              on:input={updateAppSettings}
              disabled={!settings.useMouse}
            />
          </div>
          <div class="trigger-overlay" bind:this={triggerOverlayElement}></div>
        </div>
      </div>
    </div>
    <div class="preference" id="invertTrigger">
      <label class="preference-header">
        <label class="switch">
          <input
            type="checkbox"
            name="invertTrigger"
            bind:checked={settings.invertTrigger}
            on:click={updateAppSettings}
            disabled={!settings.useMouse}
          />
          <span class="slider"></span>
        </label>
        <div class="preference-title">
          {browser.i18n.getMessage("invertTriggerPreferenceTitle")}
        </div>
      </label>
      <div class="preference-input">
        <div class="preference-description">
          {browser.i18n.getMessage("invertTriggerPreferenceDescription")}
        </div>
      </div>
    </div>
    <div class="preference" id="onlyFullscreen">
      <label class="preference-header">
        <label class="switch">
          <input
            type="checkbox"
            name="onlyFullscreen"
            bind:checked={settings.onlyFullscreen}
            on:click={updateAppSettings}
            disabled={!settings.useMouse}
          />
          <span class="slider"></span>
        </label>
        <div class="preference-title">
          {browser.i18n.getMessage("onlyFullscreenPreferenceTitle")}
        </div>
      </label>
      <div class="preference-input">
        <div class="preference-description">
          {browser.i18n.getMessage("onlyFullscreenPreferenceDescription")}
        </div>
      </div>
    </div>
  </div>
</div>

<div class="section" id="useHotkey" class:disabled={!settings.useHotkey}>
  <label class="section-header">
    <label class="switch">
      <input
        type="checkbox"
        name="useHotkey"
        bind:checked={settings.useHotkey}
        on:click={updateAppSettings}
      />
      <span class="slider"></span>
    </label>
    <div class="section-title">{browser.i18n.getMessage("useHotkeySectionTitle")}</div>
  </label>
  <div class="section-settings">
    <div class="preference no-border" id="hotkey">
      <div class="preference-header">
        <div class="preference-title">{browser.i18n.getMessage("hotkeyPreferenceTitle")}</div>
      </div>
      <div class="preference-input">
        <div class="preference-description">
          {@html browser.i18n.getMessage("hotkeyPreferenceDescription")}
        </div>
        <input
          type="text"
          name="hotkey"
          placeholder={browser.i18n.getMessage("hotkeyPreferencePlaceholder")}
          disabled={!settings.useHotkey}
          value={hotKeyToString(settings.hotkey)}
          on:keydown={handleHotKeyKeyDown}
        />
      </div>
    </div>
  </div>
</div>
