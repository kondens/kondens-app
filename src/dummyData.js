"use strict";

import d                from "@clockworks/datascript";

import moment       from "moment";

import { Completeness,
         RAGs }    from "./constants";

export const dummyData = [
    {
        "db/ident": ":user-data",
        "user/staff": -1,
    },


    //STATUS VIEW

    {
        ":db/id": -1,
        "staff/name": "Niko Analytico",
    },
    {
        "task/id": 1,
        "task/snapshot": [{
            "snapshot/date": {"date/timestamp": moment("2017-07-31").format("x")},
            "snapshot/title": "Sales-HR-Analyse",
            "snapshot/start": {"date/timestamp": moment("2017-07-01").format("x")},
            "snapshot/end": {"date/timestamp": moment("2017-08-01").format("x")},
            "snapshot/staff": -1,
            "snapshot/completeness": Completeness.WIP,
        }],
    },
    {
        "task/id": 2,
        "task/snapshot": [{
            "snapshot/date": {"date/timestamp": moment("2017-07-31").format("x")},
            "snapshot/title": "Stakeholder-Analyse",
            "snapshot/start": {"date/timestamp": moment("2017-07-15").format("x")},
            "snapshot/end": {"date/timestamp": moment("2017-08-10").format("x")},
            "snapshot/staff": -1,
            "snapshot/completeness": Completeness.WIP,
        }],
    },
    {
        "task/id": 3,
        "task/snapshot": [{
            "snapshot/date": {"date/timestamp": moment("2017-07-31").format("x")},
            "snapshot/title": "Kreditprozess-Analyse",
            "snapshot/start": {"date/timestamp": moment("2017-06-05").format("x")},
            "snapshot/end": {"date/timestamp": moment("2017-11-27").format("x")},
            "snapshot/staff": -1,
            "snapshot/completeness": Completeness.WIP,
        }],
    },


    //REPORT VIEW

    {
        ":db/id": -2,
        "staff/name": "Malte Managerio",
    },
    {
        "task/id": 10,
        "task/children": [-10, -11, -12],
        "task/snapshot": [{
            "snapshot/date": {"date/timestamp": moment("2017-07-31").format("x")},
            "snapshot/title": "Workstream I",
            "snapshot/start": {"date/timestamp": moment("2017-05-01").format("x")},
            "snapshot/end": {"date/timestamp": moment("2017-12-12").format("x")},
            "snapshot/staff": -2,
            "snapshot/completeness": Completeness.WIP,
            //These have been reported form lower levels->generelles!
            "snapshot/risk": [{"risk/title": "3 MA gehen in den Urlaub", "risk/reporter": -1}],
            "snapshot/achievement": [{"achievement/title": "Sales-Analysten wurden ausgebildet", "achievement/reporter": -1},
                                     {"achievement/title": "Wichtige Sicherheitslücken geschlossen", "achievement/reporter": -1}],
        }],
    },
    {
        ":db/id": -10,
        "task/snapshot": [{
            "snapshot/date": {"date/timestamp": moment("2017-07-31").format("x")},
            "snapshot/achievement": [{"achievement/title": "Sales-HR-Analyse abgeschlossen", "achievement/reporter": -1}],
        }],
    },
    {
        ":db/id": -11,
        "task/snapshot": [{
            "snapshot/date": {"date/timestamp": moment("2017-07-31").format("x")},
            "snapshot/risk": [{"risk/title": "SAP-Vertragslage schwierig", "risk/reporter": -1}],
            "snapshot/issue":[{"issue/title": "Terminfindungsschwierigkeiten", "issue/reporter": -1}],
        }],
    },
    {
        ":db/id": -12,
        "task/snapshot": [{
            "snapshot/date": {"date/timestamp": moment("2017-07-31").format("x")},
            "snapshot/risk": [{ "risk/title": "Stakeholder alle krank", "risk/reporter": -1},
                              { "risk/title": "CEO von Lobby beeinflusst", "risk/reporter": -1}],
            "snapshot/issue":[{"issue/title": "CFO verweigert Kooperation", "issue/reporter": -1}],
        }],
    },
]

