"use strict";

import d                from "@clockworks/datascript";
import React            from "react";
import { View,
         TouchableOpacity,
         Text,
         StyleSheet }         from "react-native";

import { UI }           from "../UI.react";
import { Mutations,
         Completeness,
         Colors,
         Font }    from "../constants";

import Moment           from "moment";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: Colors.background
    },

    header: {

    },

    body: {
        flex: 1,
    },

    footer: {
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        // borderTopWidth: 1,
        // borderTopColor: Colors.accent,
    },
    submit: {
        color: Colors.accentNeutral,
        fontSize: Font.bodySize,
        margin: 12,
    }
})

export class Submit extends UI {
    static query () {
        return d.vector(
            d.hashMap(
                d.vector("db/ident", ":user-data"), `[ {"user/staff" [ "staff/name" ]} ]`
                ))
    }

    constructor (props) {
        super(props)
    }

    componentWillMount() {
    }

    render () {
        const { value, params } = this.props;

        const n = d.getIn(value, [d.vector("db/ident", ":user-data"), "user/staff", "staff/name"])

        return (
            <TouchableOpacity onPress = { e => this.getReconciler().put(Mutations.SUBMIT_STATUS, "nice, nichma namespaced") }>
                <Text style = { styles.submit }>Fertig {n}</Text>
            </TouchableOpacity>
        )
    }
}

const Task = ({title, end}) => {

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
