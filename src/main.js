// todo: add changelog before publish
// todo: verify a correct singleton pattern
// todo: in the case of React, we need to ensure handlers are removed if they don't exist, ie: cdunm
// todo: look into cancellable handlers?
// todo: write readme on how restrictToExpected helps predictability in teams and large apps, guide on file architecture

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

		// util to setup 'when' event handlers
		const _addEventHandler = (when) => {
			return (event, handler) => {
				// verify params
			if (typeof event !== 'string' || event.length < 1 || typeof handler !== 'function') {
					console.warn(`EventSky warning: "${event}" event must be a string and handler must be a function - not set with .${when} handler`)

					return this
				}

				// first check if we're restricting to expected only
				if (this.config.restrictToExpected) {
					if (!Object.keys(this.events).includes(event)) {
						this._firehose(`"${event}" handler cannot be set because it is not an expected event "restrictToExpected = true"`)

						return this
					}
				}

				// ensure the event exists and is setup on the event store
				if (!this.events[event]) {
					this.events[event] = this._utils.createNewEventMap()
				}

				this.events[event].handlers++
				const _handlerCount = this.events[event]._handlers++
				const eventId = `${event}.${when}.${_handlerCount}`
				this.events[event][when][eventId] = handler

				return eventId
			}
		}
		// setup 'when' event handlers
		this.on = _addEventHandler('on')
		this.once = _addEventHandler('once')
		this.beforeAll = _addEventHandler('beforeAll')
		this.afterAll = _addEventHandler('afterAll')
	}

	/**
	 * Remove a handler for an event, the first parameter can be and event name
	 * or an eventId to be removed.
	 * @param eventOrId
	 * @param handler
	 * @returns {EventSky}
	 */
	off (eventOrId, handler) {
		Object.keys(this.events).forEach(eventName => {
			// iterate each 'when' event lifecycle and look for eventId or handler to remove
			Object.keys(this.events[eventName]).forEach(eventWhen => {
				if (!['beforeAll', 'on', 'once', 'afterAll'].includes(eventWhen)) return
				// iterate each event of the current 'when' for event
				Object.keys(this.events[eventName][eventWhen]).forEach(eventId => {
					const del = (!handler && eventId === eventOrId) || (this.events[eventName][eventWhen][eventId] === handler)

					if (del) {
						delete this.events[eventName][eventWhen][eventId]
						this.events[eventName].handlers--
					}
				})
			})
		})

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