/*
export const dummyData2 = [
    {
        "db/ident": ":user-data",
        "user/staff": -2,

    },
    {
        ":db/id": -1,
        "staff/name": "Niko Göbel",
    },
    {
        ":db/id": -2,
        "staff/name": "Malte Sandstede",
    },
    {
        ":db/id": -3,
        "staff/name": "Christian",
    },
    {
        ":db/id": -11,
        "task/id": 1,
        "task/snapshot": [{
            "snapshot/date": {"date/timestamp": moment("2017-07-10").format("x")},
            "snapshot/title": "Sales-Analyse",
            "snapshot/start": {"date/timestamp": moment("2017-08-11").format("x")},
            "snapshot/end": {"date/timestamp": moment("2017-08-20").format("x")},
            "snapshot/staff": -1,
            "snapshot/completeness": Completeness.DONE,
            "snapshot/achievement": [{"achievement/title": "Sales-Analyse abgeschlossen.", "achievement/reporter": -1}],
            "snapshot/rag": RAGs.GREEN,
        }],
    },
    {
        ":db/id": -5,
        "task/id": 2,
        "task/snapshot": [
            {
                "snapshot/date": {"date/timestamp": moment("2017-07-10").format("x")},
                "snapshot/title": "Nikos Sales-Pitch",
                "snapshot/start": {"date/timestamp": moment("2017-08-11").format("x")},
                "snapshot/end": {"date/timestamp": moment("2017-08-30").format("x")},
                "snapshot/staff": -1,
                "snapshot/completeness": Completeness.WIP,
            },
            {
                "snapshot/date": {"date/timestamp": moment("2017-07-11").format("x")},
                "snapshot/title": "Jetzt-Maltes Sales-Pitch",
                "snapshot/start": {"date/timestamp": moment("2017-08-11").format("x")},
                "snapshot/end": {"date/timestamp": moment("2017-09-05").format("x")},
                "snapshot/staff": -2,
                "snapshot/achievement": [{"achievement/title": "Jetzt-Maltes Sales-Pitch abgeschlossen.", "achievement/reporter": -2},
                                         {"achievement/title": "Text", "achievement/reporter": -2}],
                "snapshot/completeness": Completeness.DONE,
            }]
    },
    {
        ":db/id": -13,
        "task/id": 3,
        "task/snapshot": [{
            "snapshot/date": {"date/timestamp": moment("2017-07-12").format("x")},
            "snapshot/title": "Sales-Umbau",
            "snapshot/start": {"date/timestamp": moment("2017-06-25").format("x")},
            "snapshot/end": {"date/timestamp": moment("2017-10-01").format("x")},
            "snapshot/staff": -2,
            "snapshot/completeness": Completeness.WIP,
            "snapshot/rag": RAGs.GREEN,
            "snapshot/risk": [{"risk/title": "SAP-Vertragslage schwierig", "risk/reporter": -2}],
            "snapshot/issue":[{"issue/title": "Terminfindungsschwierigkeiten", "issue/reporter": -2}],
        }],
    },
    {
        ":db/id": -14,
        "task/id": 4,
        "task/snapshot": [{
            "snapshot/date": {"date/timestamp": moment("2017-07-13").format("x")},
            "snapshot/title": "Stakeholder-Analyse",
            "snapshot/start": {"date/timestamp": moment("2017-07-01").format("x")},
            "snapshot/end": {"date/timestamp": moment("2017-08-01").format("x")},
            "snapshot/staff": -2,
            "snapshot/completeness": Completeness.WIP,
            "snapshot/rag": RAGs.AMBER,
            "snapshot/risk": [{ "risk/title": "Stakeholder alle krank", "risk/reporter": -2},
                              { "risk/title": "CEO von Lobby beeinflusst", "risk/reporter": -2}],
            "snapshot/issue":[{"issue/title": "CFO verweigert Kooperation", "issue/reporter": -2}],
        }],
    },
    {
        "task/id": 5,
        "task/children": [-11, -5, -13, -14],
        "task/snapshot": [{
            "snapshot/date": {"date/timestamp": moment("2017-07-10").format("x")},
            "snapshot/title": "Workstream I",
            "snapshot/start": {"date/timestamp": moment("2017-06-01").format("x")},
            "snapshot/end": {"date/timestamp": moment("2017-11-01").format("x")},
            "snapshot/staff": -3,
            "snapshot/completeness": Completeness.WIP,
            //These have been reported form lower levels->generelles!
            "snapshot/risk": [{"risk/title": "3 MA gehen in den Urlaub", "risk/reporter": -2}],
            "snapshot/achievement": [{"achievement/title": "Internes Sales-Team wird erfolgreich mit ausgebildet", "achievement/reporter": -1},
                                     {"achievement/title": "Wichtige Sicherheitslücke geschlossen", "achievement/reporter": -1}],
        }],
    },
    // {
    //         "task/_snapshot": -5,
    //         "snapshot/date":  {"date/timestamp": moment("2017-09-10").format("x")},
    //         "snapshot/title": "Jetzt erst recht",
    //         "snapshot/start": {"date/timestamp": moment("2017-07-01").format("x")},
    //         "snapshot/end":   {"date/timestamp": moment("2017-08-01").format("x")},
    //         "snapshot/staff": d.hashMap(d.DB_ID, -2),
    //         "snapshot/completeness": Completeness.WIP,
    // },
];
*/

export default dummyData
