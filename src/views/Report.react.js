"use strict";

import d                    from "@clockworks/datascript";
import React                from "react";
import { View,
         StyleSheet,
         Text,
         TouchableOpacity,
         Platform,
         Animated }            from "react-native";

import { makeScreen }       from "../makeScreen";

import { TabNavigator,
         addNavigationHelpers }     from "react-navigation";

import { UI }               from "../UI.react";
import { Mutations,
         Completeness,
         Colors,
         Fonts,
         RAGs,
         ReportType }             from "../constants";

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

const AnimatedFontAwesome = Animated.createAnimatedComponent(FontAwesome)

class AnimatedExcluder extends UI {
    constructor(props) {
        super(props);
        if (this.props.isExcluded) {
            this.state = {spinValue: new Animated.Value(1)};
        } else {
            this.state = {spinValue: new Animated.Value(0)};
        }
        
    }

    startRotation () {
        if (this.state.spinValue._value > 0) {
            Animated.spring(this.state.spinValue, { toValue: 0 }).start()
        } else {
            Animated.spring(this.state.spinValue, { toValue: 1 }).start();
        }
    }

    render () {
        const spin = this.state.spinValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '135deg']
        })

        return <AnimatedFontAwesome style = { {transform: [{rotate: spin}]} } 
                                     name = {this.props.name} 
                                    color = "#FFF" 
                                     size = {20} />
    }
}

const Item = ({title, color, reconciler, itemId, isExcluded}) => {
    let excluderRef = null;

    return (
        <TouchableOpacity style = { [styles.editorItem, { backgroundColor: color }, isExcluded && { backgroundColor: color + "77" }] }>
            <Text style = { styles.editorItemLabel }>{title}</Text>
            <TouchableOpacity style   = { styles.editorItemHide }
                              onPress = { (e) => {  isExcluded ? reconciler.put(Mutations.INCLUDE_REPORTABLE, itemId) :
                                                                 reconciler.put(Mutations.EXCLUDE_REPORTABLE, itemId)
                                                    excluderRef.startRotation(); } }>
                <AnimatedExcluder name = "plus"
                                  ref  = { ref => { excluderRef = ref } }
                                  isExcluded = { isExcluded }/>
            </TouchableOpacity>
        </TouchableOpacity> 
    )
}

const Editor = ({type, items, showExcludedReportables, reconciler}) => {
    const bgColor = {
        [ReportType.ACHIEVEMENT]: Colors.achievement,
        [ReportType.ISSUE]: Colors.issue,
        [ReportType.NEXT]: Colors.next,
        [ReportType.DECISION]: Colors.decision,
        [ReportType.RISK]: Colors.risk,
    }

    return (
        <View style = { styles.editorContainer}>
            <View style = { styles.editor }>
                { d.isEmpty(items) ? <Text style = { styles.info }>Noch keine Items</Text> :
                    d.intoArray(d.map((item) => {
                        if (showExcludedReportables || !d.get(item, "reportable/isExcluded")) {
                            return <Item key        = { d.get(item, d.DB_ID) }
                                         itemId     = { d.get(item, d.DB_ID) }
                                         title      = { d.get(item, type + "/title") }
                                         color      = { bgColor[type] }
                                         reconciler = { reconciler }
                                         isExcluded = { d.get(item, "reportable/isExcluded") } />
                        }
                    }, items))
                }
            </View>
            <View style = { styles.editorFooter }>
                { showExcludedReportables ? 
                      <TouchableOpacity style   = { styles.hiddenItemsButton }
                                        onPress = { () => { reconciler.put(Mutations.HIDE_EXCLUDED_REPORTABLES) } }>
                          <FontAwesome name = "eye"       color = { Colors.accent } size = {32} />
                      </TouchableOpacity> 
                  :
                      <TouchableOpacity style   = { styles.hiddenItemsButton }
                                        onPress = { () => { reconciler.put(Mutations.SHOW_EXCLUDED_REPORTABLES) } }>
                          <FontAwesome name = "eye-slash"       color = { Colors.accent } size = {32} />
                      </TouchableOpacity> }
            </View>
        </View>
    )
}

