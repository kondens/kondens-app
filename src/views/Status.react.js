"use strict";

import d                from "@clockworks/datascript";
import React            from "react";
import { View,
         TouchableOpacity,
         Text,
         StyleSheet,
         Platform,
         ScrollView,
         Alert }   from "react-native";

import { UI }           from "../UI.react";
import { Mutations,
         Completeness,
         Colors,
         Fonts,
         RAGs,
         RagColor,
         RagSymbol,
         Routes, }        from "../constants";

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
    },
    scrollContainer: {},
    header: {
        flexDirection: "row",
        paddingTop: 18,
        paddingHorizontal: 12,
        paddingBottom: 12,
    },
    body: {
        flex: 1,
    },
    name: {
        fontSize: Fonts.h3Size,
        color: Colors.body,
    },
    date: {
        fontSize: Fonts.h3Size,
        fontWeight: "bold",
        color: Colors.accent,
        marginRight: 6,
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
        marginVertical: 6,
        marginHorizontal: 12,
        shadowOpacity: (Platform.OS == "ios") ? 0.18 : 0,
        shadowRadius: 1,
        shadowOffset: {
            height: 1,
            width: 0,
        },
    },
    container: {
        flexDirection: "column",
        padding: 12,
    },
    title: {
        fontSize: Fonts.bodySize,
        fontWeight: "500", // Fonts.h2Weight,
        color: Colors.primaryText,
        marginBottom: 6,
    },
})

