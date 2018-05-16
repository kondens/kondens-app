'use strict'

import d from '@clockworks/datascript'
import React from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  ScrollView
} from 'react-native'
import { UI, PureUI } from '../UI.react'
import {
  Mutations,
  Colors,
  Fonts,
  RAGs,
  RagColor,
  ReportType,
  Routes
} from '../constants'
import Moment from 'moment'
import Icon from 'react-native-vector-icons/FontAwesome'
import Ripple from '../components/Ripple'
import ActionButton from 'react-native-action-button'
import { AddReportableInStatus } from '../components/AddReportable'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.background
  },
  listContainer: {flex: 1},
  header: {
    flexDirection: 'row',
    paddingTop: 18,
    paddingHorizontal: 12,
    paddingBottom: 12
  },
  body: {
    flex: 1
  },
  name: {
    fontSize: Fonts.h3Size,
    color: Colors.body
  },
  date: {
    fontSize: Fonts.h3Size,
    fontWeight: 'bold',
    color: Colors.accent,
    marginRight: 6
  },
  footer: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
    // borderTopWidth: 1,
    // borderTopColor: Colors.accent,
  },
  submitButton: {
    // backgroundColor: Colors.accentNeutral,
    // margin: 12,
    // borderRadius: 100,
    // paddingVertical: 6,
    // paddingHorizontal: 12,
    // width: 80,
    // height: 36,
    // alignItems: "center",
    // justifyContent: "center",
  },
  submitText: {
    color: Colors.accent,
    fontSize: Fonts.bodySize,
    margin: 12
  },

  ragLabel: {
    letterSpacing: 1,
    fontSize: Fonts.bodySize,
    fontWeight: 'bold'
  }
})

const taskStyles = StyleSheet.create({
  shadowContainer: {
    marginVertical: 6,
    marginHorizontal: 12,
    shadowOpacity: (Platform.OS === 'ios') ? 0.18 : 0,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 0
    }
  },
  container: {
    flexDirection: 'column',
    padding: 12
  },
  title: {
    fontSize: Fonts.bodySize,
    fontWeight: '500', // Fonts.h2Weight,
    color: Colors.primaryText,
    marginBottom: 6
  }
})

const progressBarStyles = StyleSheet.create({
  container: {
    flexDirection: 'column'
  },
  barContainer: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 50
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 25,
    height: 6,
    // paddingHorizontal: 14,
    // borderRadius: 50,
    overflow: 'hidden'
  },
  left: {
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: Colors.accentNeutral
  },
  progress: {
    // borderTopWidth: 2,
    flex: 1,
    height: 2,
    backgroundColor: Colors.accentNeutral
  },
  labelContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent'
    // marginHorizontal: 6,
  },
  beforeBegin: {
    color: Colors.body,
    fontSize: Fonts.bodySize
  },
  label: {
    flex: 1,
    color: Colors.body,
    fontSize: Fonts.bodySize
  },
  start: {
    textAlign: 'left'
  },
  end: {
    textAlign: 'right'
  },
  remaining: {
    textAlign: 'center'
  }
})

const ragStyles = StyleSheet.create({
  container: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 6,
    flex: 1,
    // width: 80,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonLabel: {
    color: '#FFF',
    fontSize: Fonts.bodySize
  },
  invertedButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderColor: '#FFF'
  }
})

export class Submit extends PureUI {
  static query () {
    return d.vector(
      d.hashMap(
        d.vector('db/ident', ':user-data'), `[ (read "user/isStatusComplete") ]`
      ))
  }

  render () {
    const { value } = this.props
    const uiIndent = d.vector('db/ident', ':user-data')
    const isEnabled = d.getIn(value, [uiIndent, 'user/isStatusComplete'], false)

    return (
      <TouchableOpacity
	disabled={!isEnabled}
        style={isEnabled && styles.submitButton}
        onPress={e => {
          this.getReconciler().put(Mutations.NAVIGATION_DISPATCH, {
            routeName: Routes.REPORT,
            params: {taskIdent: d.vector('task/id', 10)}
          })
        }}>
        <Text style={[styles.submitText, !isEnabled && {color: Colors.disabled}]}>Fertig</Text>
      </TouchableOpacity>
    )
  }
}

// const addSnap = (reconciler) => {
//   const snap = { date: Moment('2017-08-11').format('x'),
//     start: Moment('2017-07-21').format('x'),
//     end: Moment('2017-07-30').format('x'),
//     wip: true,
//     title: 'Creational Snap',
//     rag: RAGs.GREEN
//     // @TODO: further attributes
//   }

//   reconciler.put(Mutations.ADD_SNAP, 1, 3, snap)
// }

