"use strict";

import d                from "@clockworks/datascript";
import React            from "react";
import { View,
         TouchableOpacity,
         Text,
         StyleSheet,
         Platform,
         Modal,
         ScrollView,
         TextInput,
         Alert }        from "react-native";

import { UI }           from "../UI.react";
import { Mutations,
         Colors,
         TitleColors,
         Fonts,
         RAGs,
         RagColor,
         RagSymbol,
         ReportType,
         Routes, }      from "../constants";

import Moment           from "moment";

import Icon             from "react-native-vector-icons/FontAwesome";

// import Swipeout         from "react-native-swipeout";

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

    ragLabel: {
        letterSpacing: 1,
        fontSize: Fonts.bodySize,
        fontWeight: "bold",
    }
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
        borderColor: Colors.accentNeutral,
    },
    progress: {
        // borderTopWidth: 2,
        flex: 1,
        height: 2,
        backgroundColor: Colors.accentNeutral,
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
    },
    button: {
        borderRadius: 50,
        paddingVertical: 6,
        paddingHorizontal: 6,
        flex: 1,
        // width: 80,
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

const addReportableStyle = StyleSheet.create({
    overlay: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "rgba(0, 0, 0, 0.649)",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    bubble: {
        marginTop: 72,
        padding: 12,
        backgroundColor: "#FFFFFF",
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderRadius: 8,
        borderColor: "#EEEEEE",
        elevation: 2,
        borderWidth: 1,

        shadowColor: "#000000",
        shadowOpacity: (Platform.OS == "ios") ? 0.11 : 0,
        shadowRadius: 1,
        shadowOffset: {
            height: 2,
            width: 2
        },
    },
    title: {
        fontSize: Fonts.h3Size,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 12,
    },
    editor: {
        fontSize: Fonts.bodySize,
        marginBottom: 12,
    },
    OKButton: {
        // flex: 1,
        maxHeight: 48,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 6,
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 25,
        backgroundColor: Colors.achievement,
        width: 200,
    },
    cancelButton: {
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "#EEE", 
        position: "absolute", 
        top: -22, 
        right: -22, 
        width: 44, 
        height: 44, 
        padding: 6,
        backgroundColor: "#FFF",

        elevation: 2,
        shadowColor: "#000000",
        shadowOpacity: (Platform.OS == "ios") ? 0.11 : 0,
        shadowRadius: 1,
        shadowOffset: {
            height: 2,
            width: 2
        },

        justifyContent: "center",
        alignItems: "center",
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
            <Icon color = "#FFF" name = "trophy" size = {20} />
        </ActionButton.Item>
        <ActionButton.Item textStyle   = { {color: Colors.body, fontSize: Fonts.bodySize} } 
                           buttonColor = { Colors.risk }
                           title       = "Weitere Risks" 
                           onPress     = {() => {reconciler.put(Mutations.ADD_REPORTABLE, ReportType.RISK)}}>
            <Icon color = "#FFF" name = "exclamation-circle" size = {20} />
        </ActionButton.Item>
        <ActionButton.Item textStyle   = { {color: Colors.body, fontSize: Fonts.bodySize} } 
                           buttonColor = { Colors.issue } 
                           title       = "Weitere Issues" 
                           onPress     = {() => {reconciler.put(Mutations.CREATE_STATUS)}}>
            <Icon color = "#FFF" name = "exclamation-triangle" size = {20} />
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
                    <Text style         = { [progressBarStyles.label, progressBarStyles.start, isLight && {color: "#FFF"}] }
                          numberOfLines = { 1 }
                          ellipsizeMode = { "tail" }>
                        { Moment(start, "x").format("DD. MMM") } bis { Moment(end, "x").format("DD. MMM") } ({ Moment(end, "x").fromNow() })
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
                                    progressBarStyles.left,
                                    isLight && { borderColor: "#FFFFFF" },
                                    { flex: progress } ] }>
                        { <View style={ [ progressBarStyles.progress, isLight && { backgroundColor: "#FFFFFF" } ] } /> }
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
                <TouchableOpacity style = { ragStyles.button }
                                onPress = { e => onRagSelect(RAGs.GREEN) }>
                    <Text style={ [styles.ragLabel, {color: Colors.achievement}] }>{RAGs.GREEN}</Text>
                </TouchableOpacity>
                <TouchableOpacity style = { ragStyles.button }
                                onPress = { e => onRagSelect(RAGs.AMBER) }>
                    <Text style={ [styles.ragLabel, {color: "#FFC107"}] }>{RAGs.AMBER}</Text>
                </TouchableOpacity>
                <TouchableOpacity style = { ragStyles.button }
                                onPress = { e => onRagSelect(RAGs.RED) }>
                    <Text style={ [styles.ragLabel, {color: Colors.issue}] }>{RAGs.RED}</Text>
                </TouchableOpacity>
                <TouchableOpacity style = { ragStyles.button }
                                onPress = { e => onRagSelect(RAGs.DONE) }>
                    <Text style={ [styles.ragLabel, {color: "#CCC"}] }>{RAGs.DONE}</Text>
                </TouchableOpacity>
            </View>
        )
    } else {
        return (
            <View style = { ragStyles.container }>
                <TouchableOpacity style = { [ragStyles.button] }
                                onPress = { e => onRagReset() }>
                    <Text style={ [styles.ragLabel, {color: "#FFF"}] }>RESET</Text>
                </TouchableOpacity>
                <TouchableOpacity style = { ragStyles.button }>
                    <Text style={ [styles.ragLabel, {color: "#FFF"}] }>RISK?</Text>
                </TouchableOpacity>
                <TouchableOpacity style = { ragStyles.button }>
                    <Text style={ [styles.ragLabel, {color: "#FFF"}] }>ISSUE?</Text>
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

    onRagSelect = rag => this.getReconciler().put(Mutations.UPDATE_STATUS, this.props.snapId, ["snapshot/rag", rag])
    
    onRagReset = () => this.getReconciler().put(Mutations.RESET_STATUS, this.props.snapId, "snapshot/rag")

    onBackgroundColorChange = color => this.setState({backgroundColor: color})

    render () {
        const { backgroundColor } = this.state
        const { title, start, end, reconciler, snapId, rag } = this.props

        const showRag = start < Moment().format("x");

        // const swipeRight = [{
        //     backgroundColor: Colors.risk,
        //     component:  <View style = {{flex: 1, alignItems: "center", justifyContent: "center"}}>
        //                     <Icon name="trash-o" size={38} color="#FFF" />
        //                 </View>
        // }]

        // const swipeLeft = [{
        //     backgroundColor: Colors.achievement,
        //     component:  <View style = {{flex: 1, alignItems: "center", justifyContent: "center"}}>
        //                     <Icon name="check" size={38} color="#FFF" />
        //                 </View>
        // }]

        return (
            <Ripple style           = { taskStyles.shadowContainer }
                    color           = { RagColor[rag] }
                    rippleOpacity   = { 1.0 }
                    rippleDuration  = { 300 }
                    onColor         = { this.onBackgroundColorChange }>
                <View style = { [taskStyles.container, {backgroundColor: backgroundColor || "#FFFFFF"}] }>
                    <Text style = { [taskStyles.title, backgroundColor && {color: Colors.inverseText}] }>{ title }</Text>
                    {/*<Text style = { taskStyles.status }>Von { Moment(start, "x").format("DD.MM.YY") } bis { Moment(end, "x").format("DD.MM.YY") } ({ Moment(end, "x").fromNow() })</Text>*/}
                    <ProgressBar start = { start } end = { end } at = { Moment().format("x") } isLight = { backgroundColor } />
                    { showRag && 
                        <RAG reconciler  = { reconciler }
                             snapId      = { snapId }
                             rag         = { rag }
                             onRagSelect = { this.onRagSelect }
                             onRagReset  = { this.onRagReset }/>
                    }
                </View>
            </Ripple>
        )
    }
}

const ReportableColors = {
    [ReportType.ACHIEVEMENT]: Colors.achievement,
    [ReportType.DECISION]: Colors.decision,
    [ReportType.RISK]: Colors.risk,
    [ReportType.ISSUE]: Colors.issue,
    [ReportType.NEXT]: Colors.next,
};

class AddReportable extends UI {
    constructor (props) {
        super(props);
        this.state = {text: ""};
    }

    render () {
        const { reconciler, type } = this.props;

        return (
            <Modal  animationType   = { "slide" }
                    transparent     = { true }
                    visible         = { true }
                    onRequestClose  = { () => { console.log ("do something")} }>
                <View style = { addReportableStyle.overlay }>
                    <View style = { {flexDirection: "row", paddingHorizontal: 36} }>
                        <View style = { [addReportableStyle.bubble, {flex: 1, flexDirection: "column", marginBottom: 18}] }>
                            <Text style = { [ addReportableStyle.title, {color: ReportableColors[type]} ] }>Neues {type}</Text>

                            <TextInput style            = { [addReportableStyle.editor] }
                                       autoFocus        = { true }
                                       onChangeText     = { text => this.setState({text}) }
                                       value            = { this.state.text }
                                       placeholder      = ""
                                       multiline        = { true }
                                       onSubmitEditing  = { () => { } } />  

                            <View style= { {flexDirection: "row", alignItems: "center", justifyContent: "center"} }>
                                <TouchableOpacity style   = { addReportableStyle.OKButton }
                                                  onPress = { e => { } }>
                                    <Text style = { addReportableStyle.buttonLabel }>Hinzufügen</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style = { addReportableStyle.cancelButton }
                                            onPress = { e => { reconciler.put(Mutations.CANCEL_ADD_REPORTABLE) } }>
                                <Icon name = "remove" color = { Colors.issue } size = {28} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

}

export class Status extends UI {
    static query () {
        return d.vector(
            d.hashMap( d.vector("db/ident", ":ui"), `[ "ui/addingReportable" ]`), 
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

        const addingReportable = d.getIn(value, [d.vector("db/ident", ":ui"), "ui/addingReportable"]);
        console.log(addingReportable)

        const userIdent = d.vector("db/ident", ":user-data")
        const name = d.getIn(value, [userIdent, "user/staff", "staff/name"]);
        const staffId = d.getIn(value, [userIdent, "user/staff", d.DB_ID]);

        const snaps = d.getIn(value, [userIdent, "user/currentSnaps"]);
        const wipSnaps = d.filter((task) => (d.get(task, "snapshot/RAG") !== RAGs.DONE), snaps);
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
                { addingReportable && <AddReportable type = { addingReportable } reconciler = { this.getReconciler() } /> }
            </View>
        )
    }
}

export default Status;
