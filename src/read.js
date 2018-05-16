'use strict'

import d from '@clockworks/datascript'
import { DEFAULT } from './constants'
import Moment from 'moment'

// Multi-method that describes how to answer queries for application
// state.  All queries involving any logic more complex than a simple
// sorting, grouping or aggregation should be extracted into a read
// operation. This keeps components dumb. Think of read operations as
// computed datascript attributes.
const read = {}

const readFn = (key, db, eid) => read[key](key, db, eid)

// By default reads are pull queries on datascript entities.
// e.g. with key ["db/ident", ":user-data"]: d.pull(db, q,
// ["db/ident", ":user-data"])
read[DEFAULT] = ({db}, key, subQuery) => d.pull(db, subQuery, key, readFn)

const taskIds = (db) =>
  d.map(datom => d.get(datom, 'v'), d.datoms(db, ':avet', 'task/id'))

const currentSnaps = (db) =>
			d.map(datom => d.get(datom, 'v'), d.datoms(db, ':avet', 'task/snapshot'))
  // d.map(task => currentSnapForTaskId(db, task), taskIds(db))

const allSnapsForStaff = (db, staff) =>
  d.q(`[:find [?snap ...]
        :in $ ?staff
        :where [?snap "snapshot/staff" ?staff]]`, db, staff)

const currentSnapsForStaff = (db, staff) =>
			d.intersection(d.set(allSnapsForStaff(db, staff)), d.set(currentSnaps(db)))

// const allSnapsForName = (db, name) =>
//       d.q(`[:find [?snap ...]
//             :in $ ?name
//             :where [?staff "staff/name" ?name]
//                    [?snap "snapshot/staff" ?staff]]`, db, name)

// const wipSnapsForStaff = (db, staff) =>
//       d.q(`[:find [?snap ...]
//             :in $ ?staff
//             :where [?snap "snapshot/staff" ?staff]
//                    [?snap "snapshot/wip" true]]`, db, staff)

// const currentSnapsForName = (db, name) =>
//   d.intersection(d.set(allSnapsForName(db, name)), d.set(currentSnaps(db)))

// const currentWipSnapsForStaff = (db, staff) =>
//   d.intersection(d.set(wipSnapsForStaff(db, staff)), d.set(currentSnaps(db)))

// const taskForSnapId = (db, snapId) =>
//       d.q(`[:find ?task .
//             :in $ ?snapId
//             :where [?task "task/snapshot" ?snapId]]`, db, snapId)

read['user/currentSnaps'] = (key, db, eid) => {
  const before = Date.now()
  const staff = d.getIn(d.entity(db, eid), ['user/staff', d.DB_ID])
  const snapIds = currentSnapsForStaff(db, staff)
  console.log(`took ${Date.now() - before} ms`)

  return d.into(d.vector(), snapIds)
}

read['user/isStatusComplete'] = (key, db, eid) => {
  const currentSnaps = d.pull_many(db, `[ "snapshot/rag" { "snapshot/start" [ "date/timestamp" ] } ]`, read['user/currentSnaps'](key, db, eid))
  const wipSnaps = d.filter(snap => d.getIn(snap, ['snapshot/start', 'date/timestamp']) < Moment().format('x'), currentSnaps)
  const ragSnaps = d.filter(snap => d.get(snap, 'snapshot/rag', false), wipSnaps)

  return d.equals(d.count(wipSnaps), d.count(ragSnaps))
}

read['task/newestSnapshot'] = (key, db, eid) => {
  const snaps = d.q(`[:find ?time ?snap
                      :in $ ?task
                      :where [?task "task/snapshot" ?snap]
                             [?snap "snapshot/date" ?date]
                             [?date "date/timestamp" ?time]]`, db, task)

  return d.vector(d.second(d.first(d.sortBy(d.first, (a, b) => (b - a), snaps))))
}

export default read
