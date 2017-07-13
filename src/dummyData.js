"use strict";

import d                from "@clockworks/datascript";

import moment       from "moment";

export const dummyData = [
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
        "task/id": 1,
        "task/snapshot": [{
            "snapshot/date": {"date/timestamp": time("2017-08-10")},
            "snapshot/title": "Nikos Architektur-Analyse",
            "snapshot/start": {"date/timestamp": time("2017-08-11")},
            "snapshot/end": {"date/timestamp": time("2017-08-20")},
            "snapshot/staff": -1
        }],
    },
    {
        "task/id": 2,
        "task/snapshot": [
            {
                "snapshot/date": {"date/timestamp": time("2017-08-10")},
                "snapshot/title": "Nikos Sales-Pitch",
                "snapshot/start": {"date/timestamp": time("2017-08-11")},
                "snapshot/end": {"date/timestamp": time("2017-08-30")},
                "snapshot/staff": -1,
            },
            {
                "snapshot/date": {"date/timestamp": time("2017-08-22")},
                "snapshot/title": "Jetzt-Maltes Sales-Pitch",
                "snapshot/start": {"date/timestamp": time("2017-08-11")},
                "snapshot/end": {"date/timestamp": time("2017-09-05")},
                "snapshot/staff": -2,
            }]
    },
];

export default dummyData
