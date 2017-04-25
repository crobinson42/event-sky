module.exports = {
	/**
	 * This lifecycle method is fired on all events before any handlers are fired
	 * @param event
	 */
  beforeHandlers (event) {

  },

	/**
	 * * This lifecycle method is fired on all events after all handlers are fired
	 * * @param event
	*/
  afterHandlers (event) {

  },

	/**
	 * This lifecycle method gets fired before a handler gets added for an event
	 * @param event
	 * @param when
	 * @param handler
	 */
  handlerWillAdd (event, when, handler) {

  },

	/**
	 * This lifecycle method gets fired before a handler is removed for an event
	 * @param event
	 * @param handler
	 */
  handlerWillRemove (event, handler) {

  },
}
