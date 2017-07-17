"use strict";

import d                    from "@clockworks/datascript";
import React                from "react";
import { View,
         StyleSheet,
         Text,
         TouchableOpacity,
         Platform }            from "react-native";

import { makeScreen }       from "../makeScreen";

import { TabNavigator,
         addNavigationHelpers }     from "react-navigation";

import { UI }               from "../UI.react";
import { Mutations,
         Completeness,
         Colors,
         Fonts,
         RAGs }             from "../constants";

import Moment               from "moment";

import { FontAwesome }      from '@expo/vector-icons';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: Colors.background,
        padding: 6
    },
    header: {
    },
    body: {
        flex: 1,
    },
    info: {
        fontSize: Fonts.h3Size,
        color: Colors.body,
    },
    title: {
        fontSize: Fonts.h1Size,
        fontWeight: Fonts.h1Weight,
        color: Colors.accent,
    },
    editorContainer: {
        margin: 3,
        // padding: 6,
        flex: 1,
        flexDirection: "column",
        // backgroundColor: "#FFF",
        // shadowOpacity: (Platform.OS == "ios") ? 0.2 : 0,
        // shadowRadius: 3,
        // shadowOffset: {
        //     height: 2,
        //     width: 3,
        // },
    },
    editor: {
        flex: 1,
    },
    editorFooter: {
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor: "#FFF",
    },
    editorItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        borderRadius: 4,
        // marginHorizontal: 12,
        marginTop: 6,
    },
    editorItemLabel: {
        flex: 1,
        padding: 6,
        color: "#FFF",
        backgroundColor: "transparent",
        fontSize: Fonts.bodySize,
    },
    editorItemHide: {
        paddingRight: 6,
        paddingLeft: 6,
        marginLeft: 6
    },
    hiddenItemsButton: {
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center",
        paddingHorizontal: 12,
        width: 80,
        height: 36, 
        borderRadius: 50,
        // borderWidth: 1,
        borderColor: Colors.accent,
        // backgroundColor: "#FFF"
    },
    tabBarLabel: {
        fontSize: 11,
        textAlign: "center",
    },
    addButton: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        right: 30,
        bottom: 30,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.accent,
        shadowOpacity: 0.35,
        shadowOffset: {
          width: 0,
          height: 5
        },
        shadowColor: "#000",
        shadowRadius: 3,
        elevation: 5,
    },
    addButtonLabel: {
        color: "#FFF",
        fontSize: 24,
    }
})

const ReportHeader = ({title, taskTitle, titleColor}) => (
    <View style = { styles.header }>
        <Text style = { styles.info }>{taskTitle}, { Moment().format("DD.MM.YY") }</Text>
        <Text style = { [styles.title, {color: titleColor}] }>{title}</Text>
    </View>
)

const AddButton = () => (
    <TouchableOpacity style = { styles.addButton }>
        <Text style = { styles.addButtonLabel }>+</Text>
    </TouchableOpacity>
)

const Editor = (type, items) => {
    const bgColor = {
        ["ach"]: "#76C47D",
    }

    const showHiddenItems = true;

    return (
        <View style = { styles.editorContainer}>
            <View style = { styles.editor }>
                <TouchableOpacity style = { [styles.editorItem, { backgroundColor: bgColor["ach"] }] }>
                    <Text style = { styles.editorItemLabel }>Item 1</Text>
                    <TouchableOpacity style = { styles.editorItemHide }><FontAwesome name = "ban" color = "#FFF" size = {20} /></TouchableOpacity>
                </TouchableOpacity>
                <TouchableOpacity style = { [styles.editorItem, { backgroundColor: bgColor["ach"] }] }>
                    <Text style = { styles.editorItemLabel }>Item 2</Text>
                    <TouchableOpacity style = { styles.editorItemHide }><FontAwesome name = "ban" color = "#FFF" size = {20} /></TouchableOpacity>
                </TouchableOpacity>
                <TouchableOpacity style = { [styles.editorItem, { backgroundColor: bgColor["ach"] }] }>
                    <Text style = { styles.editorItemLabel }>Item 3</Text>
                    <TouchableOpacity style = { styles.editorItemHide }><FontAwesome name = "ban" color = "#FFF" size = {20} /></TouchableOpacity>
                </TouchableOpacity>
            </View>
            <View style = { styles.editorFooter }>
                <TouchableOpacity style = { styles.hiddenItemsButton }>
                    { showHiddenItems ? <FontAwesome name = "eye"       color = { Colors.accent } size = {32} /> :
                                        <FontAwesome name = "eye-slash" color = { Colors.lowlight } size = {32} />}
                    
                    { /* <Text style = { {color: Colors.lowlight, fontSize: Fonts.bodySize} }>alle zeigen</Text> */ }
                </TouchableOpacity>
            </View>
        </View>
    )
}


