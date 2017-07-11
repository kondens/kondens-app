// @flow
"use strict"

import d                        from "@clockworks/datascript"
import React                    from "react"
import { InteractionManager }   from "react-native"

import { DEFAULT }              from "./constants"


// Returns a components query expression.
export const getQuery = (cmp, params: Object) => {
    if (cmp.hasOwnProperty("query")) {
        return cmp.query(params)
    } else {
        return d.vector()
    }
}

/**
 * A reconciler ties all the parts of the apps architecture together into a unidirectional dataflow:
 * the read and mutate functions, the datascript connection and the component hierarchy.
 * It also provides some tools to ease working with a unidirectional dataflow, such
 * as the in-memory blob and ref stores.
 *
 * The ref store is used, in order to avoid components deep down in the hierarchy having
 * to pass their references back up to their ancestors, thus breaking unidirectional dataflow.
 * Instead, lower-level components (e.g. a TextInput) may register their reference via *storeRef* under 
 * a globally-unique identifier (e.g. "user/name") that can then be accessed via *retrieveRef* by higher-level components.
 *
 * The blob store is used, in order to avoid huge mutation payloads (e.g. on COURSE_RECV). Instead,
 * such large payloads may be stored in-memory under a globally unique identifier, using *storeBlob*
 * and later accessed via *retrieveBlob*. The identifier can easily be passed around inside the payload.
 *
 * A reconciler will listen for state changes on the datascript connection, run component
 * queries against the new database value and trigger the re-rendering of the UI.
 *
 * A reconciler also provides the dispatch mechanism for new mutations.
 *
 * Component hierarchies rendered under different reconcilers are guaranteed to be
 * fully isolated from each other.
 */
export class Reconciler {

    constructor (conn, read, mutate) {
        this.roots      = d.set()
        this.read       = read
        this.mutate     = mutate
        this.conn       = conn
        this.blobStore  = d.hashMap()
        this.refStore   = d.hashMap()

        this._isDispatching = false

        this.startListening()
    }

    // Sets up the listener for state changes
    startListening () {
        // [EXPERIMENTAL] In order to not interfere with reacts animations, we reconcile only after them.
        this._listener = d.listen(this.conn, () => InteractionManager.runAfterInteractions(() => this.reconcile()))
        // this._listener = d.listen(this.conn, () => this.reconcile())
    }

    stopListening () {
        d.unlisten(this.conn, this._listener)
        this._listener = undefined
    }

    // Conform to a uniform "target" interface for transact().
    getReconciler (): IReconcilable { return this }

    // Add a root component for the reconciler to control.
    addRoot (rootComponent: IReconcilable & React.Component) {
        this.roots = d.conj(this.roots, rootComponent)
        this.reconcile()
    }

    // Remove a root component from the reconcilers control.
    removeRoot (rootComponent: IReconcilable & React.Component) {
        this.roots = d.disj(this.roots, rootComponent)
    }

    clearRoots () {
        this.roots = d.set()
    }

    // Computes the result of a components query against the current value of the database
    readComponent (cmp, params?: Object) {
        const env = { db: d.db(this.conn) }

        // Performs a single, top-level read operation against the current value of the database
        const readKey = (result, key, subQuery) => {
            try {
                const op = this.read.hasOwnProperty(key) ? key : DEFAULT
                
                return d.updateIn(result, [key], v => {
                    const result = this.read[op](env, key, subQuery)
                    
                    if (d.isAssociative(result)) {
                        return d.merge(v, result)
                    } else {
                        return result
                    }
                })
            } catch (err) {
                console.log(err)
                return result
            }
        }

        // A query is a map containing associating read operations with sub-queries
        const readQuery = (value, query) => d.reduceKV(readKey, value, query)

        // A component query is a vector containing lower-level queries
        return d.reduce(readQuery, d.hashMap(), getQuery(cmp, params))
    }

    storeBlob (key, blob) {
        // const hash = d.hash(d.write_transit_str(blob))
        this.blobStore = d.assoc(this.blobStore, key, blob)
        return key
    }

    // Retrieves a large value from the in-memory store and removes it from there.
    retrieveBlob (key) {
        const blob = d.get(this.blobStore, key)
        this.blobStore = d.dissoc(this.blobStore, key)
        return blob
    }

    storeRef (key, ref) {
        this.refStore = d.assoc(this.refStore, key, ref)
        return key
    }

    retrieveRef (key) {
        return d.get(this.refStore, key)
    }

    removeRef (key) {
        this.refStore = d.dissoc(this.refStore, key)
    }

    // Applies the specified mutation or enqueues it on the js event loop.
    put (mutationId, payload) {
        // @TODO This implementation should be replaced with a proper event log.
        // That would make it easy to observe, replay and extend mutations.

        if (this._isDispatching == true) {
            setImmediate(() => this.put(mutationId, payload))
        } else {
            this._isDispatching = true
            if (mutationId in this.mutate) {
                const beforeMutation = Date.now()
                console.log(`[${beforeMutation}] ${mutationId} with payload `, payload)
                
                this.mutate[mutationId](this, payload)
                
                const afterMutation = Date.now()
                const delta = Math.abs(afterMutation - beforeMutation)
                console.log(`[${afterMutation}] - ${delta} milliseconds elapsed`)
            } else {
                console.warn(`Unsupported mutation ${mutationId}`)
            }
            this._isDispatching = false
        }
    }
    
    // Forces the registered component hierarchies to re-read their state and 
    // potentially re-render, if said state has changed.
    reconcile () {
        d.each(this.roots, (rootComponent: React.Component) => rootComponent.forceUpdate())
    }
}
