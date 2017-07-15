"use strict";

import d                from "@clockworks/datascript";
import React            from "react";
import { StyleSheet, 
         AppState,
         Text,
         ActivityIndicator, 
         View } from "react-native";
import { addNavigationHelpers } from "react-navigation";

import { schema,
         initialState } from "./src/db";
import { UI }           from "./src/UI.react";
import { Navigator,
         RouteDefinitions } from "./src/route";
import { Reconciler }   from "./src/reconciler";
import read             from "./src/read";
import mutate           from "./src/mutate";
import { Routes,
         Colors,
         Mutations }       from "./src/constants";

import { dummyData }    from "./src/dummyData";

import "moment/locale/de";
import Moment           from "moment";


export default class App extends UI {
    static query () {
        return d.vector(d.hashMap(
            d.vector("db/ident", ":ui"),
            `[ "ui/navigationState" ]`
        ))
    }

    constructor (props) {
        super(props)
        
        this.state = { loading: false }

        this.reconciler = new Reconciler(d.create_conn(schema), read, mutate)

        global.d = d
        global.reconciler = this.reconciler

        Moment.locale("de");
        
        console.log("Loading initial state...")
        d.reset_conn(this.reconciler.conn, initialState())

        // Use this to change defaults during testing and development
        d.transact(this.reconciler.conn, dummyData)
    }

    componentWillMount () {
        // Handle Memory Warnings
        // AppState.addEventListener('memoryWarning', this.onMemoryWarning);

        // // Handle App State Transitions
        AppState.addEventListener('change', this.onAppStateChange)

        // // Handle the Back Button on Android
        // if (Platform.OS === "android") {
        //     BackAndroid.addEventListener('hardwareBackPress', this.onBackButton)
        // }

        // // willX listener only work on iOS
        // if (Platform.OS === "ios") {
        //     this.keyboardShowListener = Keyboard.addListener("keyboardWillShow", this.onKeyboardShow)
        //     this.keyboardHideListener = Keyboard.addListener("keyboardWillHide", this.onKeyboardHide)
        // } else {
        //     this.keyboardShowListener = Keyboard.addListener("keyboardDidShow", this.onKeyboardShow)
        //     this.keyboardHideListener = Keyboard.addListener("keyboardDidHide", this.onKeyboardHide)
        // }
    }

    componentDidMount () {
        this.reconciler.addRoot(this)
    }

    componentWillUnmount() {
        this.reconciler.removeRoot(this)

        // AppState.removeEventListener('memoryWarning', this.onMemoryWarning)

        // AppState.removeEventListener('change', this.onAppStateChange)

        // if (Platform.OS === "android") {
        //     BackAndroid.removeEventListener('hardwareBackPress', this.onBackButton)
        // }

        // this.keyboardShowListener.remove()
        // this.keyboardHideListener.remove()
    }

    onAppStateChange = (currentState) => {
        if (currentState == "background") {
            // this.reconciler.put(SystemActions.ENTER_BACKGROUND, {})
        } else if (currentState == "active") {
            // this.reconciler.put(SystemActions.ENTER_FOREGROUND, {})
            this.reconciler.put(Mutations.CREATE_STATUS)
        }
    }

    // We have to memoize the navigation state js object,
    // because otherwise the Navigator will re-render on any state change
    navigationStateToJs = (navigationState) => {
        if (this._navStateCache === undefined || !d.equals(this._lastNavState, navigationState)) {
            this._navStateCache = d.toJs(navigationState)
        }   

        this._lastNavState = navigationState
        
        return this._navStateCache
    }

    render () {
        const ident = d.vector("db/ident", ":ui")
        const value = this.reconciler.readComponent(App)
        const navigationState = d.getIn(value, [ident, "ui/navigationState"])

        if (this.state.loading) {
            return (
                <View style={ styles.splash }>
                    <ActivityIndicator />
                </View>
            )
        } else {
            const navigationProps = addNavigationHelpers({
                dispatch: (action) => this.reconciler.put(Mutations.NAVIGATION_DISPATCH, action),
                state: this.navigationStateToJs(navigationState),
            })

            // This gets passed to _every_ screen
            const screenProps = { reconciler: this.reconciler }

            return (
                <View style={ styles.container }>
                    <Navigator navigation = { navigationProps }
                              screenProps = { screenProps } />
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    splash: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
});
