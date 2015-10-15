# Event Sky (event-sky)
An event aggregate utility for front-end apps.

When designing front-end apps it's best to keep modules/features loosely coupled. A great method for accomplishing this is events. "Event Sky" was designed to help your apps work without knowing about eachother by utilizing the events with Event Sky.

eventSky is set as a property on the window object by default.

The available trigger sequences are 'on', 'before', & 'after'. Each will return an eventId which can optionaly be stored:
```
var newMessageEventId = eventSky.on('newMessage', function callback(data) { *do something with data* });
                        eventSky.before('newMessage'...
                        eventSky.after('newMessage'...
                        eventSky.once('newMessage'...
```
To trigger an event by name or by eventId:
```
eventSky.trigger('newMessage', 'this string will get passed to the callback, it can be an object, or whatever you like');
```
OR
```
eventSky.trigger(newMessageEventId, 'more data...');
eventSky.trigger(newMessageEventId, { key : 'value...'});
```
To remove an event:
```
eventSky.off(newMessageEventId);
eventSky.off([newMessageEventId1, newMessageEventId2, newMessageEventId3]);
eventSky.off({ event : eventId });
```
For development purposes you can initialize eventSky to see all event activity in the console:
```
eventSky.init({ firehose : true }); // firehose=true will console.log all activity for events, helps with debugging
```
ALSO
```
console.dir(eventSky.dev);
```
Configurable evnironment
Node.js module:
```
GLOBAL.eventSky
```
Client/Browser:
```
window.eventSky
```
Configurable namespace - at the top of the eventSky.js file, you can config the variable 'namespace' to be whatever you prefer.
