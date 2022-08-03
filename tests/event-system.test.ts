import EventSystem from '../src';

enum TEST_EVENT_SYSTEM_EVENT_NAMES {
  LOG_EVENT = 'log_event',
}

type TestEventSystemEvents = {
  [TEST_EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT]: (message: string) => string | void;
};

const echoHandler = (message: string) => message;
describe('Event System tests', () => {
  describe('Event System initialization', () => {
    test('Event System initialization with default options', () => {
      expect(() => new EventSystem()).not.toThrow();
    });

    test('Event System initialization with empty options', () => {
      expect(() => new EventSystem({})).not.toThrow();
    });

    test('Event System initialization with options', () => {
      let eventSystem: EventSystem<TestEventSystemEvents>;

      expect(() => {
        eventSystem = new EventSystem({
          bufferDirection: 'LIFO',
          bufferSize: 3,
        });
      }).not.toThrow();

      /* eslint-disable dot-notation */
      expect(eventSystem['bufferDirection']).toBe('LIFO');
      expect(eventSystem['bufferSize']).toBe(3);
      /* eslint-enable dot-notation */
    });
  });

  describe('Event System subscription', () => {
    test("Event System's subscribe() method works", () => {
      const eventSystem = new EventSystem<TestEventSystemEvents>();

      eventSystem.subscribe(
        TEST_EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT,
        echoHandler
      );

      /* eslint-disable dot-notation */
      expect(eventSystem['subscribers'].length).toBe(1);
      expect(eventSystem['subscribers'][0].event).toBe(
        TEST_EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT
      );
      expect(eventSystem['subscribers'][0].handler).toBe(echoHandler);
      /* eslint-enable dot-notation */
    });

    test("Event System's unsubscribe() method works", () => {
      const eventSystem = new EventSystem<TestEventSystemEvents>();

      eventSystem.subscribe(
        TEST_EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT,
        echoHandler
      );
      eventSystem.unsubscribe(
        TEST_EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT,
        echoHandler
      );

      /* eslint-disable dot-notation */
      expect(eventSystem['subscribers'].length).toBe(0);
      /* eslint-enable dot-notation */
    });

    test("Event System's resubscribe logic works", () => {
      const eventSystem = new EventSystem<TestEventSystemEvents>();

      eventSystem.subscribe(
        TEST_EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT,
        echoHandler
      );
      eventSystem.unsubscribe(
        TEST_EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT,
        echoHandler
      );
      eventSystem.subscribe(
        TEST_EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT,
        echoHandler
      );

      /* eslint-disable dot-notation */
      expect(eventSystem['subscribers'].length).toBe(1);
      expect(eventSystem['subscribers'][0].event).toBe(
        TEST_EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT
      );
      expect(eventSystem['subscribers'][0].handler).toBe(echoHandler);
      /* eslint-enable dot-notation */
    });
  });

  describe('Event System notification', () => {
    test("Event System's notify() method works", () => {
      const eventSystem = new EventSystem<TestEventSystemEvents>();

      eventSystem.subscribe(
        TEST_EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT,
        echoHandler
      );

      const spy = jest.spyOn(eventSystem, 'notify');
      // eslint-disable-next-line dot-notation
      spy.mockImplementation(eventSystem['subscribers'][0].handler);

      eventSystem.notify(
        TEST_EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT,
        'Hello World!'
      );

      expect(spy).toHaveBeenCalledWith(
        TEST_EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT,
        'Hello World!'
      );
    });
  });
});
