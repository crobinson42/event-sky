// utility methods for EventSky

export default {
	/**
	 * This provides a format for event map objects
	 * @returns {{}}
	 */
	createNewEventMap () {
		return {
			// aggregate number of handlers for this event
			handlers: 0,
			_handlers: 0,
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
			const eventId = `id_${event}.${when}.${_handlerCount}`
			this.events[event][when][eventId] = handler

			return eventId
		}
	},
}
