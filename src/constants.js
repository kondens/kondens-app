"use strict";

export const Colors = {
    accent:             "#e91e63",
    background:         "#F8F8F8",
    headerTint:         "#e91e63",
    headerBackground:   "#FFFFFF",
    accentNeutral:      "#607D8B",
    disabled:           "#BBB",
    lowlight:           "#BBB",
    body:               "#808080",
}

export const Fonts = {
    //scaled with major third
    h1Size:     27,
    h1Weight:   "700",
    h2Size:     21,
    h2Weight:   "700",
    h3Size:     17,
    bodySize:   17,
}

export const Routes = {
    STATUS: "routes/status",
    REPORT: "routes/report",
}

export const Mutations = {
    CREATE_STATUS: "!status/create",
    UPDATE_STATUS: "!status/update",
    RESET_STATUS:  "!status/reset",
    SUBMIT_STATUS: "!status/submit",

    ADD_SNAP: "!status/add-snap",

    NAVIGATION_DISPATCH: "!navigation/dispatch",
}

export const Completeness = {
    WIP: "WIP",
    DONE: "DONE",
    CANCELLED: "CANCELLED",
    // NOT_STARTED: "NOT_STARTED",
}

export const RAGs = {
    RED: "RED",
    AMBER: "AMBER",
    GREEN: "GREEN",
}

export const STR = {
    VIEW: {
        STATUS: {
            TITLE: "Task Status"
        },
        REPORT: {
            TITLE: "Report",
        },
    }
}
