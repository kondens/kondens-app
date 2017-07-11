// @flow
"use strict"

import React    from "react"
import { UI }   from "./UI.react"

export const makeScreen = (Component) => {
    return class extends UI {
        static query = Component.query

        render () {
            const { screenProps } = this.props
            return <Component {...screenProps} />
        }
    }
}

export default makeScreen