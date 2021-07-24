import {createMachine, send, sendParent} from "xstate";

export type CreateProfileContext = {
    firstName: string;
    lastName?: string;
    cityId: number;
    passion?: string;
    avatarUrl?: string;
}

export type CreateProfileEvent = {
    type: "CANCEL"
} | {
    type: "CANCELLED"
}| {
    type: "SUBMIT"
}| {
    type: "PROFILE_CREATED"
}

export const createProfileMachine = createMachine<CreateProfileContext, CreateProfileEvent>({
    initial: "firstName",
    context: {
        firstName: null,
        lastName: null,
        cityId: null,
        passion: null,
        avatarUrl: null
    },
    on: {
        CANCEL: {
            target: "cancelled"
        }
    },
    states: {
        firstName: {
            invoke: {src: "promptFirstName"},
            on: {
                SUBMIT: {
                    actions: "assignFirstNameToContext",
                    target: "lastName"
                }
            }
        },
        lastName: {
            invoke: {src: "promptLastName"},
            on: {
                SUBMIT: {
                    actions: "assignLastNameToContext",
                    target: "city"
                }
            }
        },
        city: {
            invoke: {src: "promptCity"},
            on: {
                SUBMIT: {
                    actions: "assignCityToContext",
                    target: "passion"
                }
            }
        },
        passion: {
            invoke: {src: "promptPassion"},
            on: {
                SUBMIT: {
                    actions: "assignPassionToContext",
                    target: "picture"
                }
            }
        },
        picture: {
            invoke: {src: "promptPicture"},
            on: {
                SUBMIT: {
                    actions: "assignPictureToContext",
                    target: "success"
                }
            }
        },
        cancelled: {
            type: "final",
            entry: sendParent({type: "CANCELLED"})
        },
        success: {
            type: "final",
            entry: sendParent({type: "PROFILE_CREATED"})
        }
    }
}, {
    services: {
        promptFirstName: async (context, event) => {
            send({type: "SUBMIT"});
        },
        promptLastName: async (context, event) => {
            send({type: "SUBMIT"});
        },
        promptCity: async (context, event) => {
            send({type: "SUBMIT"});
        },
        promptPassion: async (context, event) => {
            send({type: "SUBMIT"});
        },
        promptPicture: async (context, event) => {
            send({type: "SUBMIT"});
        }
    },
    actions: {
        assignFirstNameToContext: (context, event) => {},
        assignLastNameToContext: (context, event) => {},
        assignCityToContext: (context, event) => {},
        assignPassionToContext: (context, event) => {},
        assignPictureToContext: (context, event) => {}
    }
});