const ActionBtn = ({reconciler}) => (
  <ActionButton buttonColor={Colors.accent} title='Weitere Achievements' bgColor='rgba(0,0,0,0.3)' degrees={135}>
    <ActionButton.Item textStyle={{color: Colors.body, fontSize: Fonts.bodySize}}
      buttonColor={Colors.achievement}
      onPress={e => { reconciler.put(Mutations.ADD_REPORTABLE, ReportType.ACHIEVEMENT) }}>
      <Icon color='#FFF' name='trophy' size={20} />
    </ActionButton.Item>
    <ActionButton.Item textStyle={{color: Colors.body, fontSize: Fonts.bodySize}}
      buttonColor={Colors.risk}
      title='Weitere Risks'
      onPress={e => { reconciler.put(Mutations.ADD_REPORTABLE, ReportType.RISK) }}>
      <Icon color='#FFF' name='exclamation-circle' size={20} />
    </ActionButton.Item>
    <ActionButton.Item textStyle={{color: Colors.body, fontSize: Fonts.bodySize}}
      buttonColor={Colors.issue}
      title='Weitere Issues'
      onPress={e => { reconciler.put(Mutations.ADD_REPORTABLE, ReportType.ISSUE) }}>
      <Icon color='#FFF' name='exclamation-triangle' size={20} />
    </ActionButton.Item>
  </ActionButton>
)

const ProgressBar = ({start, end, at, isLight}) => {
  let progress = 0
  if (at > start) {
    progress = (at - start) / (end - start)
  }

  if (progress > 0) {
    return (
      <View style={progressBarStyles.container}>
        <View style={progressBarStyles.labelContainer}>
          <Text style={[progressBarStyles.label, progressBarStyles.start, isLight && {color: '#FFF'}]}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            { Moment(start, 'x').format('DD. MMM') } bis { Moment(end, 'x').format('DD. MMM') } ({ Moment(end, 'x').fromNow() })
          </Text>
          {/* <Text style={ [progressBarStyles.label, progressBarStyles.start] }>
                  { Moment(start, "x").format("DD.MM.YY") }
                  </Text>
                  <Text style={ [progressBarStyles.label, progressBarStyles.remaining] }>
                      ({ Moment(end, "x").fromNow() })
                      </Text>
                      <Text style={ [progressBarStyles.label, progressBarStyles.end] }>
                          { Moment(end, "x").format("DD.MM.YY") }
                      </Text> */}
        </View>
        <View style={progressBarStyles.barContainer}>
          <View style={[ progressBarStyles.bar,
            progressBarStyles.left,
            isLight && { borderColor: '#FFFFFF' },
            { flex: progress } ]}>
            { <View style={[ progressBarStyles.progress, isLight && { backgroundColor: '#FFFFFF' } ]} /> }
          </View>
          { (at < end) && <View style={[progressBarStyles.bar, {flex: 1 - progress}]} /> }
        </View>
      </View>
    )
  } else {
    return (
      <View style={progressBarStyles.container}>
        <Text style={[ progressBarStyles.beforeBegin, isLight && {color: '#FFF'} ]}>
          Task beginnt am { Moment(start, 'x').format('DD.MM.YY') } ({ Moment(start, 'x').fromNow() })
        </Text>
      </View>
    )
  }
}

class RAG extends React.PureComponent {
  render () {
    const {onRagSelect, onRagReset, reconciler, rag} = this.props

    if (!rag) {
      return (
        <View style={ragStyles.container}>
          <TouchableOpacity style={ragStyles.button}
            onPress={e => onRagSelect(RAGs.GREEN)}>
            <Text style={[styles.ragLabel, {color: Colors.achievement}]}>{RAGs.GREEN}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ragStyles.button}
            onPress={e => onRagSelect(RAGs.AMBER)}>
            <Text style={[styles.ragLabel, {color: '#FFC107'}]}>{RAGs.AMBER}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ragStyles.button}
            onPress={e => onRagSelect(RAGs.RED)}>
            <Text style={[styles.ragLabel, {color: Colors.issue}]}>{RAGs.RED}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ragStyles.button}
            onPress={e => onRagSelect(RAGs.DONE)}>
            <Text style={[styles.ragLabel, {color: '#CCC'}]}>{RAGs.DONE}</Text>
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <View style={ragStyles.container}>
          <TouchableOpacity style={[ragStyles.button]}
            onPress={e => onRagReset()}>
            <Text style={[styles.ragLabel, {color: '#FFF'}]}>RESET</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ragStyles.button}
            onPress={e => { reconciler.put(Mutations.ADD_REPORTABLE, ReportType.RISK) }}>
            <Text style={[styles.ragLabel, {color: '#FFF'}]}>RISK?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ragStyles.button}
            onPress={e => { reconciler.put(Mutations.ADD_REPORTABLE, ReportType.ISSUE) }}>
            <Text style={[styles.ragLabel, {color: '#FFF'}]}>ISSUE?</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }
}

