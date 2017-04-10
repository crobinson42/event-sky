test('EventSky doesnt blow up', () => {
	const EventSky = require('../src/main.js')

	expect(typeof EventSky).toEqual('object')
})

test('EventSky has expected properties', () => {
	const EventSky = require('../src/main.js')

	expect(typeof EventSky.events).toEqual('object')

	expect(typeof EventSky.on).toEqual('function')
	expect(typeof EventSky.once).toEqual('function')
	expect(typeof EventSky.beforeAll).toEqual('function')
	expect(typeof EventSky.afterAll).toEqual('function')
	expect(typeof EventSky.trigger).toEqual('function')
	expect(typeof EventSky.off).toEqual('function')
})
