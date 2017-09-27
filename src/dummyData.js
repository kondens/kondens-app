"use strict";

import d                from "@clockworks/datascript";

import moment       from "moment";

import { RAGs }    from "./constants";

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
            "snapshot/title":           "Projektgovernance definieren",
            "snapshot/date":            {"date/timestamp": moment("2017-09-01").format("x")},
            "snapshot/start":           {"date/timestamp": moment("2017-09-01").format("x")},
            "snapshot/end":             {"date/timestamp": moment("2017-09-14").format("x")},
            "snapshot/staff":           -1,
        }],
    },
    {
        "task/id": 2,
        "task/snapshot": [{
            "snapshot/title":           "Structural Completeness of Tasks",
            "snapshot/date":            {"date/timestamp": moment("2017-09-01").format("x")},
            "snapshot/start":           {"date/timestamp": moment("2017-09-07").format("x")},
            "snapshot/end":             {"date/timestamp": moment("2017-09-21").format("x")},
            "snapshot/staff":           -1,
        }],
    },
    {
        "task/id": 3,
        "task/snapshot": [{
            "snapshot/title":           "Scope Agreement",
            "snapshot/date":            {"date/timestamp": moment("2017-09-01").format("x")},
            "snapshot/start":           {"date/timestamp": moment("2017-09-21").format("x")},
            "snapshot/end":             {"date/timestamp": moment("2017-09-30").format("x")},
            "snapshot/staff":           -1,
        }],
    },
    {
        "task/id": 4,
        "task/snapshot": [{
            "snapshot/title":           "Planung",
            "snapshot/date":            {"date/timestamp": moment("2017-09-01").format("x")},
            "snapshot/start":           {"date/timestamp": moment("2017-10-01").format("x")},
            "snapshot/end":             {"date/timestamp": moment("2017-10-24").format("x")},
            "snapshot/staff":           -1,
        }],
    },
    {
        "task/id": 5,
        "task/snapshot": [{
            "snapshot/title":           "Specification",
            "snapshot/date":            {"date/timestamp": moment("2017-09-01").format("x")},
            "snapshot/start":           {"date/timestamp": moment("2017-11-01").format("x")},
            "snapshot/end":             {"date/timestamp": moment("2017-11-15").format("x")},
            "snapshot/staff":           -1,
        }],
    },
    {
        "task/id": 6,
        "task/snapshot": [{
            "snapshot/title":           "Development",
            "snapshot/date":            {"date/timestamp": moment("2017-09-01").format("x")},
            "snapshot/start":           {"date/timestamp": moment("2017-11-16").format("x")},
            "snapshot/end":             {"date/timestamp": moment("2018-01-04").format("x")},
            "snapshot/staff":           -1,
        }],
    },
    {
        "task/id": 7,
        "task/snapshot": [{
            "snapshot/title":           "Testing",
            "snapshot/date":            {"date/timestamp": moment("2017-09-01").format("x")},
            "snapshot/start":           {"date/timestamp": moment("2017-12-25").format("x")},
            "snapshot/end":             {"date/timestamp": moment("2018-01-18").format("x")},
            "snapshot/staff":           -1,
        }],
    },
    {
        "task/id": 8,
        "task/snapshot": [{
            "snapshot/title":           "Golive",
            "snapshot/date":            {"date/timestamp": moment("2017-09-01").format("x")},
            "snapshot/start":           {"date/timestamp": moment("2018-01-18").format("x")},
            "snapshot/end":             {"date/timestamp": moment("2018-02-01").format("x")},
            "snapshot/staff":           -1,
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
            "snapshot/title":           "Testprojekt",
            "snapshot/date":            {"date/timestamp": moment("2017-09-01").format("x")},
            "snapshot/start":           {"date/timestamp": moment("2017-09-01").format("x")},
            "snapshot/end":             {"date/timestamp": moment("2018-02-01").format("x")},
            "snapshot/staff":           -2,

            //These have been reported form lower levels->generelles!
            //Still, this is also the place were reportables on a higher level (e.g. PM) are put
            "snapshot/next": [ -100 ],
            "snapshot/risk": [ -101 ],
            "snapshot/achievement": [ -102 ],
        }],
    },
    {   
        ":db/id": -100,
        "reportable/order": 0,
        "reportable/title": "Structural Completeness of Tasks", 
        "reportable/reporter": -1
    },
    {   
        ":db/id": -101,
        "reportable/order": 3,
        "reportable/title": "Drei MA gehen in den Urlaub", 
        "reportable/reporter": -1
    },
    {   
        ":db/id": -102,
        "reportable/order": 0,
        "reportable/title": "Wichtige Sicherheitslücke gefixt", 
        "reportable/reporter": -1
    },

    {
        ":db/id": -10,
        "task/snapshot": [{
            "snapshot/date": {"date/timestamp": moment("2017-07-31").format("x")},
            "snapshot/achievement": [ -103 ],
        }],
    },
    {   
        ":db/id": -103,
        "reportable/order": 1,
        "reportable/title": "Done: Projektgovernance definieren", 
        "reportable/reporter": -1
    },

    {
        ":db/id": -11,
        "task/snapshot": [{
            "snapshot/date": {"date/timestamp": moment("2017-07-31").format("x")},
            "snapshot/risk": [ -104 ],
            "snapshot/issue":[ -105 ],
        }],
    },
    {   
        ":db/id": -104,
        "reportable/order": 1,
        "reportable/title": "SAP-Vertragslage schwierig", 
        "reportable/reporter": -1
    },
    {   
        ":db/id": -105,
        "reportable/order": 0,
        "reportable/title": "Terminfindungsschwierigkeiten", 
        "reportable/reporter": -1
    },

    {
        ":db/id": -12,
        "task/snapshot": [{
            "snapshot/date": {"date/timestamp": moment("2017-07-31").format("x")},
            "snapshot/risk": [ -106, -107 ],
            "snapshot/issue": [ -108 ],
        }],
    },
    {   
        ":db/id": -106,
        "reportable/order": 0,
        "reportable/title": "Stakeholder alle krank", 
        "reportable/reporter": -1
    },
    {   
        ":db/id": -107,
        "reportable/order": 2,
        "reportable/title": "CEO von Lobby beeinflusst", 
        "reportable/reporter": -1
    },
    {   
        ":db/id": -108,
        "reportable/order": 1,
        "reportable/title": "CFO verweigert Kooperation", 
        "reportable/reporter": -1
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
            "snapshot/achievement": [{"reportable/title": "Sales-Analyse abgeschlossen.", "reportable/reporter": -1}],
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
            },
            {
                "snapshot/date": {"date/timestamp": moment("2017-07-11").format("x")},
                "snapshot/title": "Jetzt-Maltes Sales-Pitch",
                "snapshot/start": {"date/timestamp": moment("2017-08-11").format("x")},
                "snapshot/end": {"date/timestamp": moment("2017-09-05").format("x")},
                "snapshot/staff": -2,
                "snapshot/achievement": [{"reportable/title": "Jetzt-Maltes Sales-Pitch abgeschlossen.", "reportable/reporter": -2},
                                         {"reportable/title": "Text", "reportable/reporter": -2}],
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
            "snapshot/rag": RAGs.GREEN,
            "snapshot/risk": [{"reportable/title": "SAP-Vertragslage schwierig", "reportable/reporter": -2}],
            "snapshot/issue":[{"reportable/title": "Terminfindungsschwierigkeiten", "reportable/reporter": -2}],
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
            "snapshot/rag": RAGs.AMBER,
            "snapshot/risk": [{ "reportable/title": "Stakeholder alle krank", "reportable/reporter": -2},
                              { "reportable/title": "CEO von Lobby beeinflusst", "reportable/reporter": -2}],
            "snapshot/issue":[{"reportable/title": "CFO verweigert Kooperation", "reportable/reporter": -2}],
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
            //These have been reported form lower levels->generelles!
            "snapshot/risk": [{"reportable/title": "3 MA gehen in den Urlaub", "reportable/reporter": -2}],
            "snapshot/achievement": [{"reportable/title": "Internes Sales-Team wird erfolgreich mit ausgebildet", "reportable/reporter": -1},
                                     {"reportable/title": "Wichtige Sicherheitslücke geschlossen", "reportable/reporter": -1}],
        }],
    },
    // {
    //         "task/_snapshot": -5,
    //         "snapshot/date":  {"date/timestamp": moment("2017-09-10").format("x")},
    //         "snapshot/title": "Jetzt erst recht",
    //         "snapshot/start": {"date/timestamp": moment("2017-07-01").format("x")},
    //         "snapshot/end":   {"date/timestamp": moment("2017-08-01").format("x")},
    //         "snapshot/staff": d.hashMap(d.DB_ID, -2),
    // },
];
*/

export default dummyData
