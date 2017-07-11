// @flow 
"use strict";

import d from "@clockworks/datascript"

import { Navigator } from "./route"
import { Routes }    from "./constants"


export const schema = {
    // We need indents to specify named entities
    "db/ident":                 {":db/unique": ":db.unique/identity"},
}

export const initialState = () => d.db_with(d.empty_db(schema), [
    { 
        "db/ident": ":ui",
        "ui/navigationState": Navigator.router.getStateForAction(Navigator.router.getActionForPathAndParams(Routes.STATUS))
    }
])