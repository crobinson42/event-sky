// utility methods for EventSky

export default {
	/**
	 * This provides a format for event map objects
	 * @returns {{}}
	 */
	createNewEventMap (eventName) {
		return {
			// aggregate number of handlers for this event
			handlers: 0,
			_handlers: 0,
			_name: eventName,
			on: {},
			once: {},
			beforeAll: {},
			afterAll: {},
		}
	},

	/**
	 * Utility used to setup 'when' handlers on parent class
	 * @param when {string} 'on', 'beforeAll', etc.
	 * @return function
	 */
	curryWhenHandler (when) {
		return (event, handler) => {
			// verify params
			if (typeof event !== 'string' || event.length < 1 || typeof handler !== 'function') {
				console.warn(`EventSky warning: "${event}" event must be a string and handler must be a function - not set with .${when} handler`)

				return this
			}

			// ensure the event exists and is setup on the event store
			if (!this.events[event]) {
				this.events[event] = this._utils.createNewEventMap(event)
			}

			// check if the event and handler are a duplicate
			if (this.events[event][when] && this.events[event][when] === handler) {
				if (!this.config.ignoreDuplicateHandler) {
					console.warn(`EventSky warning: duplicate handler for .${when}('${event}')`)
				}
			}

			this.events[event].handlers++
			const _handlerCount = this.events[event]._handlers++
			const eventId = `id_${event}.${when}.${_handlerCount}`
			this.events[event][when][eventId] = handler

			return eventId
		}
	},

	validateEventName (context, eventName) {
		if (!context) {
			return console.error('EventSky._utils needs to be passed a valid context param')
		} else if (!eventName || typeof eventName !== 'string') {
			console.error('EventSky error: .trigger(event) did not receive a string param')

			return false
		}

		return true
	},
}
