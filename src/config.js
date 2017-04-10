export default {
	/**
	 * This method sets the events that are expected to happen in the store.
	 * If this method is invoked, it automatically assumes the intention to
	 * restrict to only expected events that are set explicitly.
	 * @param events [string|array]
	 */
	setExpectedEvents (events) {
		// check if there are existing events and config.restrictToExpected is false - show warning/log
		// because it means they first assigned events then set restrictToExpected

		this.config.restrictToExpected = true

		// todo: set this.events = {}

		return this
	}
}