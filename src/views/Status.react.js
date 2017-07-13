"use strict";

import d                from "@clockworks/datascript";
import React            from "react";
import { View,
         TouchableOpacity,
         Text }         from "react-native";

import { UI }           from "../UI.react";
import { Mutations }    from "../constants";

import Moment           from "moment";

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
