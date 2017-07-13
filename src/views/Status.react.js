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
            <Text>Dieser Task endet am { Moment(end, "x").format("DD. MMMM YYYY") } ({ Moment(end, "x").fromNow() })</Text>
        </View>
    )
}

export class Status extends UI {
    static query () {
        return d.vector(
            d.hashMap(
                d.vector("db/ident", ":user-data"), `[ {"user/staff" [ "staff/name" ]}
                                                       {(read "user/currentSnaps") [ { "snapshot/date" [ * ] }
                                                                                     { "snapshot/start" [ * ] }
                                                                                     { "snapshot/end" [ * ] }
                                                                                     * ] } ]` ))}

    render () {
        const { value, params } = this.props;

        const userIdent = d.vector("db/ident", ":user-data")
        const name = d.getIn(value, [userIdent, "user/staff", "staff/name"]);

        const tasks = d.getIn(value, [userIdent, "user/currentSnaps"]);

        const wipTasks = d.filter((task) => (d.get(task, "snapshot/completeness") == Completeness.WIP), tasks);
        const doneTasks = d.filter((task) => (d.get(task, "snapshot/completeness") == Completeness.DONE), tasks);
        const cancelledTasks = d.filter((task) => (d.get(task, "snapshot/completeness") == Completeness.CANCELLED), tasks);

        const text = d.q(`[:find ?text . :where [42 ":text" ?text]]`, this.db)
        return (
            <View style = { styles.container }>
                <View style = { styles.header }>
                    <Text>Status Report von {name} am { Moment().format("DD.MM.YY") }</Text>
                    <Text>{text}</Text>
                </View>
                <View style = { styles.body }>
                    { d.intoArray(d.map((task) => (
                        <Task key   = { d.get(task, ":db/id") }
                              title = { d.get(task, "snapshot/title") }
                              start = { d.getIn(task, ["snapshot/start", "date/timestamp"]) }
                              end   = { d.getIn(task, ["snapshot/end", "date/timestamp"]) } />
                    ), wipTasks)) }
                </View>
                {/*
                <TouchableOpacity style = { styles.footer }>
                    <Text style = { styles.submit }>SUBMIT</Text>
                </TouchableOpacity>*/}
            </View>
        )
    }
}

/*
<Text>{ text }</Text>
<TouchableOpacity  }>
    <Text>KLICKMICH</Text>
</TouchableOpacity>*/

export default Status;
