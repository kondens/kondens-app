// @flow
"use strict"

import React    from "react";

import { RouteDefinitions } from "./route";

export const makeScreen = (Component) => {
    return class extends React.Component {
        render () {
            const { navigation, screenProps } = this.props
            const route = navigation.state
            const { reconciler } = screenProps

            const viewProps = Object.assign({}, screenProps, RouteDefinitions[route.routeName].props, {
                value:      reconciler.readComponent(Component, route.params),
                params:     route.params,
                isActive:   true,
            })

            return <Component navigation = { navigation }
                              {...viewProps} />
        }
    }
}

export default makeScreen
