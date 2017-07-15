"use strict";

import d                from "@clockworks/datascript";
import React            from "react";
import { View,
         TouchableOpacity,
         Text,
         StyleSheet,
         Platform,
         ScrollView,
         findNodeHandle,
         UIManager }   from "react-native";

import { UI }           from "../UI.react";
import { Mutations,
         Completeness,
         Colors,
         Fonts,
         RAGs }        from "../constants";

import Moment           from "moment";

import { FontAwesome }  from '@expo/vector-icons';

import Swipeout         from "react-native-swipeout";

import Ripple           from "react-native-material-ripple";
import ActionButton     from "react-native-action-button";


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
                              onPress = { e => this.getReconciler().put(Mutations.SUBMIT_RAG, "nice, nichma namespaced") }>
                <Text style = { isEnabled ? styles.submit : styles.disabled }>Fertig</Text>
            </TouchableOpacity>
        )
    }
}


const addSnap = (reconciler) => {
    const snap = { date: Moment("2017-08-11").format("x"),
                   start: Moment("2017-07-21").format("x"),
                   end: Moment("2017-07-30").format("x"),
                   wip: true,
                   title: "Creational Snap",
                   completeness: Completeness.WIP,
                   rag: RAGs.GREEN,
                  //@TODO: further attributes
                  };

    reconciler.put(Mutations.ADD_SNAP, 1, 3, snap);
}

const ActionBtn = ({reconciler}) => (
    <ActionButton buttonColor={Colors.accent} title="Achievements" bgColor="rgba(0,0,0,0.3)" degrees={135}>
        <ActionButton.Item buttonColor='#76C47D' onPress={() => console.log("notes tapped!")}>
            <FontAwesome color = "#FFF" name = "trophy" size = {20} />
        </ActionButton.Item>
        <ActionButton.Item buttonColor='#FF8A65' title="Risks" onPress={() => {addSnap(reconciler)}}>
            <FontAwesome color = "#FFF" name = "exclamation-circle" size = {20} />
        </ActionButton.Item>
        <ActionButton.Item buttonColor='#EF5350' title="Issues" onPress={() => {reconciler.put(Mutations.CREATE_STATUS)}}>
            <FontAwesome color = "#FFF" name = "exclamation-triangle" size = {20} />
        </ActionButton.Item>
    </ActionButton>
);

const ProgressBar = ({start, end, at, isLight}) => {
    let progress = 0;
    if (at > start) {
        progress = (at-start) / (end-start);
    }

    if (progress > 0) {
        return (
            <View style={ progressBarStyles.container }>
                <View style={ progressBarStyles.barContainer }>
                    <View style={ [ progressBarStyles.bar, 
                                    { backgroundColor: "#C8E6C9" }, 
                                    { flex: progress } ] } />
                    { (at < end) && <View style={ [progressBarStyles.bar, {flex: 1-progress}] } /> }
                </View>
                <View style={ progressBarStyles.labelContainer }>
                    <Text style={ [progressBarStyles.label, progressBarStyles.start] }>
                        { Moment(start, "x").format("DD.MM.YY") } bis { Moment(end, "x").format("DD.MM.YY") } (endet { Moment(end, "x").fromNow() })
                    </Text>
                {/*
                    <Text style={ [progressBarStyles.label, progressBarStyles.start] }>
                        { Moment(start, "x").format("DD.MM.YY") } 
                    </Text>
                    <Text style={ [progressBarStyles.label, progressBarStyles.remaining] }>
                        ({ Moment(end, "x").fromNow() })
                    </Text>
                    <Text style={ [progressBarStyles.label, progressBarStyles.end] }>
                        { Moment(end, "x").format("DD.MM.YY") }
                    </Text>*/}
                </View>
            </View>
        )
    } else {
        return (
            <View style={ progressBarStyles.container }>
                <Text style = { progressBarStyles.beforeBegin }>
                    Task beginnt am { Moment(start, "x").format("DD.MM.YY") } ({ Moment(start, "x").fromNow() })
                </Text>
            </View>
        )
    }
}

const RAG = () => (
    <View style = { ragStyles.container }>
        <TouchableOpacity style = { [ragStyles.button, {backgroundColor: "#76C47D"}] }>
            <FontAwesome name = "thumbs-up" size = {24} color = "#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style = { [ragStyles.button, {backgroundColor: "#FFC107"}] }>
            <FontAwesome name = "bell" size = {24} color = "#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style = { [ragStyles.button, {backgroundColor: "#EF5350"}] }>
            <FontAwesome name = "exclamation-triangle" size = {24} color = "#FFF" />
        </TouchableOpacity>
    </View>
)

const Task = ({title, start, end}) => {
    const swipeRight = [
        {
            backgroundColor: "#FF8A65",
            component:  <View style = {{flex: 1, alignItems: "center", justifyContent: "center"}}>
                            <FontAwesome name = "trash-o" size = {38} color = "#FFF" />
                        </View>
        }
    ]

    const swipeLeft = [
        {
            backgroundColor: "#76C47D",
            component:  <View style = {{flex: 1, alignItems: "center", justifyContent: "center"}}>
                            <FontAwesome name = "check" size = {38} color = "#FFF" />
                        </View>
        }
    ]

    return (
        <View style = { taskStyles.shadowContainer }>
            <Swipeout autoClose = { true }
                      right     = { swipeRight }
                      left      = { swipeLeft }>
                <View style = { taskStyles.container }>
                        <Text style = { taskStyles.title }>{ title.toUpperCase() }</Text>
                        {/*<Text style = { taskStyles.status }>Von { Moment(start, "x").format("DD.MM.YY") } bis { Moment(end, "x").format("DD.MM.YY") } ({ Moment(end, "x").fromNow() })</Text>*/}
                        <ProgressBar start = { start } end = { end } at = { Moment().format("x") } />
                        <RAG />
                </View>
            </Swipeout>
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
            <View style = { styles.container }>
                <ScrollView style = { styles.scrollContainer}>
                    <View style = { styles.header }>
                        <Text style = { styles.name }>{name}</Text>
                        <Text style = { styles.date }>{ Moment().format("DD.MM.YY") }</Text>
                    </View>
                    <View style = { styles.body }>
                        { d.intoArray(d.map((task) => (
                                <Task key   = { d.get(task, ":db/id") }
                                      title = { d.get(task, "snapshot/title") }
                                      start = { d.getIn(task, ["snapshot/start", "date/timestamp"]) }
                                      end   = { d.getIn(task, ["snapshot/end", "date/timestamp"]) } />
                        ), wipTasks)) }
                    </View>
                </ScrollView>
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
