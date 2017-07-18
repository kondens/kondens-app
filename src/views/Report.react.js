"use strict";

import d                    from "@clockworks/datascript";
import React                from "react";
import { View,
         StyleSheet,
         Text,
         TouchableOpacity,
         Platform,
         Animated,
         LayoutAnimation,
         TextInput }            from "react-native";

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
    addingView : {
        height: 32.5,
        borderWidth: 2,
        padding: 6,
        flexDirection: "row",
        borderRadius: 4,
        marginTop: 6,
        color: Colors.body,
        fontSize: Fonts.bodySize,
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

const AddButton = ({onPress}) => (
    <TouchableOpacity style   = { styles.addButton }
                      onPress = { onPress }>
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

class Reportable extends UI {
    constructor(props) {
        super(props);
        if (this.props.isExcluded) {
            this.state = {fadeValue: new Animated.Value(0.5)};
        } else {
            this.state = {fadeValue: new Animated.Value(1)};
        }

        this.excluderRef = undefined;
    }

    startFade (toValue) { Animated.timing(this.state.fadeValue, { toValue: toValue }).start() }

    handleExclusion () {
        const { isExcluded, itemId, showExcluded} = this.props;

        this.excluderRef.startRotation();
        if (isExcluded) {
            reconciler.put(Mutations.INCLUDE_REPORTABLE, itemId);
            this.startFade(1);
        } else {
            reconciler.put(Mutations.EXCLUDE_REPORTABLE, itemId);
            if (showExcluded) { 
                this.startFade(0.5); 
            } else { 
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                this.startFade(0); 
            }
        } 
    }

    render () {
        const { title, color, reconciler, isExcluded } = this.props

        const fade = this.state.fadeValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        })

        return (
            <Animated.View style = { {opacity: this.state.fadeValue} }>
                <TouchableOpacity style = { [styles.editorItem, { backgroundColor: color }] }>
                    <Text style = { styles.editorItemLabel }>{title}</Text>
                    <TouchableOpacity style   = { styles.editorItemHide }
                                      onPress = { (e) => { this.handleExclusion() } }>
                        <AnimatedExcluder name = "plus"
                                          ref  = { ref => { this.excluderRef = ref } }
                                          isExcluded = { isExcluded }/>
                    </TouchableOpacity>
                </TouchableOpacity> 
            </Animated.View>
        )
    }
}

class AddingView extends UI {
    constructor (props) {
        super(props);

        this.state = {text: ""};
    }

    render () {
        const { reconciler, borderColor } = this.props

        return (
            <TextInput style            = { [styles.addingView, {borderColor: borderColor}] }
                       autoFocus        = { true }
                       onChangeText     = { text => this.setState({text}) }
                       value            = { this.state.text }
                       placeholder      = "Neues Item..."
                       onSubmitEditing  = { () => console.log("erstelle neues Item!") }
                       returnKeyType    = "done" />  
        )
    }
}


const Editor = ({type, items, showExcludedReportables, reconciler, isAddingItem}) => {
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
                { d.isEmpty(items) && !isAddingItem ? <Text style = { styles.info }>Noch keine Items</Text> :
                    d.intoArray(d.map((item) => {
                        if (showExcludedReportables || !d.get(item, "reportable/isExcluded")) {
                            return <Reportable key        = { d.get(item, d.DB_ID) }
                                               itemId     = { d.get(item, d.DB_ID) }
                                               title      = { d.get(item, type + "/title") }
                                               color      = { bgColor[type] }
                                               reconciler = { reconciler }
                                               isExcluded = { d.get(item, "reportable/isExcluded") }
                                               showExcluded = { showExcludedReportables } />
                        } else { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut) /*@TODO: better place while still guaranteeing first anim */}
                    }, items))
                }
                { isAddingItem && <AddingView reconciler = { reconciler}
                                              borderColor = { bgColor[type] } />}
            </View>
            <View style = { styles.editorFooter }>
                { showExcludedReportables ? 
                      <TouchableOpacity style   = { styles.hiddenItemsButton }
                                        onPress = { () => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                                            reconciler.put(Mutations.HIDE_EXCLUDED_REPORTABLES) } }>
                          <FontAwesome name = "eye" color = { Colors.accent } size = {32} />
                      </TouchableOpacity> 
                  :
                      <TouchableOpacity style   = { styles.hiddenItemsButton }
                                        onPress = { () => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                                            reconciler.put(Mutations.SHOW_EXCLUDED_REPORTABLES) } }>
                          <FontAwesome name = "eye-slash" color = { Colors.accent } size = {32} />
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

    const overallRag = d.get(ownerPart, "snapshot/rag");

    const allItems = d.concat(highlevelItems, lowlevelItems);

    return (
        <View style = { styles.container }>
            <ReportHeader title      = { title }
                          taskTitle  = { taskTitle }
                          titleColor = { titleColor }
                          rag        = { overallRag }
                          taskId     = { taskId }
                          reconciler = { reconciler } />
            <Editor items = { allItems }
                    type = { type }
                    showExcludedReportables = { showExcludedReportables }
                    isAddingItem = { isAddingItem }
                    reconciler = { reconciler }/>
            <AddButton onPress = { toggleAddItem }/>
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

    constructor (props) {
        super(props)
        this.state = {isAddingItem: false}
    }

    render () {
        return <ReportViewMaker task  = { d.get(this.props.value, this.params.taskIdent) }
                                type  = { ReportType.ACHIEVEMENT }
                                title = { this.props.navigation.state.routeName }
                                titleColor = { Colors.achievement }
                                isAddingItem = { this.state.isAddingItem }
                                toggleAddItem = { () => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                                          this.setState({isAddingItem: !this.state.isAddingItem});
                                                        }}
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

    constructor (props) {
        super(props)
        this.state = {isAddingItem: false}
    }

    render () {
        return <ReportViewMaker task  = { d.get(this.props.value, this.params.taskIdent) }
                                type  = { ReportType.DECISION }
                                title = { this.props.navigation.state.routeName }
                                titleColor = { Colors.decision }
                                isAddingItem = { this.state.isAddingItem }
                                toggleAddItem = { () => {this.setState({isAddingItem: !this.state.isAddingItem})}}
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

    constructor (props) {
        super(props)
        this.state = {isAddingItem: false}
    }

    render () {
        return <ReportViewMaker task  = { d.get(this.props.value, this.params.taskIdent) }
                                type  = { ReportType.NEXT }
                                title = { this.props.navigation.state.routeName }
                                titleColor = { Colors.next }
                                isAddingItem = { this.state.isAddingItem }
                                toggleAddItem = { () => {this.setState({isAddingItem: !this.state.isAddingItem})}}
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

    constructor (props) {
        super(props)
        this.state = {isAddingItem: false}
    }

    render () {
        return <ReportViewMaker task  = { d.get(this.props.value, this.params.taskIdent) }
                                type  = { ReportType.RISK }
                                title = { this.props.navigation.state.routeName }
                                titleColor = { Colors.risk }
                                isAddingItem = { this.state.isAddingItem }
                                toggleAddItem = { () => {this.setState({isAddingItem: !this.state.isAddingItem})}}
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

    constructor (props) {
        super(props)
        this.state = {isAddingItem: false}
    }

    render () {
        return <ReportViewMaker task  = { d.get(this.props.value, this.params.taskIdent) }
                                type  = { ReportType.ISSUE }
                                title = { this.props.navigation.state.routeName }
                                titleColor = { Colors.issue }
                                isAddingItem = { this.state.isAddingItem }
                                toggleAddItem = { () => {this.setState({isAddingItem: !this.state.isAddingItem})}}
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
