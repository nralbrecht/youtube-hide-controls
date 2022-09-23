export class PlayerStateMachine {
    constructor(showControls, hideControls, settings) {
        if (settings.invertTrigger) {
            this.state = "shownInverted";
        }
        else {
            this.state = "shown";
        }

        settings.addOnChangeListener(() => {
            this.send("settingsChanged");
        });

        const standartDefinitions = {
            hidden: {
                actions: {
                    onEnter: hideControls
                },
                transitions: {
                    fullscreenEntered: {
                        target: "hiddenFullscreen",
                    },
                    mouseTriggerZoneExited: {
                        target: "shown",
                        guard() {
                            return !settings.onlyFullscreen;
                        },
                    },
                    hotkey: {
                        target: "shown",
                    },
                },
            },
            shown: {
                actions: {
                    onEnter: showControls
                },
                transitions: {
                    fullscreenEntered: {
                        target: "shownFullscreen",
                    },
                    mouseTriggerZoneEntered: {
                        target: "hidden",
                        guard() {
                            return !settings.onlyFullscreen;
                        },
                    },
                    hotkey: {
                        target: "hidden",
                    },
                },
            },
            hiddenFullscreen: {
                actions: {
                    onEnter: hideControls
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
                    onEnter: showControls
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

        const invertedDefinitions = {
            hiddenInverted: {
                actions: {
                    onEnter: hideControls
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
                    onEnter: showControls
                },
                transitions: {
                    fullscreenEntered: {
                        target: "shownFullscreenInverted",
                    },
                    hotkey: {
                        target: "hiddenInverted",
                    },
                },
            },
            hiddenFullscreenInverted: {
                actions: {
                    onEnter: hideControls
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
                    onEnter: showControls
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
        }

        // switch from/to the inverted state when the "invertTrigger" setting changes
        for (let state in invertedDefinitions) {
            invertedDefinitions[state].transitions["settingsChanged"] = {
                target: state.substring(0, state.length - "Inverted".length),
                guard() {
                    return settings.invertTrigger;
                }
            }
        }

        for (let state in standartDefinitions) {
            standartDefinitions[state].transitions["settingsChanged"] = {
                target: state + "Inverted",
                guard() {
                    return !settings.invertTrigger;
                }
            }
        }

        this.stateDefinitions = {
            ...standartDefinitions,
            ...invertedDefinitions
        };
    }

    send(event) {
        const currentStateDefinition = this.stateDefinitions[this.state];
        const destinationTransition = currentStateDefinition.transitions[event];

        if (!destinationTransition) {
            return;
        }

        const destinationState = destinationTransition.target;
        const destinationStateDefinition = this.stateDefinitions[destinationState];

        if (destinationTransition.guard && destinationTransition.guard()) {
            return;
        }

        destinationStateDefinition.actions.onEnter();

        console.log("[youtube-hide-controls] event:", event, "transitioning: ", this.state, "=>", destinationState);
        this.state = destinationState;
        return this.state;
    }
}
