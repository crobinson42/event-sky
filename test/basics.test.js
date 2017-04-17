const EventSky = require('../src/main')
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

	test('.trigger fires a handler with data', () => {
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
		expect(EventSky.events.off.handlers).toEqual(0)
	})

	test('.off removes handler by function reference', () => {
		const handler = sinon.spy()

		const eventId = EventSky.on('off2', handler)

		expect(EventSky.events[`off2`].on[eventId]).toBeDefined()

		EventSky.off('off2', handler)

		expect(EventSky.events.off.on[eventId]).toBeUndefined()
		expect(EventSky.events.off.handlers).toEqual(0)
	})

	test('.off does not remove all handlers on eventName', () => {
		const handler1 = sinon.spy()
		const handler2 = sinon.spy()

		const eventId1 = EventSky.on('off3', handler1)
		const eventId2 = EventSky.on('off3', handler2)

		expect(EventSky.events[`off3`].on[eventId1]).toBeDefined()
		expect(EventSky.events[`off3`].on[eventId2]).toBeDefined()

		EventSky.off('off3', handler1)

		expect(EventSky.events.off3.on[eventId1]).toBeUndefined()
		expect(EventSky.events.off3.on[eventId2]).toBeDefined()
		expect(EventSky.events.off3.handlers).toEqual(1)
	})

	test('.off.all() removes all handlers for an event name', () => {
		const handlerBefore = sinon.spy()
		const handlerOn = sinon.spy()
		const handlerAfter = sinon.spy()

		const eventId1 = EventSky.beforeAll('allOffTest', handlerBefore)
		const eventId2 = EventSky.on('allOffTest', handlerOn)
		const eventId3 = EventSky.afterAll('allOffTest', handlerAfter)

		expect(EventSky.events[`allOffTest`].beforeAll[eventId1]).toBeDefined()
		expect(EventSky.events[`allOffTest`].on[eventId2]).toBeDefined()
		expect(EventSky.events[`allOffTest`].afterAll[eventId3]).toBeDefined()

		EventSky.off.all('allOffTest')

		expect(EventSky.events[`allOffTest`].beforeAll[eventId1]).toBeUndefined()
		expect(EventSky.events[`allOffTest`].on[eventId2]).toBeUndefined()
		expect(EventSky.events[`allOffTest`].afterAll[eventId3]).toBeUndefined()
	})

	test('.trigger fires all lifecycle handlers for eventName', () => {
		const handler1 = sinon.spy()
		const handler2 = sinon.spy()

		EventSky.beforeAll('triggerAllTest', handler1)
		EventSky.beforeAll('triggerAllTest', handler2)
		EventSky.on('triggerAllTest', handler1)
		EventSky.on('triggerAllTest', handler2)
		EventSky.afterAll('triggerAllTest', handler1)
		EventSky.afterAll('triggerAllTest', handler2)

		EventSky.trigger('triggerAllTest')

		expect(handler1.callCount).toEqual(3)
		expect(handler2.callCount).toEqual(3)
	})

	test('all lifecycles fire in correct order', () => {
		const handlerBefore = sinon.spy()
		const handlerOn = sinon.spy()
		const handlerAfter = sinon.spy()

		const eventId1 = EventSky.beforeAll('beforeAllTest', handlerBefore)
		const eventId2 = EventSky.on('beforeAllTest', handlerOn)
		const eventId3 = EventSky.afterAll('beforeAllTest', handlerAfter)

		expect(EventSky.events[`beforeAllTest`].beforeAll[eventId1]).toBeDefined()
		expect(EventSky.events[`beforeAllTest`].on[eventId2]).toBeDefined()
		expect(EventSky.events[`beforeAllTest`].afterAll[eventId3]).toBeDefined()

		EventSky.trigger('beforeAllTest')

		expect(handlerBefore.called).toBeTruthy()
		expect(handlerOn.called).toBeTruthy()
		expect(handlerAfter.called).toBeTruthy()

		expect(handlerBefore.calledBefore(handlerOn)).toBeTruthy()
		expect(handlerOn.calledBefore(handlerAfter)).toBeTruthy()
	})
})
