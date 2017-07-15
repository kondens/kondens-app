// @flow 
"use strict";

import d from "@clockworks/datascript"

import { Navigator } from "./route"
import { Routes }    from "./constants"


export const schema = {
    // We need indents to specify named entities
    "db/ident":                   {":db/unique": ":db.unique/identity"},

    "ui/navigationState":         {":db/cardinality": ":db.cardinality/one"},

    "user/staff":                 {
        ":db/cardinality": ":db.cardinality/one",
        ":db/valueType": ":db.type/ref",
        ":db/unique": ":db.unique/identity",
    },
    "user/currentSnaps":          {":db/valueType": ":db.type/derived"},
    "user/isStatusComplete":      {":db/valueType": ":db.type/derived"},

    "date/timestamp":             {":db/unique": ":db.unique/identity"},

    //"staff/id":                 {":db/unique": ":db.unique/identity"},
    "staff/name":                 {":db/cardinality": ":db.cardinality/one"},

    "task/id":                    {":db/unique": ":db.unique/identity"},
    "task/snapshot":              {
        ":db/cardinality": ":db.cardinality/many",
        ":db/valueType": ":db.type/ref"
    },

    "snapshot/date":              {
        ":db/cardinality": ":db.cardinality/one",
        ":db/valueType": ":db.type/ref",
    },
    "snapshot/start":             {
        ":db/cardinality": ":db.cardinality/one",
        ":db/valueType": ":db.type/ref",
    },
    "snapshot/end":               {
        ":db/cardinality": ":db.cardinality/one",
        ":db/valueType": ":db.type/ref",
    },
    "snapshot/staff":             {
        ":db/cardinality": ":db.cardinality/one",
        ":db/valueType": ":db.type/ref",
    },
    "snapshot/isInCreation":        {":db/cardinality": ":db.cardinality/one"},
    "snapshot/title":             {":db/cardinality": ":db.cardinality/one"},
    "snapshot/type":              {":db/cardinality": ":db.cardinality/one"},
    "snapshot/completeness":      {":db/cardinality": ":db.cardinality/one"}, //Completeness.x
    "snapshot/rag":               {":db/cardinality": ":db.cardinality/one"}, //:red :amber :green
    "snapshot/summary":           {":db/cardinality": ":db.cardinality/many"},
    "snapshot/next":              {":db/cardinality": ":db.cardinality/many"},
    "snapshot/risks":             {":db/cardinality": ":db.cardinality/many"},
    "snapshot/issues":            {":db/cardinality": ":db.cardinality/many"},
    "snapshot/decisions":         {":db/cardinality": ":db.cardinality/many"},

}

export const initialState = () => d.db_with(d.empty_db(schema), [
    { "db/ident": ":user-data" },
    { 
        "db/ident": ":ui",
        "ui/navigationState": Navigator.router.getStateForAction(Navigator.router.getActionForPathAndParams(Routes.STATUS))
    }
])
