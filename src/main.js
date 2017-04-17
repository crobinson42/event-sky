// todo: add changelog before publish
// todo: verify a correct singleton pattern
// todo: in the case of React, we need to ensure handlers are removed if they don't exist, ie: cdunm
// todo: look into cancellable handlers?
// todo: write readme on how restrictToExpected helps predictability in teams and large apps, guide on file architecture

import 'babel-polyfill'
import utils from './utils'
import config from './config'

class EventSky {
	constructor () {
		this.config = {
			restrictToExpected: false,
			firehose: false,
		}

		this._config = config
		this._utils = utils

		// map of events
		this.events = {}
		this._firehose = msg => this.config.firehose ? console.log(`EventSky Firehose >> ${msg}`) : null

		// setup 'when' event handlers
		this.on = this._utils.curryWhenHandler.bind(this)('on')
		this.once = this._utils.curryWhenHandler.bind(this)('once')
		this.beforeAll = this._utils.curryWhenHandler.bind(this)('beforeAll')
		this.afterAll = this._utils.curryWhenHandler.bind(this)('afterAll')

		// extend a chain call for eventSky.off.all()
		this.off.all = this.allOff.bind(this)
	}

	/**
	 * Remove a handler for an event, the first parameter can be and event name
	 * or an eventId to be removed.
	 * @param eventOrId
	 * @param handler
	 * @returns {EventSky}
	 */
	off (eventOrId, handler) {
		// iterate all events by names
		Object.keys(this.events).forEach(_eventName => {
			// iterate each 'when' event lifecycle and look for eventId or handler to remove
			Object.keys(this.events[_eventName]).forEach(_eventWhen => {
				if (!['beforeAll', 'on', 'once', 'afterAll'].includes(_eventWhen)) return

				// iterate each event of the current 'when' for event
				Object.keys(this.events[_eventName][_eventWhen]).forEach(_eventId => {
					const eventNameAndHandlerMatch = (
							this.events[_eventName][_eventWhen][_eventId] === handler &&
							_eventName === eventOrId
						)
					const eventIdMatch = (!handler && _eventId === eventOrId)

					const performDelete = (
							eventNameAndHandlerMatch ||
							eventIdMatch
						)

					if (performDelete) {
						delete this.events[_eventName][_eventWhen][_eventId]
						this.events[_eventName].handlers--
					}
				})
			})
		})

		return this
	}

	/**
	 * Turn off all handlers for an event name
	 * @param eventName {string} the name of the event
	 * @returns {EventSky}
	 */
	allOff (eventName) {
		delete this.events[eventName]

		this.events[eventName] = this._utils.createNewEventMap()

		return this
	}

	trigger (event, data) {
		if (this.config.restrictToExpected) {
			if (!Object.keys(this.events).includes(event)) {
				this._firehose(`"${event}" triggered and is not an expected event "restrictToExpected = true"`)

				return this
			}
		} else if (!this.events[event]) {
			this._firehose(`"${event}" triggered with no handlers setup`)

			return this
		}

		this._firehose(`"${event}" triggered`)

		// beforeAll
		const beforeAll = this.events[event].beforeAll
		try {
			Object.keys(beforeAll).forEach(key => beforeAll[key](data))
		} catch (e) {
			console.error(`EventSky error: ${event} beforeAll handler errored`, { error: e, data: data })
		}

		// on
		const on = this.events[event].on
		try {
			Object.keys(on).forEach(key => on[key](data))
		} catch (e) {
			console.error(`EventSky error: ${event} on handler errored`, { error: e, data: data })
		}

		// once
		const once = this.events[event].once
		try {
			Object.keys(once).forEach(key => {
				once[key](data)
				// remove handler
				this.off(event, once[key](data))
			})
		} catch (e) {
			console.error(`EventSky error: ${event} once handler errored`, { error: e, data: data })
		}

		// afterAll
		const afterAll = this.events[event].afterAll
		try {
			Object.keys(afterAll).forEach(key => afterAll[key](data))
		} catch (e) {
			console.error(`EventSky error: ${event} afterAll handler errored`, { error: e, data: data })
		}

		return this
	}
}

export default new EventSky()