const ReportViewMaker = ({task, type, title, titleColor, showExcludedReportables, reconciler}) => {
    const ownerPart = d.getIn(task, ["task/newestSnapshot", 0]);
    const taskOwner = d.getIn(ownerPart, ["snapshot/staff", d.DB_ID]);
    const taskTitle = d.get(ownerPart, "snapshot/title");
    const highlevelItems = d.get(ownerPart, "snapshot/" + type);

    const workerPart = d.get(task, "task/children");
    const lowlevelItems = d.pipeline(workerPart,
                                            tasks => d.map(task => d.getIn(task, ["task/newestSnapshot", 0, "snapshot/" + type]), tasks),
                                            d.flatten,
                                            tasks => d.filter(d.identity, tasks));

    const allItems = d.concat(highlevelItems, lowlevelItems);

    return (
        <View style = { styles.container }>
            <ReportHeader title    = { title }
                          taskTitle = { taskTitle }
                          titleColor = { titleColor } />
            <Editor items = { allItems }
                    type = { type }
                    showExcludedReportables = { showExcludedReportables }
                    reconciler = { reconciler }/>
            <AddButton />
        </View>
    )
}


class AchievementsView extends UI {
    static query ({taskIdent}) {
        return d.vector(
            d.hashMap( d.vector("db/ident", ":ui"), `[ "ui/showExcludedReportables" ]`),
            d.hashMap(
                taskIdent, `[ { (read "task/newestSnapshot") [ "snapshot/title"
                                                                "snapshot/staff"
                                                                { "snapshot/achievement" [ "achievement/title"
                                                                                           :db/id
                                                                                           "achievement/reporter"
                                                                                           "reportable/isExcluded" ] } ] } 
                              { "task/children" [ { (read "task/newestSnapshot") [ { "snapshot/achievement" [ "achievement/title"
                                                                                                              :db/id
                                                                                                              "achievement/reporter"
                                                                                                              "reportable/isExcluded" ] } ] }]}]`
            )
        )
    }

    render () {
        return <ReportViewMaker task  = { d.get(this.props.value, this.params.taskIdent) }
                                type  = { ReportType.ACHIEVEMENT }
                                title = { this.props.navigation.state.routeName }
                                titleColor = { Colors.achievement }
                                showExcludedReportables = { d.getIn(this.props.value, [d.vector("db/ident", ":ui"), "ui/showExcludedReportables"], false) }
                                reconciler = { this.getReconciler() } />
    }
}

class DecisionsView extends UI {
    static query ({taskIdent}) {
        return d.vector(
            d.hashMap( d.vector("db/ident", ":ui"), `[ "ui/showExcludedReportables" ]`),
            d.hashMap(
                taskIdent, `[ { (read "task/newestSnapshot") [ "snapshot/title"
                                                                "snapshot/staff"
                                                                { "snapshot/decision" [ "decision/title"
                                                                                        :db/id
                                                                                        "decision/reporter"
                                                                                        "reportable/isExcluded" ] } ] } 
                              { "task/children" [ { (read "task/newestSnapshot") [ { "snapshot/decision" [ "decision/title"
                                                                                                           :db/id
                                                                                                           "decision/reporter"
                                                                                                           "reportable/isExcluded" ] } ] }]}]`
            )
        )
    }

    render () {
        return <ReportViewMaker task  = { d.get(this.props.value, this.params.taskIdent) }
                                type  = { ReportType.DECISION }
                                title = { this.props.navigation.state.routeName }
                                titleColor = { Colors.decision }
                                showExcludedReportables = { d.getIn(this.props.value, [d.vector("db/ident", ":ui"), "ui/showExcludedReportables"], false) }
                                reconciler = { this.getReconciler() } />
    }
}

class NextView extends UI {
    static query ({taskIdent}) {
        return d.vector(
            d.hashMap( d.vector("db/ident", ":ui"), `[ "ui/showExcludedReportables" ]`),
            d.hashMap(
                taskIdent, `[ { (read "task/newestSnapshot") [ "snapshot/title"
                                                                "snapshot/staff"
                                                                { "snapshot/next" [ "next/title"
                                                                                        :db/id
                                                                                        "next/reporter"
                                                                                        "reportable/isExcluded" ] } ] } 
                              { "task/children" [ { (read "task/newestSnapshot") [ { "snapshot/next" [ "next/title"
                                                                                                           :db/id
                                                                                                           "next/reporter"
                                                                                                           "reportable/isExcluded" ] } ] }]}]`
            )
        )
    }

    render () {
        return <ReportViewMaker task  = { d.get(this.props.value, this.params.taskIdent) }
                                type  = { ReportType.NEXT }
                                title = { this.props.navigation.state.routeName }
                                titleColor = { Colors.next }
                                showExcludedReportables = { d.getIn(this.props.value, [d.vector("db/ident", ":ui"), "ui/showExcludedReportables"], false) }
                                reconciler = { this.getReconciler() } />
    }
}

