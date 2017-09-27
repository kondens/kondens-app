"use strict";

import d                        from "@clockworks/datascript";
import React                    from "react";
import { View,
         StyleSheet,
         Text,
         TouchableOpacity,
         TouchableHighlight,
         TouchableWithoutFeedback,
         Platform,
         Animated,
         LayoutAnimation,
         TextInput,
         KeyboardAvoidingView,
         ScrollView,
         Alert,
         Modal, } from "react-native";

import { makeScreen }           from "../makeScreen";

import { TabNavigator,
         addNavigationHelpers } from "react-navigation";

import { UI }                   from "../UI.react";
import { Mutations,
         Colors,
         Fonts,
         RAGs,
         ReportType }           from "../constants";

import Moment                   from "moment";

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Icon from "react-native-vector-icons/FontAwesome";
import SortableListView from "../components/SortableListView";
    
import { AddReportableInReport } from "../components/AddReportable"; 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: "column",
        paddingTop: 18,
        paddingHorizontal: 12,
        paddingBottom: 24,
    },
    headerInfo: {
        flexDirection: "row",
        marginBottom: 6,
    },
    taskTitle: {
        fontSize: Fonts.h3Size,
        color: Colors.body,
    },
    ragTitle: {
        textAlign: "center",
        paddingLeft: 8,
        marginBottom: 6,
        fontSize: Fonts.h3Size,
        color: Colors.body,
    },
    date: {
        fontSize: Fonts.h3Size,
        fontWeight: "bold",
        color: Colors.accent,
        marginRight: 6,
    },

    info: {
        flex: 1,
        marginLeft: 6,
        fontSize: Fonts.h3Size,
        color: Colors.body,
    },
    title: {
        fontSize: Fonts.h2Size,
        fontWeight: Fonts.h2Weight,
        color: Colors.accent,
    },
    editorContainer: {
        marginHorizontal: 6,
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
        marginVertical: 3,
        marginHorizontal: 6,
        padding: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 2,
        shadowOpacity: (Platform.OS == "ios") ? 0.18 : 0,
        shadowRadius: 1,
        shadowOffset: {
            height: 1,
            width: 0,
        },
    },
    textWrap: {
        flexDirection: "column",
    },
    editorItemLabel: {
        color: "#FFF",
        backgroundColor: "transparent",
        fontSize: Fonts.bodySize,
        paddingRight: 24
        // textAlign: 'left',
        // flexWrap: 'wrap',
    },
    editorItemHide: {
        position: "absolute",
        right: 0,
        padding: 12,
    },
    addingView : {
        height: 32.5,
        borderWidth: 2,
        padding: 6,
        flexDirection: "row",
        borderRadius: 4,
        marginTop: 6,
        marginHorizontal: 6,
        color: Colors.body,
        fontSize: Fonts.bodySize,
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
        lineHeight: 24,
    },
    ragContainer : {
        flexDirection: "row",
        height: 36,
    },
    ragItem : {
        borderWidth: 1,
        // paddingVertical: 6,
        paddingHorizontal: 12,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
        marginLeft: 6,
    },
    exportText: {
        color: Colors.accent,
        fontSize: Fonts.bodySize,
        margin: 12,
    },
})


export class Export extends UI {
    static query () {
        return d.vector()
    }

    constructor (props) {
        super(props)
    }

    render () {
        const { value, params } = this.props;

        return (
            <TouchableOpacity onPress  = { e => {Alert.alert("Report-Export", "Report wurde per E-Mail verschickt.",
                                                              [{text: "OK", onPress: () => {}}]) } }>
                <Text style = { styles.exportText }>Export</Text>
            </TouchableOpacity>
        )
    }
}


