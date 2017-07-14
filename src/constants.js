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
}

export const Mutations = {
    SUBMIT_STATUS: "!status/submit",
    
    NAVIGATION_DISPATCH: "!navigation/dispatch",
}

export const Completeness = {
    WIP: "WIP",
    DONE: "DONE",
    CANCELLED: "CANCELLED",
    NOT_STARTED: "NOT_STARTED",
}

export const RAG = {
    RED: "RED",
    AMBER: "AMBER",
    GREEN: "GREEN",
}

export const STR = {
    VIEW: {
        STATUS: {
            TITLE: "Status Report"
        }
    }
}
