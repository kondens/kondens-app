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
         UIManager,
         Alert }   from "react-native";

import { UI }           from "../UI.react";
import { Mutations,
         Completeness,
         Colors,
         Fonts,
         RAGs }        from "../constants";

import Moment           from "moment";

import { FontAwesome }  from '@expo/vector-icons';

import Swipeout         from "react-native-swipeout";

import Ripple           from "../components/Ripple";
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
    submitButton: {
        // backgroundColor: Colors.accentNeutral,
        // margin: 12,
        // borderRadius: 100,
        // paddingVertical: 6,
        // paddingHorizontal: 12,
        // width: 80,
        // height: 36,
        // alignItems: "center",
        // justifyContent: "center",
    },
    submitText: {
        color: Colors.accent,
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
        borderRadius: 50,
    },
    bar: {
        flexDirection: "row",
        justifyContent: "space-between",
        minHeight: 22,
        paddingHorizontal: 14,
        borderRadius: 50,
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
        borderRadius: 50,
        paddingVertical: 6,
        paddingHorizontal: 12,
        width: 80,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonLabel: {
        color: "#FFF",
        fontSize: Fonts.bodySize,
    },
    invertedButton: {
        borderWidth: 1,
        backgroundColor: "transparent",
        borderColor: "#FFF",
    }
})

export class Submit extends UI {
    static query () {
        return d.vector(
            d.hashMap(
                d.vector("db/ident", ":user-data"), `[ (read "user/isStatusComplete") ]`
            ))
    }

    constructor (props) {
        super(props)
    }

    render () {
        const { value, params } = this.props;
        const uiIndent = d.vector("db/ident", ":user-data");
        const isEnabled = d.getIn(value, [uiIndent, "user/isStatusComplete"], false);

        return (
            <TouchableOpacity disabled = { !isEnabled }
                              style    = { isEnabled && styles.submitButton }
                              onPress  = { e => { Alert.alert("Demo-Ende", "Hier gehts bald weiter!",
                                                              [{text: "Cool!", onPress: () => {}}]) } }>
                <Text style = { [styles.submitText, !isEnabled && {color: Colors.disabled}] }>Fertig</Text>
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
    <ActionButton buttonColor={Colors.accent} title="Weitere Achievements" bgColor="rgba(0,0,0,0.3)" degrees={135}>
        <ActionButton.Item textStyle = { {color: Colors.body, fontSize: Fonts.bodySize} } buttonColor='#76C47D' onPress={() => console.log("notes tapped!")}>
            <FontAwesome color = "#FFF" name = "trophy" size = {20} />
        </ActionButton.Item>
        <ActionButton.Item textStyle = { {color: Colors.body, fontSize: Fonts.bodySize} } buttonColor='#FF8A65' title="Weitere Risks" onPress={() => {addSnap(reconciler)}}>
            <FontAwesome color = "#FFF" name = "exclamation-circle" size = {20} />
        </ActionButton.Item>
        <ActionButton.Item textStyle = { {color: Colors.body, fontSize: Fonts.bodySize} } buttonColor='#EF5350' title="Weitere Issues" onPress={() => {reconciler.put(Mutations.CREATE_STATUS)}}>
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
                                    isLight ? { backgroundColor: "transparent" } : { backgroundColor: "#C8E6C9" }, 
                                    { flex: progress } ] } />
                    { (at < end) && <View style={ [progressBarStyles.bar, {flex: 1-progress}] } /> }
                </View>
                <View style={ progressBarStyles.labelContainer }>
                    <Text style={ [progressBarStyles.label, progressBarStyles.start, isLight && {color: "#FFF"}] }>
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
                <Text style = { [progressBarStyles.beforeBegin, isLight && {color: "#FFF"} ] }>
                    Task beginnt am { Moment(start, "x").format("DD.MM.YY") } ({ Moment(start, "x").fromNow() })
                </Text>
            </View>
        )
    }
}