const progressBarStyles = StyleSheet.create({
    container: {
        flexDirection: "column",
        marginBottom: 12,
    },
    barContainer: {
        flex: 1,
        flexDirection: "row",
        borderRadius: 50,
    },
    bar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 25,
        height: 6,
        // paddingHorizontal: 14,
        // borderRadius: 50,
        overflow: "hidden",
    },
    left: {
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderColor: Colors.accent,
    },
    progress: {
        // borderTopWidth: 2,
        flex: 1,
        height: 2,
        backgroundColor: Colors.accent,
    },
    labelContainer: {
        position: "absolute",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "transparent",
        // marginHorizontal: 6,
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
        marginTop: 6,
        flexDirection: "row",
        justifyContent: "space-between",
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
        <ActionButton.Item textStyle   = { {color: Colors.body, fontSize: Fonts.bodySize} } 
                           buttonColor = { Colors.achievement }
                           onPress     = {() => {reconciler.put(Mutations.NAVIGATION_DISPATCH, {
                                                                        routeName: Routes.REPORT,
                                                                        params: {taskIdent: d.vector("task/id", 10)} 
                                                                    })}}>
            <FontAwesome color = "#FFF" name = "trophy" size = {20} />
        </ActionButton.Item>
        <ActionButton.Item textStyle   = { {color: Colors.body, fontSize: Fonts.bodySize} } 
                           buttonColor = { Colors.risk }
                           title       = "Weitere Risks" 
                           onPress     = {() => {addSnap(reconciler)}}>
            <FontAwesome color = "#FFF" name = "exclamation-circle" size = {20} />
        </ActionButton.Item>
        <ActionButton.Item textStyle   = { {color: Colors.body, fontSize: Fonts.bodySize} } 
                           buttonColor = { Colors.issue } 
                           title       = "Weitere Issues" 
                           onPress     = {() => {reconciler.put(Mutations.CREATE_STATUS)}}>
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
                <View style={ progressBarStyles.labelContainer }>
                    <Text style={ [progressBarStyles.label, progressBarStyles.start, isLight && {color: "#FFF"}] }>
                        { Moment(start, "x").format("DD. MMMM") } bis { Moment(end, "x").format("DD. MMMM") } ({ Moment(end, "x").fromNow() })
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
                <View style={ progressBarStyles.barContainer }>
                    <View style={ [ progressBarStyles.bar,
                                    (!isLight) && progressBarStyles.left,
                                    // !isLight && [progressBarStyles.progress, {borderColor: "transparent"}],
                                    // isLight ? { backgroundColor: "transparent" } : { backgroundColor: "#C8E6C9" }, 
                                    { flex: progress } ] }>
                        { (!isLight) && <View style={ progressBarStyles.progress } /> }
                    </View>
                    { (at < end) && <View style={ [progressBarStyles.bar, {flex: 1-progress}] } /> }
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


const RAG = ({onRagSelect, onRagReset, reconciler, snapId, rag}) => {
    if (!rag) {
        return (
            <View style = { ragStyles.container }>
                <TouchableOpacity style = { [ragStyles.button, {backgroundColor: Colors.achievement}] }
                                onPress = { e => onRagSelect(RAGs.GREEN) }>
                    <FontAwesome name={ RagSymbol[RAGs.GREEN] } size={ 24 } color={ "#FFF" } />
                </TouchableOpacity>
                <TouchableOpacity style = { [ragStyles.button, {backgroundColor: "#FFC107"}] }
                                onPress = { e => onRagSelect(RAGs.AMBER) }>
                    <FontAwesome name={ RagSymbol[RAGs.AMBER] } size={ 24 } color={ "#FFF" } />
                </TouchableOpacity>
                <TouchableOpacity style = { [ragStyles.button, {backgroundColor: Colors.issue}] }
                                onPress = { e => onRagSelect(RAGs.RED) }>
                    <FontAwesome name={ RagSymbol[RAGs.RED] } size={ 24 } color={ "#FFF" } />
                </TouchableOpacity>
            </View>
        )
    } else {
        return (
            <View style = { ragStyles.container }>
                <TouchableOpacity style = { [ragStyles.button, ragStyles.invertedButton ] }>
                    <Text style={ ragStyles.buttonLabel }>Risk?</Text>
                </TouchableOpacity>
                <TouchableOpacity style = { [ragStyles.button, ragStyles.invertedButton, {width: 50} ] }
                                onPress = { e => onRagReset() }>
                    <FontAwesome name={ RagSymbol[rag] } size={ 24 } color={ "#FFF" } />
                </TouchableOpacity>
                <TouchableOpacity style = { [ragStyles.button, ragStyles.invertedButton ] }>
                    <Text style={ ragStyles.buttonLabel }>Issue?</Text>
                </TouchableOpacity>
            </View>
        )
    }
}


class Task extends UI {
    constructor(props) {
        super(props);
        this.state = {
            backgroundColor: RagColor[props.rag],
        }
    }

    onRagSelect = (rag) => this.getReconciler().put(Mutations.UPDATE_STATUS, this.props.snapId, ["snapshot/rag", rag])
    
    onRagReset = () => this.getReconciler().put(Mutations.RESET_STATUS, this.props.snapId, "snapshot/rag")

    onBackgroundColorChange = (color) => this.setState({backgroundColor: color})

    render () {
        const { backgroundColor } = this.state
        const { title, start, end, reconciler, snapId, rag } = this.props

        const swipeRight = [{
            backgroundColor: Colors.risk,
            component:  <View style = {{flex: 1, alignItems: "center", justifyContent: "center"}}>
                            <FontAwesome name="trash-o" size={38} color="#FFF" />
                        </View>
        }]

        const swipeLeft = [{
            backgroundColor: Colors.achievement,
            component:  <View style = {{flex: 1, alignItems: "center", justifyContent: "center"}}>
                            <FontAwesome name="check" size={38} color="#FFF" />
                        </View>
        }]

        //@TODO: swipe/scroll etc. https://github.com/dancormier/react-native-swipeout/wiki
        return (
            <Ripple style           = { taskStyles.shadowContainer }
                    color           = { RagColor[rag] }
                    rippleOpacity   = { 1.0 }
                    rippleDuration  = { 300 }
                    onColor         = { this.onBackgroundColorChange }>
                <Swipeout autoClose = { true }
                          right     = { swipeRight }
                          left      = { swipeLeft }
                          style     = { {backgroundColor: "transparent"} }>
                    <View style = { [taskStyles.container, {backgroundColor: backgroundColor || "#FFFFFF"}] }>
                        <Text style = { [taskStyles.title, backgroundColor && {color: Colors.inverseText}] }>{ title }</Text>
                        {/*<Text style = { taskStyles.status }>Von { Moment(start, "x").format("DD.MM.YY") } bis { Moment(end, "x").format("DD.MM.YY") } ({ Moment(end, "x").fromNow() })</Text>*/}
                        <ProgressBar start = { start } end = { end } at = { Moment().format("x") } isLight = { backgroundColor } />
                        <RAG reconciler  = { reconciler }
                             snapId      = { snapId }
                             rag         = { rag }
                             onRagSelect = { this.onRagSelect }
                             onRagReset  = { this.onRagReset }/>
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

        return (
            <View style = { styles.container }>
                <ScrollView style = { styles.scrollContainer}>
                    <View style = { styles.header }>
                        <Text style = { styles.date }>{ Moment().format("DD. MMMM") }</Text>
                        <Text style = { styles.name }>{name}</Text>
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

export default Status;
