/**********************************************
 * This is event-sky built as a React mixin * *
 *                                            *
 * Description                                *
 * 		We first check if the window object is  *
 * 		available and has our event module      *
 * 		iniitialized, if it's not then we       *
 * 		iniitializ or then check GLOBAL because *
 * 		we might be on server/node or other env *
 * 		                                        *
 ***********************************************/


// Exposed methods
// var API = {
// 	init : init,
// 	// subscribe to an event
// 	on 			: on,
// 	// subscribe to be triggered before other
// 	before 		: before,
// 	// subscribe to be triggered after other
// 	after 		: after,
// 	// will only listen and fire once to an event
// 	once 			: once,
// 	// unsubscribe to an event
// 	off 		: off,
// 	// trigger an event
// 	trigger 	: trigger,
// 	// list of events
// 	events 		: getEventList,
// 	// dev
// 	dev				:	{ eventStack : eventStack, eventMap : eventStackIdMap }
// };
//
// // expose to global scope
// GLOBAL_SCOPE === 'window' ? window[namespace] = API : global[namespace] = API;




var namespace;

// check if we're in a browser environment
if (typeof(window)!=='undefined') {
  if (!window.eventSky) {
    require('event-sky');
    if (!window.eventSky) {
      throw new Error('eventSky is not initialized and cannot be found with "require(\'event-sky\')"');
    }
  }
  namespace = window.eventSky;
}
// assume we're serverSide, phonegap or other environment
else {
  // id server side (node), GLOBAL/global will be available
  // if it's not, we instantiate a GLOBAL
  var GLOBAL = GLOBAL || global || {};

  if (!GLOBAL.eventSky) {
    require('event-sky');
    if (!GLOBAL.eventSky) {
      throw new Error('eventSky is not initialized and cannot be found with "require(\'event-sky\')"');
    }
  }
  namespace = GLOBAL.eventSky;
}

module.exports = namespace;
