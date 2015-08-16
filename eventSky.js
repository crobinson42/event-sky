// eventSky.js - Event Aggregate utility/tool for front-end apps
// https://github.com/crobinson42/event-sky
// Cory Robinson

// TODO:
/*
	-readme about window.eventSky
	-write readme info for init() & firehose
	-add firehose to each method

*/



(function () {
	// local use error logger
	var error = function(msg,options) {
		throw new Error('eventSky.js: ' + msg, options || null);
	};

	var firehose = function (input,options) {
		if (firehose.active) {
			console.log(input,options);
		}
	};
	firehose.active = false;

	var init = function (options) {
		if (options) {
			firehose.active = (options.firehose) ? true : false;
		}
	};

	// The main object that houses event on/off & handlers
	var eventStack = {
		/*
		newMail : {
			before : {},
			on :	{
				'12345' : function(){}
			},
			after : {}
		}
		*/
	};
	// a map of event id's for eventStack
	var eventStackIdMap = {
		/*
			12345 = {
				event:'eventName',
				when:'on/before/after'
			}
		*/
	};

	//  eventStackIdMap constructor
	var EventStackIdMap = function(when,event) {
		this.event 	= event;
		this.when 	= when;
		return this;
	};

	// event constructor
	var Event = function() {
		this.before 	= {};
		this.on 			= {};
		this.after	 	= {};
		return this;
	};

	var generateEventId = function () {
		return new Date().getTime() + Math.floor(Math.random() * 100);
	};

	// ensures the event is listed as a key in eventStack
	var ensureEventExists = function(event) {
		if (!event) {
			error('ensureEventExists was not passed an event.');
	 		return false;
		}
		// return if event key already exists
		if (eventStack && eventStack[event]) { return true; }
		// create event key & event obj
		eventStack[event] = new Event();
		return true;
	};

	// This is called/used by .on(), .after(), .before()
	addEventListenerAction = function (when,event,options,handler) {
		console.log(when,event,options,handler);
		var eventType,
			optionsObj,
			handlerMethod,
			eventListenerId = generateEventId();

		eventType = (event)
				? event
				: error('No event specified.');
		optionsObj = (options && typeof options != 'function')
				? options
				: null;
		handlerMethod = (optionsObj)
				? optionsObj
				: (!handler)
					? options
					: null;

		// now verify all vars are set to proceed
		console.log(when,eventType,optionsObj,handlerMethod);
		if (!when || !eventType || !handlerMethod) {
			return error(when + '() cannot be set due to invalid arguments.')
		}

		ensureEventExists(eventType);

		// add to event stack
		eventStack[eventType][when][eventListenerId] = handlerMethod;
		// add to eventStackIdMap
		eventStackIdMap[eventListenerId] = new EventStackIdMap(when,eventType);

		return eventListenerId;
	};

	var on = function (event, options, handler) {
		// README
		// * see addEventListenerAction() for argument requirements
		return addEventListenerAction('on',event,options,handler);
	};

	var before = function (event, options, handler) {
		// README
		// * see addEventListenerAction() for argument requirements
		return addEventListenerAction('before',event,options,handler);
	};

	var after = function (event, options, handler) {
		// README
		// * see addEventListenerAction() for argument requirements
		return addEventListenerAction('after',event,options,handler);
	};

	var off = function (eventOrId, options) {
		// if event, overwrite key w/ new event in eventStack
		if (eventOrId && eventStack[eventOrId]) {
			// delete  eventStack[eventOrId];
			eventStack[eventOrId] = new Event();
		}
		else { // if id, only remove key:val
			var map = eventStackIdMap[eventOrId];
			// lookup id
			if (!map) { return error('off() cannot map event ID.'); }
			delete eventStackIdMap[eventOrId];
			delete eventStack[map.event][map.when][eventOrId];
		}
	};

	var trigger = function (eventOrId,data) {
			var map = eventStackIdMap[eventOrId];
			if (typeof map == 'object') { // eventOrId is an ID..
				// only trigger method assigned to this id
				firehose('Trigger:'+map.event +':'+map.when+':'+eventOrId);
				eventStack[map.event][map.when][eventOrId](data);
			} else { // eventOrId is an event
				// trigger event in sequences
				if (eventStack[eventOrId]) {
					Object.keys(eventStack[eventOrId].before).forEach(function(i) {
						firehose('Trigger:'+eventOrId +':before:*');
						eventStack[eventOrId].before[i](data);
					});
					Object.keys(eventStack[eventOrId].on).forEach(function(i) {
						firehose('Trigger:'+eventOrId +':on:*');
						eventStack[eventOrId].on[i](data);
					});
					Object.keys(eventStack[eventOrId].after).forEach(function(i) {
						firehose('Trigger:'+eventOrId +':after:*');
						eventStack[eventOrId].after[i](data);
					});
				}
			}
	};

	var getEventList = function () {
		return Object.keys(eventStack);
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
		// list of events
		events 		: getEventList,
		// dev
		dev				:	{ eventStack : eventStack, eventMap : eventStackIdMap }
	};
})();
