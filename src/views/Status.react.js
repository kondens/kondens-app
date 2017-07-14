"use strict";

import d                from "@clockworks/datascript";
import React            from "react";
import { View,
         TouchableOpacity,
         Text,
         StyleSheet,
         Platform,
         ScrollView }   from "react-native";

import { UI }           from "../UI.react";
import { Mutations,
         Completeness,
         Colors,
         Fonts }        from "../constants";

import Moment           from "moment";

import { FontAwesome }  from '@expo/vector-icons';

import Swipeout         from "react-native-swipeout";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: Colors.background,
        padding: 6
    },
    scrollContainer: {

    },
    header: {
    },
    body: {
        flex: 1,
    },
    name: {
        fontSize: Fonts.h3Size,
        color: Colors.body,
    },
    date: {
        fontSize: Fonts.h1Size,
        fontWeight: Fonts.h1Weight,
        color: Colors.accent,
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
        fontSize: Fonts.bodySize,
        margin: 12,
    },
    disabled: {
        color: Colors.disabled,
        fontSize: Fonts.bodySize,
        margin: 12,
    },
})

const taskStyles = StyleSheet.create({
    shadowContainer: {
        marginVertical: 9,
        marginHorizontal: 6,
        shadowOpacity: (Platform.OS == "ios") ? 0.18 : 0,
        shadowRadius: 3,
        shadowOffset: {
            height: 2,
            width: 3,
        },
    },
    container: {
        flexDirection: "column",
        backgroundColor: "#FFF",
        padding: 6,
    },
    title: {
        fontSize: Fonts.bodySize,
        fontWeight: Fonts.h2Weight,
        color: Colors.body,
        marginBottom: 6,
    },
})

const progressBarStyles = StyleSheet.create({
    container: {
        marginBottom: 12,
    },
    barContainer: {
        flex: 1,
        flexDirection: "row",
        borderRadius: 100,
    },
    bar: {
        flexDirection: "row",
        justifyContent: "space-between",
        minHeight: 22,
        paddingHorizontal: 14,
        borderRadius: 100,
        overflow: "hidden",
    },
    labelContainer: {
        position: "absolute",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "transparent",
        marginHorizontal: 6,
    },
    beforeBegin: {
       color: Colors.body,
       fontSize: Fonts.bodySize, 
    },
    label: {
        flex: 1,
        color: Colors.body,
        fontSize: Fonts.bodySize,
    },
    start: {
        textAlign: "left",
    },
    end: {
        textAlign: "right",
    },
    remaining: {
        textAlign: "center",
    },
})

const ragStyles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginHorizontal: 30,
    },
    button: {
        borderRadius: 100,
        paddingVertical: 6,
        paddingHorizontal: 12,
        width: 80,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonLabel: {
        color: "#FFF",
        fontSize: Fonts.bodySize,
    },
})

export class Submit extends UI {
    static query () {
        return d.vector(
            d.hashMap(
                d.vector("db/ident", ":ui"), `[ "ui/isStatusSubmitEnabled" ]`
            ))
    }

    constructor (props) {
        super(props)
    }

    render () {
        const { value, params } = this.props;
        const uiIndent = d.vector("db/ident", ":ui");
        const isEnabled = d.getIn(value, [uiIndent, "ui/isStatusSubmitEnabled"], false);

        return (
            <TouchableOpacity disabled = { !isEnabled }
                              onPress = { e => this.getReconciler().put(Mutations.SUBMIT_STATUS, "nice, nichma namespaced") }>
                <Text style = { isEnabled ? styles.submit : styles.disabled }>Fertig</Text>
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
