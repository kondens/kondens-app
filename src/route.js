/**
 * @flow
 */
"use strict";

import { StackNavigator }   from "react-navigation";

import { makeScreen }       from "./makeScreen";
import { Routes,
         STR,
         Colors }           from "./constants";

import Status               from "./views/Status.react";


export const RouteDefinitions = {
    [Routes.STATUS]: {
        screen: makeScreen(Status),
        navigationOptions: { title: STR.VIEW.STATUS.TITLE },
    }
};

export const Navigator = StackNavigator(RouteDefinitions, {
    navigationOptions: {
        headerStyle: { backgroundColor: Colors.headerBackground },
        headerTintColor: Colors.headerTint,
    }
});