class AchievementsView extends UI {
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
        const { navigation, screenProps, value, params } = this.props

        const taskName = "Workstream 1" // for now hardcoded, later prop of Report

        return (
            <View style = { styles.container }>
                <ReportHeader title    = {navigation.state.routeName}
                              taskName = {taskName} />
                <Editor />
                <AddButton />
            </View>
        )
    }
}

// const AchievementsView = (props) => (<View style = { styles.container }></View>)

class DecisionsView extends UI {
    render () {
        return <View></View>
    }
}

class NextView extends UI {
    render () {
        return <View></View>
    }
}

class RisksView extends UI {
    render () {
        return <View></View>
    }
}

class IssuesView extends UI {
    render () {
        return <View></View>
    }
}

const tabBarIcon = (name, color) => options => <FontAwesome name  = {name}
                                                            size  = {28}
                                                            //color = { options.focused ? color : options.tintColor } 
                                                            color = { options.focused ? Colors.accent : options.tintColor }/>

const tabBarLabel = (title, color) => options => <Text style = { [styles.tabBarLabel, {color: options.focused ? Colors.accent : options.tintColor}] }>{title}</Text>

const RouteConfig = {
    Achievements:   { screen: makeScreen(AchievementsView),
                      navigationOptions: { tabBarIcon: tabBarIcon("trophy", "#76C47D"),
                                          tabBarLabel: tabBarLabel("Achievements", "#76C47D") } },
    Decisions:      { screen: makeScreen(DecisionsView),
                      navigationOptions: { tabBarIcon: tabBarIcon("road", Colors.accentNeutral),
                                          tabBarLabel: tabBarLabel("Decisions", Colors.accentNeutral) } },
    Next:           { screen: makeScreen(NextView),
                      navigationOptions: { tabBarIcon: tabBarIcon("chevron-circle-right", Colors.accentNeutral),
                                          tabBarLabel: tabBarLabel("Next Steps", Colors.accentNeutral) } },
    Risks:          { screen: makeScreen(RisksView),
                      navigationOptions: { tabBarIcon: tabBarIcon("exclamation-triangle", "#EF5350"),
                                          tabBarLabel: tabBarLabel("Risks", "#EF5350") } },
    Issues:         { screen: makeScreen(IssuesView),
                      navigationOptions: { tabBarIcon: tabBarIcon("exclamation-circle", "#FF8A65"),
                                          tabBarLabel: tabBarLabel("Issues", "#FF8A65") } },
}

const TabNavigatorConfig = {
    initialRouteName: "Achievements",
    activeTintColor: Colors.accent,
    tabBarOptions: {
        // labelStyle: {fontSize: 14},
    }
}

const ReportNavigator = TabNavigator(RouteConfig, TabNavigatorConfig);

// Swallows controlled navigation state, so ReportNavigator can control itself
class Report extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            navigation: ReportNavigator.router.getStateForAction(ReportNavigator.router.getActionForPathAndParams('Achievements'))
        }
    }

    dispatchNavigation = (action) => {
        const nextState = ReportNavigator.router.getStateForAction(action, this.state.navigation)
        this.setState({navigation: nextState})
    }

    render () {
        const navigationProps = addNavigationHelpers({
            state: this.state.navigation,
            dispatch: this.dispatchNavigation,
        })

        return (
            <View style={ {flex: 1} }>
                <ReportNavigator navigation = { navigationProps } 
                                screenProps = { {reconciler: this.props.screenProps.reconciler} }/>
            </View>
        )
    }
} 

export default Report;
