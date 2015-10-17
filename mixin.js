/*************************************************
 * This is event-sky built as a React mixin * *  *
 *                                            *  *
 * Description                                *  *
 * 		We first check if the window object is  * *
 * 		available and has our event module      * *
 * 		iniitialized, if it's not then we       * *
 * 		iniitializ or then check GLOBAL because * *
 * 		we might be on server/node or other env * *
      then we add mixin utility methods          *
      for the react component using the mixin    *
*************************************************/

var _ = require('underscore');

var eventSkyModule;

// check if we're in a browser environment
if (window) {
  if (!window.eventSky) {
    require('event-sky');
    if (!window.eventSky) {
      new Error('eventSky is not initialized and cannot be found with "require(\'event-sky\')"');
    }
  }
  eventSkyModule = window.eventSky;
}
// assume we're serverSide, phonegap or other environment
else {
  // id server side (node), GLOBAL/global will be available
  // if it's not, we instantiate a GLOBAL
  var GLOBAL = GLOBAL || global || {};

  if (!GLOBAL.eventSky) {
    require('event-sky');
    if (!GLOBAL.eventSky) {
      new Error('eventSky is not initialized and cannot be found with "require(\'event-sky\')"');
    }
  }
  eventSkyModule = GLOBAL.eventSky;
}

// // turn off all listeners and remove the keys from eventSkyModule/this.listeners
// // ** this.listeners must exist in the component..
// eventSkyModule.listenersOff = function() {
//   if (this.listeners) {
//     Object.keys(self.listeners).forEach(function (i) {
//       self.off(self.listeners[i]);
//       delete self.listeners[i];
//     },this);
//     return true;
//   }
//   else {
//     console.warn('eventSky.js [mixin] could not completed "this.listeners.off() because this.listeners does not exists."');
//     console.warn('this:',self);
//   }
// };
//
// // append functionality to eventSky.off method for the React eventSkyModule to
// // remove the key from eventSkyModule/this.listeners when this.off is invoked
// var nativeOff = eventSkyModule.off;
// eventSkyModule.off = function(eventObjOrId) {
//     var self = this;// this being the component including the mixin
//     // invoke native off method
//     var events = nativeOff(eventObjOrId);
//     // remove events from component/this.listeners
//     if (events instanceof Array) {
//       events.forEach(function (i) {
//         delete self.listeners[events[i]];
//       });
//     }
//     // assume it's a string/single eventOrId
//     else {
//       delete self[events];
//     }
// };

module.exports = eventSkyModule;