const RAG = ({rag, reconciler, taskId}) => (
    <View style = { styles.ragContainer }>
        <TouchableOpacity style   = { [styles.ragItem, {borderColor: Colors.achievement}, rag == RAGs.GREEN && {backgroundColor: Colors.achievement}] }
                          onPress = { () => { reconciler.put(Mutations.UPDATE_STATUS, taskId, ["snapshot/rag", RAGs.GREEN]) } }>
            <Text style={ [{fontWeight: "bold", color: Colors.achievement}, rag == RAGs.GREEN && {color: "#FFF"}] }>G</Text>
        </TouchableOpacity>
        <TouchableOpacity style   = { [styles.ragItem, {borderColor: Colors.amber}, rag == RAGs.AMBER && {backgroundColor: Colors.amber}] }
                          onPress = { () => { reconciler.put(Mutations.UPDATE_STATUS, taskId, ["snapshot/rag", RAGs.AMBER]) } }>
            <Text style={ [{fontWeight: "bold", color: Colors.amber}, rag == RAGs.AMBER && {color: "#FFF"}] }>A</Text>
        </TouchableOpacity>
        <TouchableOpacity style   = { [styles.ragItem, {borderColor: Colors.issue}, rag == RAGs.RED && {backgroundColor: Colors.issue}] }
                          onPress = { () => { reconciler.put(Mutations.UPDATE_STATUS, taskId, ["snapshot/rag", RAGs.RED])}}  >
            <Text style={ [{fontWeight: "bold", color: Colors.issue}, rag == RAGs.RED && {color: "#FFF"}] }>R</Text>
        </TouchableOpacity>
    </View>
)

const ReportHeader = ({title, taskTitle, titleColor, rag, reconciler, taskId}) => (
    <View style = { styles.header }>
        <View style = { styles.headerInfo }>
            <Text style = { styles.date }>{ Moment().format("DD. MMMM") }</Text>
            <Text style = { styles.taskTitle }>{ taskTitle }</Text>
        </View>
        <Text style = { [styles.title, {color: titleColor}] }>{title}</Text>
        <View style = { {position: "absolute", right: 12, top: 18,} }>
            <Text style = { styles.ragTitle }>Gesamtstatus</Text>
            <RAG rag        = { rag }
                 taskId     = { taskId }
                 reconciler = { reconciler } />
        </View>
    </View>
)

const AddButton = ({onPress}) => (
    <TouchableOpacity style   = { styles.addButton }
                      onPress = { onPress }>
        <Text style = { styles.addButtonLabel }>+</Text>
    </TouchableOpacity>
)

const AnimatedIcon = Animated.createAnimatedComponent(Icon)

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

        return <AnimatedIcon style = { {transform: [{rotate: spin}]} } 
                                     name = {this.props.name} 
                                    color = "#FFF" 
                                     size = {20} />
    }
}

const typePrefixes = {
    [ReportType.ACHIEVEMENT]: 1,
    [ReportType.NEXT]: 2,
    [ReportType.RISK]: 3,
    [ReportType.ISSUE]: 4,
    [ReportType.DECISION]: 5,
}

class Reportable extends UI {
   constructor(props) {
       super(props);
       if (d.get(this.props.data, "reportable/isExcluded")) {
           this.state = {fadeValue: new Animated.Value(0.5)};
       } else {
           this.state = {fadeValue: new Animated.Value(1)};
       }

       this.excluderRef = undefined;
   }

   startFade (toValue) { Animated.timing(this.state.fadeValue, { toValue: toValue }).start() }

