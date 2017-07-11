"use strict";

import d                from "@clockworks/datascript";
import React            from "react";
import { View,
         TouchableOpacity,
         Text }         from "react-native";

import { UI }           from "../UI.react";
import { Mutations }    from "../constants"


class Status extends UI {
    static query () {
        return d.vector(d.hashMap())
    }

    render () {
        const text = d.q(`[:find ?text . :where [42 ":text" ?text]]`, this.db)
        return (
            <View>
                <Text>MEHRERE TEXTES</Text>
                <Text>{ text }</Text>
                <TouchableOpacity onPress = { e => this.getReconciler().put(Mutations.SUBMIT_STATUS, "nice, nichma namespaced") }>
                    <Text>KLICKMICH</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default Status;