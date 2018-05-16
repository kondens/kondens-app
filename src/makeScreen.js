'use strict'

import React from 'react'
import { RouteDefinitions } from './route'

export const makeScreen = (Component) => {
  return class extends React.Component {
    render () {
      const { navigation, screenProps } = this.props
      const route = navigation.state
      const { reconciler } = screenProps

      const before = Date.now()
      const viewProps = Object.assign({}, screenProps, {
        value: reconciler.readComponent(Component, route.params),
        params: route.params,
        isActive: true
      })
      console.log(`reading component took ${Date.now() - before} ms.`)

      return <Component navigation={navigation} {...viewProps} />
    }
  }
}

export default makeScreen
