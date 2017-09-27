"use strict";

import d                from "@clockworks/datascript";
import React            from "react";

import { View,
         TouchableOpacity,
         Text,
         StyleSheet,
         Modal,
         TextInput,
         Platform }     from "react-native";

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

import Icon             from "react-native-vector-icons/FontAwesome";


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

const ReportableColors = {
    [ReportType.ACHIEVEMENT]: Colors.achievement,
    [ReportType.DECISION]: Colors.decision,
    [ReportType.RISK]: Colors.risk,
    [ReportType.ISSUE]: Colors.issue,
    [ReportType.NEXT]: Colors.next,
};

const snapshotTypes = {
    [ReportType.ACHIEVEMENT]: "snapshot/achievement",
    [ReportType.NEXT]: "snapshot/decision",
    [ReportType.RISK]: "snapshot/risk",
    [ReportType.ISSUE]: "snapshot/issue",
    [ReportType.DECISION]: "snapshot/next",
};

export class AddReportableInStatus extends UI {
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
                                <TouchableOpacity style   = { [addReportableStyle.OKButton, {backgroundColor: ReportableColors[type]} ] }
                                                  onPress = { e => { reconciler.put(Mutations.CANCEL_ADD_REPORTABLE) } }>
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


export class AddReportableInReport extends UI {
    constructor (props) {
        super(props);
        this.state = {text: ""};
    }

    addReportable () {
        const { reconciler, taskId, taskOwner, toggleAddItem, type, newItemPosition } = this.props;

        toggleAddItem();

        if (this.state.text.trim() !== "") {
            reconciler.put(Mutations.UPDATE_STATUS, taskId, 
                [snapshotTypes[type], {"reportable/title": this.state.text, "reportable/reporter": taskOwner, "reportable/order": newItemPosition }]);
        }
    }

    render () {
        const { type, toggleAddItem } = this.props

        return (
            <Modal  animationType   = { "slide" }
                    transparent     = { true }
                    visible         = { true }
                    onRequestClose  = { () => { console.log ("do something")} }>
                <View style = { addReportableStyle.overlay }>
                    <View style = { {flexDirection: "row", paddingHorizontal: 36} }>
                        <View style = { [addReportableStyle.bubble, {flex: 1, flexDirection: "column", marginBottom: 18}] }>
                            <Text style = { [ addReportableStyle.title, {color: ReportableColors[type]} ] }>Neues Item</Text>

                            <TextInput style            = { [addReportableStyle.editor] }
                                       autoFocus        = { true }
                                       onChangeText     = { text => this.setState({text}) }
                                       value            = { this.state.text }
                                       placeholder      = ""
                                       multiline        = { true }
                                       onSubmitEditing  = { () => { } } />  

                            <View style= { {flexDirection: "row", alignItems: "center", justifyContent: "center"} }>
                                <TouchableOpacity style   = { [addReportableStyle.OKButton, {backgroundColor: ReportableColors[type]} ] }
                                                  onPress = { e => { this.addReportable(); } }>
                                    <Text style = { addReportableStyle.buttonLabel }>Hinzufügen</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style = { addReportableStyle.cancelButton }
                                            onPress = { e => { toggleAddItem(); } }>
                                <Icon name = "remove" color = { Colors.issue } size = {28} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}