class RisksView extends UI {
    static query ({taskIdent}) {
        return d.vector(
            d.hashMap( d.vector("db/ident", ":ui"), `[ "ui/showExcludedReportables" ]`),
            d.hashMap(
                taskIdent, `[ { (read "task/newestSnapshot") [ "snapshot/title"
                                                                "snapshot/staff"
                                                                { "snapshot/risk" [ "risk/title"
                                                                                        :db/id
                                                                                        "risk/reporter"
                                                                                        "reportable/isExcluded" ] } ] } 
                              { "task/children" [ { (read "task/newestSnapshot") [ { "snapshot/risk" [ "risk/title"
                                                                                                           :db/id
                                                                                                           "risk/reporter"
                                                                                                           "reportable/isExcluded" ] } ] }]}]`
            )
        )
    }

    render () {
        return <ReportViewMaker task  = { d.get(this.props.value, this.params.taskIdent) }
                                type  = { ReportType.RISK }
                                title = { this.props.navigation.state.routeName }
                                titleColor = { Colors.risk }
                                showExcludedReportables = { d.getIn(this.props.value, [d.vector("db/ident", ":ui"), "ui/showExcludedReportables"], false) }
                                reconciler = { this.getReconciler() } />
    }
}

class IssuesView extends UI {
    static query ({taskIdent}) {
        return d.vector(
            d.hashMap( d.vector("db/ident", ":ui"), `[ "ui/showExcludedReportables" ]`),
            d.hashMap(
                taskIdent, `[ { (read "task/newestSnapshot") [ "snapshot/title"
                                                                "snapshot/staff"
                                                                { "snapshot/issue" [ "issue/title"
                                                                                        :db/id
                                                                                        "issue/reporter"
                                                                                        "reportable/isExcluded" ] } ] } 
                              { "task/children" [ { (read "task/newestSnapshot") [ { "snapshot/issue" [ "issue/title"
                                                                                                           :db/id
                                                                                                           "issue/reporter"
                                                                                                           "reportable/isExcluded" ] } ] }]}]`
            )
        )
    }

    render () {
        return <ReportViewMaker task  = { d.get(this.props.value, this.params.taskIdent) }
                                type  = { ReportType.ISSUE }
                                title = { this.props.navigation.state.routeName }
                                titleColor = { Colors.issue }
                                showExcludedReportables = { d.getIn(this.props.value, [d.vector("db/ident", ":ui"), "ui/showExcludedReportables"], false) }
                                reconciler = { this.getReconciler() } />
    }
}

const tabBarIcon = (name, color) => options => <FontAwesome name  = {name}
                                                            size  = {28}
                                                            //color = { options.focused ? color : options.tintColor } 
                                                            color = { options.focused ? Colors.accent : options.tintColor }/>

const tabBarLabel = (title, color) => options => <Text style = { [styles.tabBarLabel, {color: options.focused ? Colors.accent : options.tintColor}] }>{title}</Text>

const RouteConfig = {
    Achievements:   { screen: makeScreen(AchievementsView),
                      navigationOptions: { tabBarIcon: tabBarIcon("trophy", Colors.achievement),
                                          tabBarLabel: tabBarLabel("Achievements", Colors.achievement) } },
    Decisions:      { screen: makeScreen(DecisionsView),
                      navigationOptions: { tabBarIcon: tabBarIcon("road", Colors.accentNeutral),
                                          tabBarLabel: tabBarLabel("Decisions", Colors.accentNeutral) } },
    ["Next Steps"]: { screen: makeScreen(NextView),
                      navigationOptions: { tabBarIcon: tabBarIcon("chevron-circle-right", Colors.accentNeutral),
                                          tabBarLabel: tabBarLabel("Next Steps", Colors.accentNeutral) } },
    Risks:          { screen: makeScreen(RisksView),
                      navigationOptions: { tabBarIcon: tabBarIcon("exclamation-triangle", Colors.risk),
                                          tabBarLabel: tabBarLabel("Risks", Colors.risk) } },
    Issues:         { screen: makeScreen(IssuesView),
                      navigationOptions: { tabBarIcon: tabBarIcon("exclamation-circle", Colors.issue),
                                          tabBarLabel: tabBarLabel("Issues", Colors.issue) } },
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
        //@TODO: handle query-relevant param setting for each sub-component more gracefully
        this.state.navigation.routes.forEach((element, index, array) => { element["params"] = this.props.navigation.state.params})

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
