"use strict";

export const Colors = {
    accent:             "#E8606E", // "#e91e63",
    background:         "#F3F3F3", //"#F8F8F8",
    headerTint:         "#e91e63",
    headerBackground:   "#FFFFFF",
    accentNeutral:      "#75A3BC", // "#607D8B",
    disabled:           "#BBB",
    lowlight:           "#BBB",
    body:               "rgba(0,0,0,0.54)", // "#808080",
    primaryText:        "rgba(0,0,0,0.87)",
    inverseText:        "#FFFFFF",

    risk: "#FFC107",
    issue: "#EF5350",
    amber: "#FFC107",
    next: "#607D8B",
    achievement: "#76C47D",
    decision: "#607D8B",
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
    ADD_REPORTABLE: "!status/add-reportable",
    CANCEL_ADD_REPORTABLE: "!status/cancel-add-reportable",

    UPDATE_REPORTABLE: "!reportable/update",

    INCLUDE_REPORTABLE: "!report/include-reportable",
    EXCLUDE_REPORTABLE: "!report/exclude-reportable",
    SHOW_EXCLUDED_REPORTABLES: "!report/show-reportables",
    HIDE_EXCLUDED_REPORTABLES: "!report/hide-reportables",
    UPDATE_REPORTABLE_ORDER: "!report/update-reportable-order",

    ADD_SNAP: "!status/add-snap",

    NAVIGATION_DISPATCH: "!navigation/dispatch",
}

export const ReportType = {
    ACHIEVEMENT: "Achievement",
    RISK: "Risk",
    ISSUE: "Issue",
    NEXT: "Next",
    DECISION: "Decision",
}

export const RAGs = {
    RED: "RED",
    AMBER: "AMBER",
    GREEN: "GREEN",
    DONE: "DONE",
}

export const RagColor = {
    [RAGs.GREEN]: Colors.achievement,
    [RAGs.AMBER]: Colors.amber,
    [RAGs.RED]: Colors.issue,
    [RAGs.DONE]: "#CCC",
}

export const RagSymbol = {
    [RAGs.GREEN]: "thumbs-up",
    [RAGs.AMBER]: "bell",
    [RAGs.RED]: "exclamation-triangle",   
}

export const STR = {
    VIEW: {
        STATUS: {
            TITLE: "Task Status",
            NEW_ACHIEVEMENT: "Neues Achievement",
            NEW_RISK: "Neues Risk",
            NEW_ISSUE: "Neues Issue",
        },
        REPORT: {
            TITLE: "Report",
        },
        ADD_REPORTABLE: {
            TITLE: "Hinzufügen",
        },
    }
}