   handleExclusion () {
       const { data, showExcluded } = this.props;
       const isExcluded = d.get(data, "reportable/isExcluded");
       const itemId = d.get(data, d.DB_ID);

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
       const { data, type, reconciler, order } = this.props
       const title = d.get(data, "reportable/title");
       const isExcluded = d.get(data, "reportable/isExcluded");
       const color = titleColors[type];

       const identifier = typePrefixes[type] + "." + (order.indexOf(d.get(data, d.DB_ID)) + 1);

       const fade = this.state.fadeValue.interpolate({
           inputRange: [0, 1],
           outputRange: [0, 1],
       })

       return (
           <TouchableOpacity
                {...this.props.sortHandlers}
                onPress = { isExcluded && (e => { this.handleExclusion() }) }
                delayLongPress = { 250 }>
               <Animated.View style = { {opacity: this.state.fadeValue} }>
                   <View style = { [styles.editorItem, { backgroundColor: color }] }>
                       <View style={ styles.textWrap }>
                           <Text style = { styles.editorItemLabel }>{identifier + " " + title }</Text>
                       </View>
                       <TouchableOpacity style   = { styles.editorItemHide }
                                         onPress = { (e) => { this.handleExclusion() } }>
                           <AnimatedExcluder name = "remove"
                                             ref  = { ref => { this.excluderRef = ref } }
                                             isExcluded = { isExcluded }/>
                       </TouchableOpacity>
                   </View> 
               </Animated.View>
           </TouchableOpacity>        
       )
   }
}

const titleColors = {
    [ReportType.ACHIEVEMENT]: Colors.achievement,
    [ReportType.NEXT]: Colors.decision,
    [ReportType.RISK]: Colors.risk,
    [ReportType.ISSUE]: Colors.issue,
    [ReportType.DECISION]: Colors.next,
};

const snapshotTypes = {
    [ReportType.ACHIEVEMENT]: "snapshot/achievement",
    [ReportType.NEXT]: "snapshot/decision",
    [ReportType.RISK]: "snapshot/risk",
    [ReportType.ISSUE]: "snapshot/issue",
    [ReportType.DECISION]: "snapshot/next",
};

const Editor = ({type, items, showExcludedReportables, reconciler, isAddingItem, toggleAddItem, taskId, taskOwner, order, newItemPosition}) => {
    let itemMap = {}
    d.each(items, item => {
        itemMap[d.get(item, d.DB_ID)] = item;
    })

    return (
        <View style = { styles.editorContainer }>
            { d.isEmpty(items) && !isAddingItem ? <Text style = { styles.info }>Noch keine Items</Text> :
                <SortableListView style = { { flex: 1 } }
                                   data = { itemMap }
                                  order = { order }
                             onRowMoved = { e => { reconciler.put(Mutations.UPDATE_REPORTABLE_ORDER, e.from, e.to, e.order);} }
                              renderRow = { row => { if (showExcludedReportables || !d.get(row, "reportable/isExcluded")) {
                                                        return <Reportable data = { row }
                                                                          order = { order }
                                                                   showExcluded = { showExcludedReportables }
                                                                          type = { type }
                                                                     reconciler = { reconciler } /> }
                                                    // } else { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); /*@TODO: better place while still guaranteeing first anim */ }
                                            } } />
            }
            { isAddingItem && <AddReportableInReport reconciler    = { reconciler }
                                          taskId        = { taskId }
                                          taskOwner     = { taskOwner }
                                          type          = { type }
                                          toggleAddItem = { toggleAddItem }
                                          newItemPosition  = { newItemPosition } />}

            <View style = { styles.editorFooter }>
                { showExcludedReportables ? 
                      <TouchableOpacity style   = { styles.hiddenItemsButton }
                                        onPress = { () => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                                            reconciler.put(Mutations.HIDE_EXCLUDED_REPORTABLES) } }>
                          <Icon name = "eye" color = { Colors.accent } size = {32} />
                      </TouchableOpacity> 
                  :
                      <TouchableOpacity style   = { styles.hiddenItemsButton }
                                        onPress = { () => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                                            reconciler.put(Mutations.SHOW_EXCLUDED_REPORTABLES) } }>
                          <Icon name = "eye-slash" color = { Colors.accent } size = {32} />
                      </TouchableOpacity> }
            </View>
        </View>
    )
}


