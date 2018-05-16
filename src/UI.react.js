// @flow
"use strict"

import d        from "@clockworks/datascript"
import React    from "react"

import type { IReconcilable } from "./db"
import type { Query } from "./reconciler"


/**
 * Base class for UI components.
 * Implements the IReconcilable interface.
 */
export class UI extends React.Component {
    // Gets all required state for this component from a database value
    static query (params?: Object, ...rest: Array<void>): Query { 
        return d.vector() 
    }
    
    // Returns this components reconciler
    getReconciler (): IReconcilable { 
        return this.props.reconciler 
    }

    get db () {
        return d.db(this.getReconciler().conn)
    }

    // Returns the query result that the instance is being rendered with
    get value () {
        return this.props.value
    }

    nextValue (nextProps) {
        return nextProps.value
    }

    // Returns the query parameters that the instance is being rendered with
    get params () {
        return this.props.params
    }

    trace () {
        console.log(`Rendering ${this.constructor.name} with value:`)
        console.log(d.toJs(this.value))
    }

    shouldComponentUpdate (nextProps, nextState) {
        return true
        // const isActive = (nextProps.isActive === false) ? false : true
        // return isActive
    }
}

export class PureUI extends UI {
    shouldComponentUpdate (nextProps, nextState) {
      return !d.equals(this.value, this.nextValue(nextProps))
    }
}

export default UI
