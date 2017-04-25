import utils from './utils'

class EventSky {
	constructor () {
		this.config = {
			firehose: false,
			ignoreDuplicateHandler: false, // warns about duplicate event/handler
		}

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
	allOff (event) {
		delete this.events[event]

		this._firehose(`.off.all("${event}") removed all event handlers`)

		this.events[event] = this._utils.createNewEventMap()

		return this
	}

	trigger (event, data) {
		if (!this._utils.validateEventName(this, event)) return this

		if (!this.events[event]) {
			this._firehose(`"${event}" triggered with no handlers setup`)

			return this
		}

		this._firehose(`"${event}" triggered`)

		// beforeAll
		const beforeAll = this.events[event].beforeAll

		Object.keys(beforeAll).forEach(key => {
			try {
				beforeAll[key](data)
			} catch (e) {
				if (!beforeAll[key]) { // check if the method exists
					console.error(`EventSky error: .beforeAll('${event}', ...) handler does not exist`, { eventId: key, data: data })
				} else { // else show the method errored
					console.error(`EventSky error: .beforeAll('${event}', ${on[key].name || ('anonymous')}) handler trapped an error`, { error: e, data: data })
				}
			}
		})

		// on
		const on = this.events[event].on

		Object.keys(on).forEach(key => {
			try {
				on[key](data)
			} catch (e) {
				if (!on[key]) { // check if the method exists
					console.error(`EventSky error: .on('${event}', ...) handler does not exist`, { eventId: key, data: data })
				} else { // else show the method errored
					console.error(`EventSky error: .on('${event}', ${on[key].name || ('anonymous')}) handler trapped an error`, { error: e, data: data })
				}
			}
		})

		// once
		const once = this.events[event].once

		Object.keys(once).forEach(key => {
			try {
				once[key](data)
			} catch (e) {
				if (!once[key]) { // check if the method exists
					console.error(`EventSky error: .once('${event}', ...) handler does not exist`, { eventId: key, data: data })
				} else { // else show the method errored
					console.error(`EventSky error: .once('${event}', ${on[key].name || ('anonymous')}) handler trapped an error`, { error: e, data: data })
				}
			}
		})

		// afterAll
		const afterAll = this.events[event].afterAll

		Object.keys(afterAll).forEach(key => {
			try {
				afterAll[key](data)
			} catch (e) {
				if (!afterAll[key]) { // check if the method exists
					console.error(`EventSky error: .afterAll('${event}', ...) handler does not exist`, { eventId: key, data: data })
				} else { // else show the method errored
					console.error(`EventSky error: .afterAll('${event}', ${on[key].name || ('anonymous')}) handler trapped an error`, { error: e, data: data })
				}
			}
		})

		return this
	}
}

export default new EventSky()