const ReportViewMaker = ({task, type, showExcludedReportables, reconciler, isAddingItem, toggleAddItem}) => {
    const titles = {
        [ReportType.ACHIEVEMENT]: "Achievements",
        [ReportType.DECISION]: "Decisions",
        [ReportType.RISK]: "Risks",
        [ReportType.ISSUE]: "Issues",
        [ReportType.NEXT]: "Next Steps",
    };

    const ownerPart = d.getIn(task, ["task/newestSnapshot", 0]);
    const taskOwner = d.getIn(ownerPart, ["snapshot/staff", d.DB_ID]);
    const taskTitle = d.get(ownerPart, "snapshot/title");
    const taskId    = d.get(ownerPart, d.DB_ID);
    const highlevelItems = d.get(ownerPart, snapshotTypes[type]);

    const workerPart = d.get(task, "task/children");
    const lowlevelItems = d.pipeline(workerPart,
                                            tasks => d.map(task => d.getIn(task, ["task/newestSnapshot", 0, snapshotTypes[type]]), tasks),
                                            d.flatten,
                                            tasks => d.filter(d.identity, tasks));

    const overallRag = d.get(ownerPart, "snapshot/rag");

    const allItems = d.concat(highlevelItems, lowlevelItems);

    const shownItems = showExcludedReportables ? allItems : d.filter(item => !d.get(item, "reportable/isExcluded", false), allItems);

    const orderedItems = d.sort((x, y) => d.get(x, "reportable/order") < d.get(y, "reportable/order"), shownItems);
    const order = d.intoArray(d.map(item => d.get(item, d.DB_ID), orderedItems));

    const newItemPosition = d.count(allItems);

    return (
        <View style = { styles.container }>
            <ReportHeader title      = { titles[type] }
                          taskTitle  = { taskTitle }
                          titleColor = { titleColors[type] }
                          rag        = { overallRag }
                          taskId     = { taskId }
                          reconciler = { reconciler } />
            <Editor items                   = { shownItems }
                    type                    = { type }
                    showExcludedReportables = { showExcludedReportables }
                    isAddingItem            = { isAddingItem }
                    toggleAddItem           = { toggleAddItem }
                    reconciler              = { reconciler }
                    taskId                  = { taskId }
                    taskOwner               = { taskOwner }
                    order                   = { order }
                    newItemPosition         = { newItemPosition }/>
            <AddButton onPress = { toggleAddItem }/>
        </View>
    )
}


const query = `[ { (read "task/newestSnapshot") [ :db/id
                                                  "snapshot/title"
                                                  "snapshot/rag"
                                                  "snapshot/staff"
                                                  { "snapshot/next" [ "reportable/title"
                                                                      :db/id
                                                                      "reportable/reporter"
                                                                      "reportable/order"
                                                                      "reportable/isExcluded" ] } 
                                                  { "snapshot/decision" [ "reportable/title"
                                                                          :db/id
                                                                          "reportable/reporter"
                                                                          "reportable/order"
                                                                          "reportable/isExcluded" ] }
                                                  { "snapshot/achievement" [ "reportable/title"
                                                                             :db/id
                                                                             "reportable/reporter"
                                                                             "reportable/order"
                                                                             "reportable/isExcluded" ] }
                                                  { "snapshot/risk" [ "reportable/title"
                                                                      :db/id
                                                                      "reportable/reporter"
                                                                      "reportable/order"
                                                                      "reportable/isExcluded" ] }
                                                  { "snapshot/issue" [ "reportable/title"
                                                                       :db/id
                                                                       "reportable/reporter"
                                                                       "reportable/order"
                                                                       "reportable/isExcluded" ] } ] }
                  { "task/children" [ { (read "task/newestSnapshot") [ { "snapshot/next" [ "reportable/title"
                                                                                           :db/id
                                                                                           "reportable/reporter"
                                                                                           "reportable/order"
                                                                                           "reportable/isExcluded" ] } 
                                                                       { "snapshot/decision" [ "reportable/title"
                                                                                               :db/id
                                                                                               "reportable/reporter"
                                                                                               "reportable/order"
                                                                                               "reportable/isExcluded" ] }
                                                                       { "snapshot/achievement" [ "reportable/title"
                                                                                                  :db/id
                                                                                                  "reportable/reporter"
                                                                                                  "reportable/order"
                                                                                                  "reportable/isExcluded" ] }
                                                                       { "snapshot/risk" [ "reportable/title"
                                                                                           :db/id
                                                                                           "reportable/reporter"
                                                                                           "reportable/order"
                                                                                           "reportable/isExcluded" ] }
                                                                       { "snapshot/issue" [ "reportable/title"
                                                                                            :db/id
                                                                                            "reportable/reporter"
                                                                                            "reportable/order"
                                                                                            "reportable/isExcluded" ] } ] } ] } ]`