class Task extends PureUI {
  constructor (props) {
    super(props)

    this.onRagSelect = this._onRagSelect.bind(this)
    this.onRagReset = this._onRagReset.bind(this)
    this.onBackgroundColorChange = this._onBackgroundColorChange.bind(this)

    this.state = {
      backgroundColor: RagColor[d.get(props.value, 'snapshot/rag', false)]
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (this.state.backgroundColor !== nextState.backgroundColor) || super.shouldComponentUpdate(nextProps, nextState)
  }

  _onRagSelect (rag) {
    const snapId = d.get(this.props.value, d.DB_ID)
    this.getReconciler().put(Mutations.UPDATE_STATUS, snapId, ['snapshot/rag', rag])
  }

  _onRagReset () {
    const snapId = d.get(this.props.value, d.DB_ID)
    this.getReconciler().put(Mutations.RESET_STATUS, snapId, 'snapshot/rag')
  }

  _onBackgroundColorChange (color) {
    this.setState({backgroundColor: color})
  }

  render () {
    const { backgroundColor } = this.state

    const snap = this.props.value
    const rag = d.get(snap, 'snapshot/rag', false)
    const snapId = d.get(snap, d.DB_ID)
    const title = d.get(snap, 'snapshot/title')
    const start = d.getIn(snap, ['snapshot/start', 'date/timestamp'])
    const end = d.getIn(snap, ['snapshot/end', 'date/timestamp'])

    const showRag = start < Moment().format('x')

    return (
      <Ripple
        style={taskStyles.shadowContainer}
        color={RagColor[rag]}
        rippleOpacity={1.0}
        rippleDuration={300}
        onColor={this.onBackgroundColorChange}>
        <View style={[taskStyles.container, {backgroundColor: backgroundColor || '#FFFFFF'}]}>
          <Text style={[taskStyles.title, backgroundColor && {color: Colors.inverseText}]}>{ title }</Text>
          <ProgressBar start={start} end={end} at={Moment().format('x')} isLight={backgroundColor} />
          { showRag &&
            <RAG
		reconciler={this.getReconciler()}
		snapId={snapId}
		rag={rag}
		onRagSelect={this.onRagSelect}
	      onRagReset={this.onRagReset} /> }
        </View>
      </Ripple>
    )
  }
}

export class Status extends PureUI {
  static query () {
    return d.vector(
      d.hashMap(d.vector('db/ident', ':ui'), `[ "ui/addingReportable" ]`),
      d.hashMap(
        d.vector('db/ident', ':user-data'),
        `[ {"user/staff" [ "staff/name" :db/id ]}
           {(read "user/currentSnaps") [ :db/id
                                         "snapshot/title"
                                         "snapshot/rag"
                                         { "snapshot/start" [ "date/timestamp" ] }
                                         { "snapshot/end" [ "date/timestamp" ] } ] } ]`))
  }

  constructor (props) {
    super(props)
    this.keyExtractor = this._keyExtractor.bind(this)
    this.renderItem = this._renderItem.bind(this)
  }

  _keyExtractor (item) {
    return '' + d.get(item, d.DB_ID)
  }

  _renderItem ({item}) {
    return (
      <Task
        key={d.get(item, d.DB_ID)}
        value={item}
        reconciler={this.getReconciler()} />
    )
  }

  render () {
    const { value } = this.props

    const addingReportable = d.getIn(value, [d.vector('db/ident', ':ui'), 'ui/addingReportable'])
    const userIdent = d.vector('db/ident', ':user-data')
    const name = d.getIn(value, [userIdent, 'user/staff', 'staff/name'])
    const snaps = d.getIn(value, [userIdent, 'user/currentSnaps'])
    const wipSnaps = d.filter(task => (d.get(task, 'snapshot/rag') !== RAGs.DONE), snaps)

    return (
      <View style={styles.container}>
        <View style={styles.listContainer}>
          <View style={styles.header}>
            <Text style={styles.date}>{ Moment().format('DD. MMMM') }</Text>
            <Text style={styles.name}>{name}</Text>
          </View>
	  <FlatList
	    data={d.intoArray(wipSnaps)}
	    keyExtractor={this.keyExtractor}
	    renderItem={this.renderItem} />
        </View>
        <ActionBtn reconciler={this.getReconciler()} />
        { addingReportable &&
          <AddReportableInStatus type={addingReportable} reconciler={this.getReconciler()} /> }
      </View>
    )
  }
}

export default Status
