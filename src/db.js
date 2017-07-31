// @flow 
"use strict";

import d from "@clockworks/datascript"

import { Navigator } from "./route"
import { Routes }    from "./constants"


export const schema = {
    // We need indents to specify named entities
    "db/ident":                   {":db/unique": ":db.unique/identity"},

    "ui/navigationState":         {":db/cardinality": ":db.cardinality/one"},
    "ui/showExcludedReportables": {":db/cardinality": ":db.cardinality/one"},

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
    "task/children":              {":db/cardinality": ":db.cardinality/many",
                                   ":db/valueType": ":db.type/ref"},
    "task/newestSnapshot":        {":db/valueType": ":db.type/derived"},
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
    "snapshot/isInCreation":      {":db/cardinality": ":db.cardinality/one"},
    "snapshot/title":             {":db/cardinality": ":db.cardinality/one"},
    // "snapshot/type":              {":db/cardinality": ":db.cardinality/one"},
    "snapshot/completeness":      {":db/cardinality": ":db.cardinality/one"}, //Completeness.x
    "snapshot/rag":               {":db/cardinality": ":db.cardinality/one"}, //:red :amber :green
    "snapshot/achievement":       {":db/cardinality": ":db.cardinality/many",
                                   ":db/valueType": ":db.type/ref"},
    "snapshot/next":              {":db/cardinality": ":db.cardinality/many",
                                   ":db/valueType": ":db.type/ref"},
    "snapshot/risk":              {":db/cardinality": ":db.cardinality/many",
                                   ":db/valueType": ":db.type/ref"},
    "snapshot/issue":             {":db/cardinality": ":db.cardinality/many",
                                   ":db/valueType": ":db.type/ref"},
    "snapshot/decision":          {":db/cardinality": ":db.cardinality/many",
                                   ":db/valueType": ":db.type/ref"},

    "reportable/isExcluded":      {":db/cardinality": ":db.cardinality/one"},
    //refactor x/reporter -> reportable/reporter

    "risk/title":                 {":db/cardinality": ":db.cardinality/one"},
    "risk/reporter":              {":db/cardinality": ":db.cardinality/one",
                                   ":db/valueType": ":db.type/ref"},
    "risk/severity":              {":db/cardinality": ":db.cardinality/one"}, 
    "risk/mitigation":            {":db/cardinality": ":db.cardinality/one"}, 

    "issue/title":                {":db/cardinality": ":db.cardinality/one"},
    "issue/reporter":             {":db/cardinality": ":db.cardinality/one",
                                   ":db/valueType": ":db.type/ref"},
    "issue/severity":             {":db/cardinality": ":db.cardinality/one"}, 
    "issue/mitigation":           {":db/cardinality": ":db.cardinality/one"},

    "achievement/title":          {":db/cardinality": ":db.cardinality/one"}, 
    "achievement/reporter":       {":db/cardinality": ":db.cardinality/one",
                                   ":db/valueType": ":db.type/ref"},   

    "next/title":                 {":db/cardinality": ":db.cardinality/one"}, 
    "next/reporter":              {":db/cardinality": ":db.cardinality/one",
                                   ":db/valueType": ":db.type/ref"},  

    "decision/title":             {":db/cardinality": ":db.cardinality/one"},
    "decision/reporter":          {":db/cardinality": ":db.cardinality/one",
                                   ":db/valueType": ":db.type/ref"}, 
}

export const initialState = () => d.db_with(d.empty_db(schema), [
    { "db/ident": ":user-data" },
    { 
        "db/ident": ":ui",
        "ui/navigationState": Navigator.router.getStateForAction(Navigator.router.getActionForPathAndParams(Routes.STATUS)),
        // "ui/navigationState": Navigator.router.getStateForAction(
        //     Object.assign(Navigator.router.getActionForPathAndParams(Routes.REPORT), {
        //         params: {taskIdent: d.vector("task/id", 10)}
        //     })
        // ),
    }
])