class AchievementsView extends UI {
    static query ({taskIdent}) {
        return d.vector( d.hashMap( d.vector("db/ident", ":ui"), `[ "ui/showExcludedReportables" ]`), 
                         d.hashMap( taskIdent, query ) )
    }

    constructor (props) {
        super(props)
        this.state = {isAddingItem: false}
    }

    render () {
        return <ReportViewMaker task  = { d.get(this.props.value, this.params.taskIdent) }
                                type  = { ReportType.ACHIEVEMENT }
                                isAddingItem = { this.state.isAddingItem }
                                toggleAddItem = { () => { //LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                                          this.setState({isAddingItem: !this.state.isAddingItem});
                                                        }}
                                showExcludedReportables = { d.getIn(this.props.value, [d.vector("db/ident", ":ui"), "ui/showExcludedReportables"], false) }
                                reconciler = { this.getReconciler() }/>
    }
}


class DecisionsView extends UI {
    static query ({taskIdent}) {
        return d.vector( d.hashMap( d.vector("db/ident", ":ui"), `[ "ui/showExcludedReportables" ]`), 
                         d.hashMap( taskIdent, query ) )
    }

    constructor (props) {
        super(props);
        this.state = {isAddingItem: false};
    }

    render () {
        return <ReportViewMaker task  = { d.get(this.props.value, this.params.taskIdent) }
                                type  = { ReportType.DECISION }
                                isAddingItem = { this.state.isAddingItem }
                                toggleAddItem = { () => { //LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                                          this.setState({isAddingItem: !this.state.isAddingItem});
                                                        }}
                                showExcludedReportables = { d.getIn(this.props.value, [d.vector("db/ident", ":ui"), "ui/showExcludedReportables"], false) }
                                reconciler = { this.getReconciler() }/>
    }
}

class NextView extends UI {
    static query ({taskIdent}) {
        return d.vector( d.hashMap( d.vector("db/ident", ":ui"), `[ "ui/showExcludedReportables" ]`), 
                         d.hashMap( taskIdent, query ) )
    }

    constructor (props) {
        super(props)
        this.state = {isAddingItem: false}
    }

    render () {
        return <ReportViewMaker task  = { d.get(this.props.value, this.params.taskIdent) }
                                type  = { ReportType.NEXT }
                                isAddingItem = { this.state.isAddingItem }
                                toggleAddItem = { () => { //LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                                          this.setState({isAddingItem: !this.state.isAddingItem});
                                                        }}
                                showExcludedReportables = { d.getIn(this.props.value, [d.vector("db/ident", ":ui"), "ui/showExcludedReportables"], false) }
                                reconciler = { this.getReconciler() }/>
    }
}

class RisksView extends UI {
    static query ({taskIdent}) {
        return d.vector( d.hashMap( d.vector("db/ident", ":ui"), `[ "ui/showExcludedReportables" ]`), 
                         d.hashMap( taskIdent, query ) )
    }

    constructor (props) {
        super(props)
        this.state = {isAddingItem: false}
    }

