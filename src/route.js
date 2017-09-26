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

import  Report              from "./views/Report.react";


const stackRouteDefinitions = {
    [Routes.STATUS]: {
        screen: makeScreen(Status),
        navigationOptions: ({navigation, screenProps}) => {
            return ({ 
                title: STR.VIEW.STATUS.TITLE,
                headerRight: React.createElement(makeScreen(Submit), {navigation: navigation, screenProps: screenProps}),
            })}
    },
    [Routes.REPORT]: {
        screen: Report,
        navigationOptions: ({navigation, screenProps}) => {
            return ({ 
                title: STR.VIEW.REPORT.TITLE,
                //headerRight: React.createElement(makeScreen(Submit), {navigation: navigation, screenProps: screenProps}),
            })}
    },
};

// const modalRouteDefinitions = {
//     [Routes.ADD_REPORTABLE]: {
//         screen: makeScreen(AddReportable),
//         navigationOptions: ({navigation, screenProps}) => {
//             return ({ 
//                 title: STR.VIEW.ADD_REPORTABLE.TITLE,
//                 headerRight: React.createElement(makeScreen(Submit), {navigation: navigation, screenProps: screenProps}),
//             })}
//     },
// }

//Currently, the only way to display modals on a per-screen basis is to nest a StackNavigator within a Modal
//Perhaps this will be solved by react-navigation 1.0
// const StackModalNavigator = (stackRouteDefinitions, modalRouteDefinitions, stackNavOptions) => {
//     const CardStackNavigator = StackNavigator(stackRouteDefinitions, stackNavOptions);

//     const ModalStackNavigator = StackNavigator({
//         stack: { screen: CardStackNavigator },
//         ...modalRouteDefinitions,
//     }, {
//         mode: "modal",
//         headerMode: "none",
//     });

//     //CHANGE THIS!!
//     return CardStackNavigator;
// };

export const Navigator = StackNavigator(stackRouteDefinitions, {
    navigationOptions: {
        headerStyle: { backgroundColor: Colors.headerBackground },
        headerTintColor: Colors.accent,
    },
});

