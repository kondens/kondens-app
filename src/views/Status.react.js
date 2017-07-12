"use strict";

import d                from "@clockworks/datascript";
import React            from "react";
import { View,
         TouchableOpacity,
         Text }         from "react-native";

import { UI }           from "../UI.react";
import { Mutations }    from "../constants"

const snapsForName = (db, name) => d.q(`[:find [?snap]
                                         :in $ ?name
                                         :where [?staff "staff/name" ?name]
                                                [?snap "snapshot/staff" ?staff]]`, 
                                        db, name);

const tasks = (db) => d.map((datom) => d.get(datom, "v"), d.datoms(db, ":avet", "task/id"));

const currentSnapForTask = (db, taskId) => {
    const snaps = d.q(`[:find ?time ?snap
                        :in $ ?task-id
                        :where [?task "task/id" ?task-id]
                               [?task "task/snapshot" ?snap]
                               [?snap "snapshot/date" ?date]
                               [?date "date/timestamp" ?time]]`,
                        db, taskId)
    return d.second(d.first(d.sortBy(d.first, (a, b) => (b - a), snaps)))
}

const currentSnaps = (db) => d.map((task) => currentSnapForTask(db, task), tasks(db))

const currentSnapsForName = (db, name) => d.intersection(d.set(snapsForName(db, name)), d.set(currentSnaps(db)))

class Status extends UI {
    static query () {
        return d.vector(d.hashMap(
            d.vector("db/ident", ":user-data"), `[ {"user/staff" [ "staff/name" ] } ]`,
        ))
    }

    render () {
        const { value, params } = this.props;
        const name = d.getIn(value, [d.vector("db/ident", ":user-data"), "user/staff", "staff/name"]);
        console.log(d.toJs(value));

        const text = d.q(`[:find ?text . :where [42 ":text" ?text]]`, this.db)
        return (
            <View>
                <Text>{name}</Text>
                <Text>{ text }</Text>
                <TouchableOpacity onPress = { e => this.getReconciler().put(Mutations.SUBMIT_STATUS, "nice, nichma namespaced") }>
                    <Text>KLICKMICH</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default Status;
