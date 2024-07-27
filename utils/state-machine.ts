interface StateDefinitions {
  actions: {
    onEnter: () => unknown;
  };
  transitions: Record<
    string,
    {
      target: string;
      guard?: () => Promise<boolean> | boolean;
    }
  >;
}

export class PlayerStateMachine {
  private state = "shown";
  private stateDefinitions: Record<string, StateDefinitions>;

  constructor(showControls: () => void, hideControls: () => void) {
    addonSettings
      .getValue()
      .then((settings) => {
        if (settings) {
          this.state = "shownInverted";
        } else {
          this.state = "shown";
        }
      })
      .catch((error) => {
        console.error("error loading settings", error);
      });

    const standartDefinitions: Record<string, StateDefinitions> = {
      hidden: {
        actions: {
          onEnter: hideControls,
        },
        transitions: {
          fullscreenEntered: {
            target: "hiddenFullscreen",
          },
          mouseTriggerZoneExited: {
            target: "shown",
            async guard(): Promise<boolean> {
              return !(await addonSettings.getValue()).onlyFullscreen;
            },
          },
          hotkey: {
            target: "shown",
          },
        },
      },
      shown: {
        actions: {
          onEnter: showControls,
        },
        transitions: {
          fullscreenEntered: {
            target: "shownFullscreen",
          },
          mouseTriggerZoneEntered: {
            target: "hidden",
            async guard(): Promise<boolean> {
              return !(await addonSettings.getValue()).onlyFullscreen;
            },
          },
          hotkey: {
            target: "hidden",
          },
        },
      },
      hiddenFullscreen: {
        actions: {
          onEnter: hideControls,
        },
        transitions: {
          fullscreenExited: {
            target: "shown",
          },
          mouseTriggerZoneExited: {
            target: "shownFullscreen",
          },
          hotkey: {
            target: "shownFullscreen",
          },
        },
      },
      shownFullscreen: {
        actions: {
          onEnter: showControls,
        },
        transitions: {
          fullscreenExited: {
            target: "shown",
          },
          mouseTriggerZoneEntered: {
            target: "hiddenFullscreen",
          },
          hotkey: {
            target: "hiddenFullscreen",
          },
        },
      },
    };

    const invertedDefinitions: Record<string, StateDefinitions> = {
      hiddenInverted: {
        actions: {
          onEnter: hideControls,
        },
        transitions: {
          fullscreenEntered: {
            target: "hiddenFullscreenInverted",
          },
          mouseTriggerZoneEntered: {
            target: "shownInverted",
          },
          mouseTriggerZoneExited: {
            target: "shownInverted",
          },
          hotkey: {
            target: "shownInverted",
          },
        },
      },
      shownInverted: {
        actions: {
          onEnter: showControls,
        },
        transitions: {
          fullscreenEntered: {
            target: "hiddenFullscreenInverted",
          },
          hotkey: {
            target: "hiddenInverted",
          },
        },
      },
      hiddenFullscreenInverted: {
        actions: {
          onEnter: hideControls,
        },
        transitions: {
          fullscreenExited: {
            target: "shownInverted",
          },
          mouseTriggerZoneEntered: {
            target: "shownFullscreenInverted",
          },
          hotkey: {
            target: "shownFullscreenInverted",
          },
        },
      },
      shownFullscreenInverted: {
        actions: {
          onEnter: showControls,
        },
        transitions: {
          fullscreenExited: {
            target: "shownInverted",
          },
          mouseTriggerZoneExited: {
            target: "hiddenFullscreenInverted",
          },
          hotkey: {
            target: "hiddenFullscreenInverted",
          },
        },
      },
    };

    // switch from/to the inverted state when the "invertTrigger" setting changes
    for (const state in invertedDefinitions) {
      invertedDefinitions[state].transitions["settingsChanged"] = {
        target: state.substring(0, state.length - "Inverted".length),
        async guard(): Promise<boolean> {
          return (await addonSettings.getValue()).invertTrigger;
        },
      };
    }

    for (const state in standartDefinitions) {
      standartDefinitions[state].transitions["settingsChanged"] = {
        target: state + "Inverted",
        async guard(): Promise<boolean> {
          return !(await addonSettings.getValue()).invertTrigger;
        },
      };
    }

    this.stateDefinitions = {
      ...standartDefinitions,
      ...invertedDefinitions,
    };
  }

  async send(event: string): Promise<string | undefined> {
    const currentStateDefinition = this.stateDefinitions[this.state];
    const destinationTransition = currentStateDefinition.transitions[event];

    if (!destinationTransition) {
      return;
    }

    const destinationState = destinationTransition.target;
    const destinationStateDefinition = this.stateDefinitions[destinationState];

    if (destinationTransition.guard && (await destinationTransition.guard())) {
      return;
    }

    destinationStateDefinition.actions.onEnter();

    console.log(
      "[youtube-hide-controls] event:",
      event,
      "transitioning: ",
      this.state,
      "=>",
      destinationState
    );
    this.state = destinationState;
    return this.state;
  }
}
