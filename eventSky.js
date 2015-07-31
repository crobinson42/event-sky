// eventSky.js - Event Aggregate utility/tool for front-end apps
// https://github.com/crobinson42/event-sky
// Cory Robinson

(function () {
	// local use error logger
	var error = function(msg) {
		// TODO
		// check for errorShelter module (https://github.com/crobinson42/error-shelter.git)
		// if (errorShelter) ... then use it

		throw new Error('eventSky.js: ' + msg);
	};

	var init = function () {
		alert('Event Sky Initialized!');
		console.dir(this);
	};

	// The main object that houses event on/off & handlers
	var eventStack = {
		/*
		'eventName' : {
			'before' : [{'eventId' : 'handler1' }, {'eventId' : 'handler2'}],
			'on' : [{'eventId' : 'handler1' }, {'eventId' : 'handler2'}],
			'after' : [{'eventId' : 'handler1' }, {'eventId' : 'handler2'}],
		}
		*/
	};

	var generateEventId = function () {
		return new Date().getTime() + Math.floor(Math.random() * 100);
	};

	var on = function (event, options, handler) {
		// README
		// 'event', 'handler' == required
		// 'options' == optional
		// this method tests if event is an object and if it is
		// 	it assumes a structure like so:
		//		.on({ event : 'click', 
		//			options : {opt1:null, opt2:null}, 
		//			handler : function() });
		//
		// If event is a string, it tests if the 2nd arg is a function 
		// 	or an options object
		var eventType,
			optionsObj,
			handlerMethod,
			eventListenerId = generateEventId();

		if (event && typeof event == 'object') {
			eventType = (event.event) 
				? event.event 
				: error('No event specified.');
			optionsObj = event.options || null;
			handlerMethod = event.handler || event.handlerMethod || null;
		} 
		else {
			eventType = event 
					? event 
					: error('No event specified.');
			optionsObj = options && typeof options != 'function'
					? options
					: null;
			handlerMethod = (!optionsObj) 
					? optionsObj 
					: (handlerMethod) 
						? handlerMethod 
						: null;
		}

		eventStack[event] = handler;

		return eventListenerId;
	};

	var before = function (event, options, handler) {

	};

	var after = function (event, options, handler) {

	};

	var off = function (eventOrId, options) {

	};

	var trigger = function (event) {

	};

	var getEventList = function () {

	};


	// Exposed methods
	window.eventSky = {
		init : init,
		// subscribe to an event
		on 			: on,
		// subscribe to be triggered before other
		before 		: before,
		// subscribe to be triggered after other
		after 		: after,
		// unsubscribe to an event
		off 		: off,
		// trigger an event
		trigger 	: trigger,
		// 
		// list of events
		events 		: getEventList
	};
})();