    render () {
        return <ReportViewMaker task  = { d.get(this.props.value, this.params.taskIdent) }
                                type  = { ReportType.RISK }
                                isAddingItem = { this.state.isAddingItem }
                                toggleAddItem = { () => { //LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                                          this.setState({isAddingItem: !this.state.isAddingItem});
                                                        }}
                                showExcludedReportables = { d.getIn(this.props.value, [d.vector("db/ident", ":ui"), "ui/showExcludedReportables"], false) }
                                reconciler = { this.getReconciler() }/>
    }
}

class IssuesView extends UI {
    static query ({taskIdent}) {
        return d.vector( d.hashMap( d.vector("db/ident", ":ui"), `[ "ui/showExcludedReportables" ]`), 
                         d.hashMap( taskIdent, query ) )
    }

    constructor (props) {
        super(props)
        this.state = {isAddingItem: false}
    }

    render () {
        return <ReportViewMaker task  = { d.get(this.props.value, this.params.taskIdent) }
                                type  = { ReportType.ISSUE }
                                isAddingItem = { this.state.isAddingItem }
                                toggleAddItem = { () => { //LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                                          this.setState({isAddingItem: !this.state.isAddingItem});
                                                        }}
                                showExcludedReportables = { d.getIn(this.props.value, [d.vector("db/ident", ":ui"), "ui/showExcludedReportables"], false) }
                                reconciler = { this.getReconciler() }/>
    }
}


const tabBarIcon = (name, color) => options => <Icon name  = {name}
                                                            size  = {28}
                                                            //color = { options.focused ? color : options.tintColor } 
                                                            color = { options.focused ? Colors.accent : options.tintColor }/>

const tabBarLabel = (title, color) => options => <Text style = { [styles.tabBarLabel, {color: options.focused ? Colors.accent : options.tintColor}] }>{title}</Text>

const RouteConfig = {
    Achievements:   { screen: makeScreen(AchievementsView),
                      navigationOptions: { tabBarIcon: tabBarIcon("trophy", Colors.achievement),
                                          tabBarLabel: tabBarLabel("Achievements", Colors.achievement) } },
    Next:           { screen: makeScreen(NextView),
                      navigationOptions: { tabBarIcon: tabBarIcon("chevron-circle-right", Colors.accentNeutral),
                                          tabBarLabel: tabBarLabel("Next Steps", Colors.accentNeutral) } },
    Risks:          { screen: makeScreen(RisksView),
                      navigationOptions: { tabBarIcon: tabBarIcon("exclamation-triangle", Colors.risk),
                                          tabBarLabel: tabBarLabel("Risks", Colors.risk) } },
    Issues:         { screen: makeScreen(IssuesView),
                      navigationOptions: { tabBarIcon: tabBarIcon("exclamation-circle", Colors.issue),
                                          tabBarLabel: tabBarLabel("Issues", Colors.issue) } },
    Decisions:      { screen: makeScreen(DecisionsView),
                      navigationOptions: { tabBarIcon: tabBarIcon("road", Colors.accentNeutral),
                                           tabBarLabel: tabBarLabel("Decisions", Colors.accentNeutral) } },
}

const TabNavigatorConfig = {
    initialRouteName: "Achievements",
    activeTintColor: Colors.accent,
    lazy: true, //Fix for https://github.com/facebook/react-native/issues/1831
    // swipeEnabled: true, //clashes with drag drop
    tabBarOptions: {
        // labelStyle: {fontSize: 14},
    }
}

const ReportNavigator = TabNavigator(RouteConfig, TabNavigatorConfig);

// Swallows controlled navigation state, so ReportNavigator can control itself
export class Report extends React.Component {
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
            <ReportNavigator navigation = { navigationProps } 
                            screenProps = { {reconciler: this.props.screenProps.reconciler} }/>
        )
    }
} 

export default Report;
