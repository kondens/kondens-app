/**
 * @flow
 */
"use strict";

import React                from "react"

import { StackNavigator }   from "react-navigation";

import { makeScreen }       from "./makeScreen";
import { Routes,
         STR,
         Colors }           from "./constants";

import { Status,
         Submit }           from "./views/Status.react";


export const RouteDefinitions = {
    [Routes.STATUS]: {
        screen: makeScreen(Status),
        navigationOptions: ({navigation, screenProps}) => {
            return ({ 
                title: STR.VIEW.STATUS.TITLE,
                headerRight: React.createElement(makeScreen(Submit), {navigation: navigation, screenProps: screenProps}),
            })}
    }
};

export const Navigator = StackNavigator(RouteDefinitions, {
    navigationOptions: {
        headerStyle: { backgroundColor: Colors.headerBackground },
        headerTintColor: Colors.headerTint,
    }
});
