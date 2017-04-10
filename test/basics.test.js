const EventSky = require('../build')
const sinon = require('sinon')

describe('EventSky provides the basics', () => {
  test('.on(event-name, handler)', () => {
    const eventName = 'myEvent1'
    const handler1 = sinon.spy()

    const handlerId = EventSky.on(eventName, handler1)

    expect(handlerId).toBeDefined()
    expect(typeof EventSky.events).toEqual('object')
    expect(typeof EventSky.events[eventName]).toEqual('object')
    expect(EventSky.events[eventName].handlers).toEqual(1)
    expect(EventSky.events[eventName].on[handlerId]).toEqual(handler1)
  })

  test('.trigger & .off are chainable', () => {
    const handler = sinon.spy()

    EventSky.on('chainable', handler)

    expect(EventSky.trigger('chainable')).toMatchObject(EventSky)
    expect(EventSky.off('chainable', handler)).toMatchObject(EventSky)
  })

	test('.trigger fires a handler', () => {
    const handler = sinon.spy()

    EventSky.on('trigger', handler)

		EventSky.trigger('trigger')

    expect(handler.calledOnce).toBeTruthy()

		EventSky.trigger('trigger', 'data')

    expect(handler.calledWith('data')).toBeTruthy()
  })

	test('.off removes handler by eventId', () => {
		const handler = sinon.spy()

		const eventId = EventSky.on('off', handler)

		expect(EventSky.events.off.on[eventId]).toBeDefined()

		EventSky.off(eventId)

		expect(EventSky.events.off.on[eventId]).toBeUndefined()
	})
})