const RAG = ({makeRipple, reconciler, snapId, rag}) => {
    if (!rag) {
        return (
            <View style = { ragStyles.container }>
                <TouchableOpacity style = { [ragStyles.button, {backgroundColor: "#76C47D"}] }
                                onPress = { e => { makeRipple(e, "#76C47D", RAGs.GREEN, false); } }>
                    <FontAwesome name = "thumbs-up" size = {24} color = "#FFF" />
                </TouchableOpacity>
                <TouchableOpacity style = { [ragStyles.button, {backgroundColor: "#FFC107"}] }
                                onPress = { e => { makeRipple(e, "#FFC107", RAGs.AMBER, false); } }>
                    <FontAwesome name = "bell" size = {24} color = "#FFF" />
                </TouchableOpacity>
                <TouchableOpacity style = { [ragStyles.button, {backgroundColor: "#EF5350"}] }
                                onPress = { e => { makeRipple(e, "#EF5350", RAGs.RED, false); } }>
                    <FontAwesome name = "exclamation-triangle" size = {24} color = "#FFF" />
                </TouchableOpacity>
            </View>
        )
    } else {
        let ragSymbol = {
            [RAGs.GREEN]: "thumbs-up",
            [RAGs.AMBER]: "bell",
            [RAGs.RED]: "exclamation-triangle",   
        }

        let ragColor = {
            [RAGs.GREEN]: "#76C47D",
            [RAGs.AMBER]: "#FFC107",
            [RAGs.RED]: "#EF5350",
        }

        return (
            <View style = { ragStyles.container }>
                <TouchableOpacity style = { [ragStyles.button, ragStyles.invertedButton ] }>
                    <Text style = { ragStyles.buttonLabel }>Risk?</Text>
                </TouchableOpacity>
                <TouchableOpacity style = { [ragStyles.button, ragStyles.invertedButton, {width: 50} ] }
                                onPress = { e => { makeRipple(e, "#FFF", rag, true)} }>
                    <FontAwesome name = { ragSymbol[rag] } size = {24} color = "#FFF" />
                </TouchableOpacity> 
                <TouchableOpacity style = { [ragStyles.button, ragStyles.invertedButton ] }>
                    <Text style = { ragStyles.buttonLabel }>Issue?</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

class Task extends UI {
    constructor (props) {
        super(props);
        this.rippleTarget = undefined;
    }

    render () {
        const { title, start, end, reconciler, snapId, rag } = this.props

        let ragColor = {
            [RAGs.GREEN]: "#76C47D",
            [RAGs.AMBER]: "#FFC107",
            [RAGs.RED]: "#EF5350",
        }

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

        //@TODO: swipe/scroll etc. https://github.com/dancormier/react-native-swipeout/wiki
        return (
            <Ripple style = { taskStyles.shadowContainer }
                    rippleOpacity = { 1.0 }
                    rippleDuration = { 300 }
                    ref = { ref => { this.rippleTarget = ref } }
                    onEnd = { rag => {  rag ? reconciler.put(Mutations.UPDATE_STATUS, snapId, ["snapshot/rag", rag]) :
                                              reconciler.put(Mutations.RESET_STATUS, snapId, "snapshot/rag") } }>
                <Swipeout autoClose = { true }
                          right     = { swipeRight }
                          left      = { swipeLeft }>
                    <View style = { [taskStyles.container, rag && {backgroundColor: ragColor[rag]}] }>
                            <Text style = { [taskStyles.title, rag && {color: "#FFF"}] }>{ title.toUpperCase() }</Text>
                            {/*<Text style = { taskStyles.status }>Von { Moment(start, "x").format("DD.MM.YY") } bis { Moment(end, "x").format("DD.MM.YY") } ({ Moment(end, "x").fromNow() })</Text>*/}
                            <ProgressBar start = { start } end = { end } at = { Moment().format("x") } isLight = { rag } />
                            <RAG reconciler = { reconciler }
                                 snapId     = { snapId }
                                 rag        = { rag }
                                 makeRipple = { (e, color, rag, inverse) => { e.persist()
                                                                              UIManager.measure(findNodeHandle(this.rippleTarget), 
                                                                                                (x, y, width, height, px, py) => 
                                                                                                { this.rippleTarget.startRipple(e, color, px, py, width, height, rag, inverse) }) }}/>
                    </View>
                </Swipeout>
            </Ripple>
        )
    }
}

export class Status extends UI {
    static query () {
        return d.vector(
            d.hashMap(
                d.vector("db/ident", ":user-data"), `[ {"user/staff" [ "staff/name" :db/id ]}
                                                       {(read "user/currentSnaps") [ { "snapshot/date" [ * ] }
                                                                                     { "snapshot/start" [ * ] }
                                                                                     { "snapshot/end" [ * ] }
                                                                                     * ] } ]` ))}

    constructor (props) {
        super(props);
    }

    render () {
        const { value, params } = this.props;

        const userIdent = d.vector("db/ident", ":user-data")
        const name = d.getIn(value, [userIdent, "user/staff", "staff/name"]);
        const staffId = d.getIn(value, [userIdent, "user/staff", d.DB_ID]);

        const snaps = d.getIn(value, [userIdent, "user/currentSnaps"]);
        const wipSnaps = d.filter((task) => (d.get(task, "snapshot/completeness") == Completeness.WIP), snaps);
        // const doneSnaps = d.filter((task) => (d.get(task, "snapshot/completeness") == Completeness.DONE), snaps);
        // const cancelledSnaps = d.filter((task) => (d.get(task, "snapshot/completeness") == Completeness.CANCELLED), snaps);

        const text = d.q(`[:find ?text . :where [42 ":text" ?text]]`, this.db)
        return (
            <View style = { styles.container }>
                <ScrollView style = { styles.scrollContainer}>
                    <View style = { styles.header }>
                        <Text style = { styles.name }>{name}</Text>
                        <Text style = { styles.date }>{ Moment().format("DD.MM.YY") }</Text>
                    </View>
                    <View style = { styles.body }>
                        { d.intoArray(d.map((snap) => (
                                <Task key   = { d.get(snap, d.DB_ID) }
                                      rag   = { d.get(snap, "snapshot/rag", false) }
                                      snapId= { d.get(snap, d.DB_ID) }
                                      title = { d.get(snap, "snapshot/title") }
                                      start = { d.getIn(snap, ["snapshot/start", "date/timestamp"]) }
                                      end   = { d.getIn(snap, ["snapshot/end", "date/timestamp"]) }
                                      reconciler = { this.getReconciler() } />
                        ), wipSnaps)) }
                    </View>
                </ScrollView>
                <ActionBtn reconciler = { this.getReconciler() } />
            </View>
        )
    }
}

/*
<Text>{ text }</Text>
<TouchableOpacity>
    <Text>KLICKMICH</Text>
</TouchableOpacity>*/

export default Status;
