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
}
