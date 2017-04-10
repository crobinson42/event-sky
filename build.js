(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.EventSky = factory());
}(this, (function () { 'use strict';

// utility methods for EventSky

var utils = {
	/**
  * This provides a format for event map objects
  * @returns {{}}
  */
	createNewEventMap: function createNewEventMap() {
		return {
			// aggregate number of handlers for this event
			handlers: 0,
			_handlers: 0,
			on: {},
			once: {},
			beforeAll: {},
			afterAll: {}
		};
	}
};

var config = {
	/**
  * This method sets the events that are expected to happen in the store.
  * If this method is invoked, it automatically assumes the intention to
  * restrict to only expected events that are set explicitly.
  * @param events [string|array]
  */
	setExpectedEvents: function setExpectedEvents(events) {
		// check if there are existing events and config.restrictToExpected is false - show warning/log
		// because it means they first assigned events then set restrictToExpected

		this.config.restrictToExpected = true;

		// todo: set this.events = {}

		return this;
	}
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

// todo: add changelog before publish
// todo: verify a correct singleton pattern
// todo: in the case of React, we need to ensure handlers are removed if they don't exist, ie: cdunm
// todo: look into cancellable handlers?
// todo: write readme on how restrictToExpected helps predictability in teams and large apps, guide on file architecture

var EventSky = function () {
	function EventSky() {
		var _this = this;

		classCallCheck(this, EventSky);

		this.config = {
			restrictToExpected: false,
			firehose: false
		};

		this._config = config;
		this._utils = utils;
		// map of events
		this.events = {};
		this._firehose = function (msg) {
			return _this.config.firehose ? console.log('EventSky Firehose >> ' + msg) : null;
		};

		// util to setup 'when' event handlers
		var _addEventHandler = function _addEventHandler(when) {
			return function (event, handler) {
				// verify params
				if (typeof event !== 'string' || event.length < 1 || typeof handler !== 'function') {
					console.warn('EventSky warning: "' + event + '" event must be a string and handler must be a function - not set with .' + when + ' handler');

					return _this;
				}

				// first check if we're restricting to expected only
				if (_this.config.restrictToExpected) {
					if (!Object.keys(_this.events).includes(event)) {
						_this._firehose('"' + event + '" handler cannot be set because it is not an expected event "restrictToExpected = true"');

						return _this;
					}
				}

				// ensure the event exists and is setup on the event store
				if (!_this.events[event]) {
					_this.events[event] = _this._utils.createNewEventMap();
				}

				_this.events[event].handlers++;
				var _handlerCount = _this.events[event]._handlers++;
				var eventId = event + '.' + when + '.' + _handlerCount;
				_this.events[event][when][eventId] = handler;

				return eventId;
			};
		};
		// setup 'when' event handlers
		this.on = _addEventHandler('on');
		this.once = _addEventHandler('once');
		this.beforeAll = _addEventHandler('beforeAll');
		this.afterAll = _addEventHandler('afterAll');
	}

	/**
  * Remove a handler for an event, the first parameter can be and event name
  * or an eventId to be removed.
  * @param eventOrId
  * @param handler
  * @returns {EventSky}
  */


	createClass(EventSky, [{
		key: 'off',
		value: function off(eventOrId, handler) {
			var _this2 = this;

			Object.keys(this.events).forEach(function (eventName) {
				// iterate each 'when' event lifecycle and look for eventId or handler to remove
				Object.keys(_this2.events[eventName]).forEach(function (eventWhen) {
					if (!['beforeAll', 'on', 'once', 'afterAll'].includes(eventWhen)) return;
					// iterate each event of the current 'when' for event
					Object.keys(_this2.events[eventName][eventWhen]).forEach(function (eventId) {
						var del = !handler && eventId === eventOrId || _this2.events[eventName][eventWhen][eventId] === handler;

						if (del) {
							delete _this2.events[eventName][eventWhen][eventId];
							_this2.events[eventName].handlers--;
						}
					});
				});
			});

			return this;
		}
	}, {
		key: 'trigger',
		value: function trigger(event, data) {
			var _this3 = this;

			if (this.config.restrictToExpected) {
				if (!Object.keys(this.events).includes(event)) {
					this._firehose('"' + event + '" triggered and is not an expected event "restrictToExpected = true"');

					return this;
				}
			} else if (!this.events[event]) {
				this._firehose('"' + event + '" triggered with no handlers setup');

				return this;
			}

			this._firehose('"' + event + '" triggered');

			// beforeAll
			var beforeAll = this.events[event].beforeAll;
			try {
				Object.keys(beforeAll).forEach(function (key) {
					return beforeAll[key](data);
				});
			} catch (e) {
				console.error('EventSky error: ' + event + ' beforeAll handler errored', { error: e, data: data });
			}

			// on
			var on = this.events[event].on;
			try {
				Object.keys(on).forEach(function (key) {
					return on[key](data);
				});
			} catch (e) {
				console.error('EventSky error: ' + event + ' on handler errored', { error: e, data: data });
			}

			// once
			var once = this.events[event].once;
			try {
				Object.keys(once).forEach(function (key) {
					once[key](data);
					// remove handler
					_this3.off(event, once[key](data));
				});
			} catch (e) {
				console.error('EventSky error: ' + event + ' once handler errored', { error: e, data: data });
			}

			// afterAll
			var afterAll = this.events[event].afterAll;
			try {
				Object.keys(afterAll).forEach(function (key) {
					return afterAll[key](data);
				});
			} catch (e) {
				console.error('EventSky error: ' + event + ' afterAll handler errored', { error: e, data: data });
			}

			return this;
		}
	}]);
	return EventSky;
}();

var main = new EventSky();

return main;

})));
//# sourceMappingURL=build.js.map
