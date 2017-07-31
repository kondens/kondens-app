"use strict";

export const Colors = {
    accent:             "#e91e63",
    background:         "#F3F3F3", //"#F8F8F8",
    headerTint:         "#e91e63",
    headerBackground:   "#FFFFFF",
    accentNeutral:      "#607D8B",
    disabled:           "#BBB",
    lowlight:           "#BBB",
    body:               "rgba(0,0,0,0.54)", // "#808080",
    primaryText:        "rgba(0,0,0,0.87)",
    inverseText:        "#FFFFFF",

    risk: "#FF8A65",
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

    UPDATE_REPORTABLE: "!reportable/update",

    INCLUDE_REPORTABLE: "!report/include-reportable",
    EXCLUDE_REPORTABLE: "!report/exclude-reportable",
    SHOW_EXCLUDED_REPORTABLES: "!report/show-reportables",
    HIDE_EXCLUDED_REPORTABLES: "!report/hide-reportables",

    ADD_SNAP: "!status/add-snap",

    NAVIGATION_DISPATCH: "!navigation/dispatch",
}

export const ReportType = {
    ACHIEVEMENT: "achievement",
    RISK: "risk",
    ISSUE: "issue",
    NEXT: "next",
    DECISION: "decision",
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

export const RagColor = {
    [RAGs.GREEN]: Colors.achievement,
    [RAGs.AMBER]: Colors.amber,
    [RAGs.RED]: Colors.issue,
}

export const RagSymbol = {
    [RAGs.GREEN]: "thumbs-up",
    [RAGs.AMBER]: "bell",
    [RAGs.RED]: "exclamation-triangle",   
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
