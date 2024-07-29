import { EventFromLogic, createActor, setup } from "xstate";
import type { AddonSettings } from "./settings";

export class PlayerStateMachine {
  private actor;
  private machine;
  private settings?: AddonSettings;

  constructor(showControls: () => void, hideControls: () => void) {
    this.machine = setup({
      types: {
        context: {} as Record<string, never>,
        events: {} as
          | { type: "hotkeyPressed" }
          | { type: "fullscreenEntered" }
          | { type: "fullscreenExited" }
          | { type: "mouseTriggerZoneExited" }
          | { type: "mouseTriggerZoneEntered" }
          | { type: "mouseTriggerSetInverted" }
          | { type: "mouseTriggerSetNormal" }
          | { type: "initialized" },
      },
      actions: {
        showControls: function () {
          showControls();
        },
        hideControls: function () {
          hideControls();
        },
      },
      guards: {
        notOnlyFullscreen: (): boolean => {
          if (!this.settings) {
            throw new Error("Settings are required to be loaded when starting the machine");
          }

          return !this.settings.onlyFullscreen;
        },
        invertMouseTrigger: (): boolean => {
          if (!this.settings) {
            throw new Error("Settings are required to be loaded when starting the machine");
          }
          console.log("guard invertMouseTrigger");
          return this.settings.invertTrigger;
        },
      },
    }).createMachine({
      /** @xstate-layout N4IgpgJg5mDOIC5QAcA2BDAnmATgYQHsA7AFxwNVgDoBLImkgYjoZvVRoC9IBtABgC6iFAVitiwkAA9EAVgDsVWQDYAjAE4AHMq0AWTat3qATABoQmRKr66+VTSs0BmJ+r46txgL5fzaLLiEpOSUtPRMLCRsHNwQPKpCSCDIouJEkjII8pr2xrqOusqaxvKy2uaWCMZOVK55uvLqDXx8TmqaPn4Y2PjEZBTUdABuuCSQVLAAFgQA7kSMAGYArqiUAMY4YGBEAKKkuLyCkiliURJJmaU5JpqFThoO9+oVVirGVPJO8saqTg7y+k0HV8yW6gT6IUGRBGODGEAm0zmjAAtgQlrAwAAVHA0KAwHAALWIYB2UgYh0SIlONHOoEyymU71U1Uaqm++jyzwsVl0bSoeVa6msjJcTk6oICvWCAzCMLhCNm82mJAA1mBMAAFTawDFxI5JE5pDKIeRFKjqNxNWRC+QApovBCGW3m5l-P6qNSqVSycX+HpBfqhYajcZTRUotEY7G4-EAZTAJAAcgQcMj2PxKclUmd0hdEE5dLp+WyTN7lPJfrbZA6DMpzfp5C11LbWrpvCC-eDpUHoSH4ZMaBAINsAGIrdabbaLcewDZbXZkuEZ47Zmm5ulWbTqJSFdzqAuyFqqB1e038vjqRlFb5OGy+sFSwNQuXjAdD0czudT1HorE4vG4ESRAkvsmx6pmho5sajrOKoVC6L8hgWvcxh8LcJ7GGU9gKLIsj5CYth8O2XSSgGkKyn2VBvsORBjqss6TkqBCquqWpwLqy4GqutLSJunzmsoLQHk4shtKaGGqDkxiCQonxXtJPodg+ZEysGsKvoONF0RO84Rr+0YATg8ZJimaaoJxVJGnmVRejUtzVMoZRFPohQ1h69baGhxjVMYmjNvepEQqpvbqf2mlTss9FfrsoEUiu1I8ZkkmaHYKU-CJwqOZJJ6iTkJZtt5RhAsoAX+kFPYvmF77zD+Ub-viQEgWMYEWVmCXrrxCCOXWDSyCUCHqNaAISYo+6GM4eTKEYfylV2T4UaFVHhUxLGatqHH6pZUHWaa1xCq02gVtNmgYdaVCGH8Fq8mNd5KYF3bPpR1HfpGf4xrgxnJqm6abW1VkbggFrbjomjfGyt5aL8bl1k0nnFD5fnyLNj7kWp8phnM2kMbpkU6dspLkuB8X-Z1ppFgoRSg82bR-GY3KOn1dh8Ka6WXhWgmqMjKkVZRGO0Z+jF6XV72EsSBNLr9kFrtBkmiQJjKHqUfAqMzJ75LIVCOS0KWWhaytc+Vj2LXzWPRYwypqmt7FxVx7Uy35qVTSloouGUauXprALlkRtklXdZUPQt6OIvzUWC7Vb2GZ9pk-RB3EdUlhSKLyIlDV8QLZfTtYeY2F4tgWxESgH81EDHqAKkiuPY-jsVE7bJOXGo-Kg22oqyA88gOioRZTTYVbIa2BuB6X33l3zQuRw1Yu161UuJYgjk5M4vIlGhyh-HhDoNNu6duAYbZtopJHF+RI9mRXK2W2xOo21t0s7RWtRGG4MmFh6x70317xtAoB1GER+t-ZzVPmXC+E8DJxgTAASRChLOOdtrL5CLD8PgbJCy3GKJvempoNalFKPuSGU0-bH2ATKM+7AL6m0FlXaK4tb5-W2gDZktxPbry0I2NsFoP6VG9IoBSFpTS3myK4IeJdQEmwFrpCOEDALT2avQueCdNy8lqBoPC3kKzuBElvEwxZmSDWZuyGaQCUZkPESHKhukLasXWgo+O9sHD2AZG2a8X8ShdxcKorQrRShlkMKIkBo9KGSJevpeqH1oGwLsQgphChtxekZI2ARhRQYOhwR8HCqCNFuA9AEsxQTnrzBoYxPY8i6533njBUo9hBRvxVsrOmlQ4nnWsNoMoLhWgXjyaEch5dCngPCaLYCdDykMPvgDZx8FiiNGKG6KaDpjAewrKDIi+CGndOoL0pa1VzbMSvrY0ZijoK2jggWC0fVeTMOcAs3C50vgIVptYdwbYNlUC2f06RgzjIwMqrPex1kvRek1sKe43tpImDSY5DJ+DXC1kKK895y1LERRCQuQmfyYmdWYT3QR7CbCLKFCeNk5pUJTTbBeP4gkkYmO5ps0BhTkU1VejIoZJJFzRIbso64RRlbNiBhdBZji2QoKtIrEoxCi6kJ6fSpFqLdmrWvhteBnKYKOO0FNaSoM3Gd3pnkGouFSX7jaD8cGCKZXVUZQMkW3yomHP+QDbyeRzqoVbG0C8uEdWVHSXgoo5YRKuFuiCUuw54AGmUobYmjDOoAFpDA9UGluQw7hMIOljagpQjQvgcIBACXyrzIiRvGTGrQ8EE06CTYyZ+J4bCpRUCYBkVKD75ttYWypbp4LXi+JJJoXxcLVsLOeS8vwrS3CPpK0xPNjYh1bUohAlyO2gy7X5XkpRqz01+J4poTRK3WjwsUZtlVtlaVRTO6CPxnBKCcCUAwE1WS6BPKKes268i7o5Aep6y1T0AvcBrQo5bUIuXcA+zdRhcJ9V+Is6S76p2KkZV+2JIl7AFjLLYAwt573rsfVuwoL7BpvppYbN5Zd4OdXbSk4RKh155zXZUWNRZmb7j6oNSlzJ4UEeHuYxUJHMjzvI84SjENSgOjaHBIqGhPh-FtAyM1QSJFh3nNx14iHl7IaFCoNRwmm5ieppJ00ErOwTrpQUz99co1JR-R2ooGhFl-qhvTETpbihuAvJhH4Mnz4MpPaZotmRz36qvUUNwjQ+6adE5DHToM9M+B8EAA */
      context: {},
      id: "playerControls",
      initial: "init",
      states: {
        init: {
          on: {
            initialized: [
              {
                target: "inverted",
                guard: {
                  type: "invertMouseTrigger",
                },
              },
              {
                target: "normal",
              },
            ],
          },
        },
        inverted: {
          initial: "shown",
          description: "Parent state for all inverted states.",
          states: {
            shown: {
              on: {
                fullscreenEntered: {
                  target: "hiddenFullscreen",
                },
                mouseTriggerZoneExited: {
                  target: "hidden",
                  guard: {
                    type: "notOnlyFullscreen",
                  },
                },
                hotkeyPressed: {
                  target: "hidden",
                },
                mouseTriggerSetNormal: {
                  target: "#playerControls.normal.shown",
                },
              },
              entry: {
                type: "showControls",
              },
            },
            hiddenFullscreen: {
              on: {
                fullscreenExited: {
                  target: "shown",
                },
                mouseTriggerZoneEntered: {
                  target: "shownFullscreen",
                },
                hotkeyPressed: {
                  target: "shownFullscreen",
                },
                mouseTriggerSetNormal: {
                  target: "#playerControls.normal.hiddenFullscreen",
                },
              },
              entry: {
                type: "hideControls",
              },
            },
            hidden: {
              on: {
                fullscreenEntered: {
                  target: "hiddenFullscreen",
                },
                mouseTriggerZoneEntered: {
                  target: "shown",
                  guard: {
                    type: "notOnlyFullscreen",
                  },
                },
                hotkeyPressed: {
                  target: "shown",
                },
                mouseTriggerSetNormal: {
                  target: "#playerControls.normal.hidden",
                },
              },
              entry: {
                type: "hideControls",
              },
            },
            shownFullscreen: {
              on: {
                fullscreenExited: {
                  target: "shown",
                },
                mouseTriggerZoneExited: {
                  target: "hiddenFullscreen",
                },
                hotkeyPressed: {
                  target: "hiddenFullscreen",
                },
                mouseTriggerSetNormal: {
                  target: "#playerControls.normal.shownFullscreen",
                },
              },
              entry: {
                type: "showControls",
              },
            },
          },
        },
        normal: {
          initial: "shown",
          description: "Parent state for all non-inverted states.",
          states: {
            shown: {
              on: {
                fullscreenEntered: {
                  target: "shownFullscreen",
                },
                mouseTriggerZoneEntered: {
                  target: "hidden",
                  guard: {
                    type: "notOnlyFullscreen",
                  },
                },
                hotkeyPressed: {
                  target: "hidden",
                },
                mouseTriggerSetInverted: {
                  target: "#playerControls.inverted.shown",
                },
              },
              entry: {
                type: "showControls",
              },
            },
            shownFullscreen: {
              on: {
                fullscreenExited: {
                  target: "shown",
                },
                mouseTriggerZoneEntered: {
                  target: "hiddenFullscreen",
                },
                hotkeyPressed: {
                  target: "hiddenFullscreen",
                },
                mouseTriggerSetInverted: {
                  target: "#playerControls.inverted.shownFullscreen",
                },
              },
              entry: {
                type: "showControls",
              },
            },
            hidden: {
              on: {
                fullscreenEntered: {
                  target: "hiddenFullscreen",
                },
                mouseTriggerZoneExited: {
                  target: "shown",
                  guard: {
                    type: "notOnlyFullscreen",
                  },
                },
                hotkeyPressed: {
                  target: "shown",
                },
                mouseTriggerSetInverted: {
                  target: "#playerControls.inverted.hidden",
                },
              },
              entry: {
                type: "hideControls",
              },
            },
            hiddenFullscreen: {
              on: {
                fullscreenExited: {
                  target: "shown",
                },
                mouseTriggerZoneExited: {
                  target: "shownFullscreen",
                },
                hotkeyPressed: {
                  target: "shownFullscreen",
                },
                mouseTriggerSetInverted: {
                  target: "#playerControls.inverted.hiddenFullscreen",
                },
              },
              entry: {
                type: "hideControls",
              },
            },
          },
        },
      },
    });

    this.actor = createActor(this.machine);

    addonSettings
      .getValue()
      .then((newSettings) => {
        this.settings = newSettings;

        this.actor.start();
        this.actor.send({ type: "initialized" });
      })
      .catch((error) => {
        console.error(
          "unable to initialize state machine because an error occured while fetching settings",
          error
        );
      });

    addonSettings.watch((newSettings, oldSettings) => {
      this.settings = newSettings;

      if (newSettings.invertTrigger !== oldSettings.invertTrigger) {
        if (newSettings.invertTrigger) {
          this.actor.send({ type: "mouseTriggerSetInverted" });
        } else {
          this.actor.send({ type: "mouseTriggerSetNormal" });
        }
      }
    });
  }

  send(event: EventFromLogic<typeof this.machine>): void {
    const oldState = this.actor.getSnapshot().value;

    this.actor.send(event);

    console.debug(
      "[youtube-hide-controls] event:",
      event.type,
      "transitioning from",
      oldState,
      " to ",
      this.actor.getSnapshot().value
    );
  }
}
