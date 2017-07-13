"use strict";

import d                from "@clockworks/datascript";
import React            from "react";
import { View,
         TouchableOpacity,
         Text }         from "react-native";

import { UI }           from "../UI.react";
import { Mutations }    from "../constants";

import Moment           from "moment";

const Task = ({title, start, end}) => {

    return (
        <View>
            <Text>{ title }</Text>
            <Text>Start: { Moment(start, "x").format("DD. MMMM YYYY") } ({ Moment(start, "x").fromNow() })</Text>
            <Text>Ende: { Moment(end, "x").format("DD. MMMM YYYY") } ({ Moment(end, "x").fromNow() })</Text>
        </View>
    )
}

class Status extends UI {
    static query () {
        return d.vector(
            d.hashMap(
                d.vector("db/ident", ":user-data"), `[ {"user/staff" [ "staff/name" ] } ]`,
            ),
            d.hashMap("user/tasks", d.vector("db/ident", ":user-data")))
    }

    render () {
        const { value, params } = this.props;
        const name = d.getIn(value, [d.vector("db/ident", ":user-data"), "user/staff", "staff/name"]);
        const tasks = d.get(value, "user/tasks", d.vector())

        const text = d.q(`[:find ?text . :where [42 ":text" ?text]]`, this.db)
        return (
            <View>
                <Text>{name}</Text>
                <Text>{ text }</Text>
                <TouchableOpacity onPress = { e => this.getReconciler().put(Mutations.SUBMIT_STATUS, "nice, nichma namespaced") }>
                    <Text>KLICKMICH</Text>
                </TouchableOpacity>
                <View>
                    { d.intoArray(d.map((task) => (
                        <Task key   = { d.get(task, ":db/id") }
                              title = { d.get(task, "snapshot/title") }
                              start = { d.getIn(task, ["snapshot/start", "date/timestamp"]) }
                              end   = { d.getIn(task, ["snapshot/end", "date/timestamp"]) } />
                    ), tasks)) }
                </View>
            </View>
        )
    }
}

export default Status;
