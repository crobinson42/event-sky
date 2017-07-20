!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):e.EventSky=n()}(this,function(){"use strict";function e(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}var n={createNewEventMap:function(e){return{handlers:0,_handlers:0,_name:e,on:{},once:{},beforeAll:{},afterAll:{}}},curryWhenHandler:function(e){var n=this;return function(r,t){if("string"!=typeof r||r.length<1||"function"!=typeof t)return console.warn('EventSky warning: "'+r+'" event must be a string and handler must be a function - not set with .'+e+" handler"),n;n.events[r]||(n.events[r]=n._utils.createNewEventMap(r)),n.events[r][e]&&n.events[r][e]===t&&(n.config.ignoreDuplicateHandler||console.warn("EventSky warning: duplicate handler for ."+e+"('"+r+"')")),n.events[r].handlers++;var o=n.events[r]._handlers++,a="id_"+r+"."+e+"."+o;return n.events[r][e][a]=t,a}},validateEventName:function(e,n){return e?!(!n||"string"!=typeof n)||(console.error("EventSky error: .trigger(event) did not receive a string param"),!1):console.error("EventSky._utils needs to be passed a valid context param")}},r=function(){function e(e,n){for(var r=0;r<n.length;r++){var t=n[r];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}return function(n,r,t){return r&&e(n.prototype,r),t&&e(n,t),n}}();return new(function(){function t(){var r=this;e(this,t),this.config={firehose:!1,ignoreDuplicateHandler:!1},this._utils=n,this.events={},this._firehose=function(e){return r.config.firehose?console.log("EventSky Firehose >> "+e):null},this.on=this._utils.curryWhenHandler.bind(this)("on"),this.once=this._utils.curryWhenHandler.bind(this)("once"),this.beforeAll=this._utils.curryWhenHandler.bind(this)("beforeAll"),this.afterAll=this._utils.curryWhenHandler.bind(this)("afterAll"),this.off.all=this.allOff.bind(this)}return r(t,[{key:"off",value:function(e,n){var r=this;return Object.keys(this.events).forEach(function(t){Object.keys(r.events[t]).forEach(function(o){["beforeAll","on","once","afterAll"].includes(o)&&Object.keys(r.events[t][o]).forEach(function(a){var s=r.events[t][o][a]===n&&t===e,i=!n&&a===e;(s||i)&&(delete r.events[t][o][a],r.events[t].handlers--)})})}),this}},{key:"allOff",value:function(e){return delete this.events[e],this._firehose('.off.all("'+e+'") removed all event handlers'),this.events[e]=this._utils.createNewEventMap(),this}},{key:"trigger",value:function(e,n){if(!this._utils.validateEventName(this,e))return this;if(!this.events[e])return this._firehose('"'+e+'" triggered with no handlers setup'),this;this._firehose('"'+e+'" triggered');var r=this.events[e].beforeAll;Object.keys(r).forEach(function(o){try{r[o](n)}catch(a){r[o]?console.error("EventSky error: .beforeAll('"+e+"', "+(t[o].name||"anonymous")+") handler trapped an error",{error:a,data:n}):console.error("EventSky error: .beforeAll('"+e+"', ...) handler does not exist",{eventId:o,data:n})}});var t=this.events[e].on;Object.keys(t).forEach(function(r){try{t[r](n)}catch(o){t[r]?console.error("EventSky error: .on('"+e+"', "+(t[r].name||"anonymous")+") handler trapped an error",{error:o,data:n}):console.error("EventSky error: .on('"+e+"', ...) handler does not exist",{eventId:r,data:n})}});var o=this.events[e].once;Object.keys(o).forEach(function(r){try{o[r](n)}catch(a){o[r]?console.error("EventSky error: .once('"+e+"', "+(t[r].name||"anonymous")+") handler trapped an error",{error:a,data:n}):console.error("EventSky error: .once('"+e+"', ...) handler does not exist",{eventId:r,data:n})}});var a=this.events[e].afterAll;return Object.keys(a).forEach(function(r){try{a[r](n)}catch(o){a[r]?console.error("EventSky error: .afterAll('"+e+"', "+(t[r].name||"anonymous")+") handler trapped an error",{error:o,data:n}):console.error("EventSky error: .afterAll('"+e+"', ...) handler does not exist",{eventId:r,data:n})}}),this}}]),t}())});
//# sourceMappingURL=build.js.map
