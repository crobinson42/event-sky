## Event Sky (event-sky)
An event pub/sub aggregate utility for javascript apps.
 
When designing javascript apps it's best to keep modules/features loosely coupled. A great method for accomplishing this is events via publish/subscribe handlers. "Event Sky" was designed to help your apps work without knowing about eachother by utilizing the events with Event Sky.

[![npm version](https://badge.fury.io/js/event-sky.svg)](https://badge.fury.io/js/event-sky)
[![Build Status](https://travis-ci.org/crobinson42/event-sky.svg?branch=master)](https://travis-ci.org/crobinson42/event-sky) 
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![forthebadge](https://img.shields.io/badge/Module-CommonJs-green.svg)](http://pizza.com)
[![forthebadge](https://img.shields.io/badge/Browser-EventSky-orange.svg)](http://pizza.com)

[![forthebadge](https://img.shields.io/badge/Mom%20Made-Pizza%20Rolls-blue.svg)](http://pizza.com)

An event pub-sub aggregate utility for javascript environments.

### Usage

`EventSky` is bundled as a UMD (universal module design) and can be used in the following ways:

#### Browser

  ```
  <script src="https://unpkg.com/event-sky@x.x.x/build.js" />

  <script>
    EventSky.on('testEvent', console.info)

    EventSke.trigger('testEvent', 'It works!')

    console.log(EventSky.events)
  </script>
  ```
#### Commonjs - Node/Browserify/Webpack

`npm i -S event-sky` or `yarn add event-sky`
```
const EventSky = require('event-sky')
```

> Note: `EventSky` exports a singleton pattern module. This means it's the same
object across require/import's in your commonjs environment, ie:

```
/* file1.js */

const eventSky = require('event-sky')

eventSky.on('testSingleton', (msg) => console.log(msg))
```

```
/* file2.js */

const eventSky = require('event-sky')

eventSky.trigger('testSingleton', 'The singleton pattern works!')
```


--------------------

## API

### Event Hook Lifecycle

You can add event handlers in different lifecycle hooks, `beforeAll`, `on`, `once`, `afterAll`

```
const eventSky = require('event-sky')

eventSky.on('newMessage', (data) => { console.log(data) })
eventSky.beforeAll('newMessage'...)
eventSky.afterAll('newMessage'...)
eventSky.once('newMessage'...)
```

### Trigger Events
```
const data = 'some string...'

eventSky.trigger('newMessage', data)
```


### Turn Handlers Off
```
// by event id
const eventId = eventSky.on('newMessage', (data) => { console.log(data) })

eventSky.off(eventId)

// or by event name and handler
const handler = (data) => { console.log(data) }

eventSky.on('newMessage', handler)

eventSky.off('newMessage', handler)
```

A convenience method is available to turn all handlers off associated with an event name, ie:

```
eventSky.beforeAll('eventName', () => { /* ... */ })

eventSky.on('eventName`, () => { /* ... */ })

// remove all lifecycle hooks for event name "eventName"
eventSky.off.all('eventName')
```

### Firehose

For development purposes you can initialize eventSky to see all event activity in the console:
```
eventSky.config.firehose = true
```

### Registered Events

You can debug `EventSky` by checking the registered events and lifecycles via:

```
console.dir(eventSky.events)
```

