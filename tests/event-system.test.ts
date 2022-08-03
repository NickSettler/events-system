import EventSystem, { EVENT_SYSTEM_EVENT_NAMES } from '../src';

const echoHandler = (message: string) => message;

describe('Event System initialization', () => {
  test('Event System getInstance() method works', () => {
    EventSystem.init();
    expect(EventSystem.getInstance()).toBeInstanceOf(EventSystem);
  });
});

describe('Event System subscription', () => {
  test("Event System's subscribe() method works", () => {
    EventSystem.init();
    const eventSystem = EventSystem.getInstance();

    eventSystem.subscribe(EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT, echoHandler);

    /* eslint-disable dot-notation */
    expect(eventSystem['subscribers'].length).toBe(1);
    expect(eventSystem['subscribers'][0].event).toBe(
      EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT
    );
    expect(eventSystem['subscribers'][0].handler).toBe(echoHandler);
    /* eslint-enable dot-notation */
  });

  test("Event System's unsubscribe() method works", () => {
    EventSystem.init();
    const eventSystem = EventSystem.getInstance();

    eventSystem.subscribe(EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT, echoHandler);
    eventSystem.unsubscribe(EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT, echoHandler);

    /* eslint-disable dot-notation */
    expect(eventSystem['subscribers'].length).toBe(0);
    /* eslint-enable dot-notation */
  });

  test("Event System's resubscribe logic works", () => {
    EventSystem.init();
    const eventSystem = EventSystem.getInstance();

    eventSystem.subscribe(EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT, echoHandler);
    eventSystem.unsubscribe(EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT, echoHandler);
    eventSystem.subscribe(EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT, echoHandler);

    /* eslint-disable dot-notation */
    expect(eventSystem['subscribers'].length).toBe(1);
    expect(eventSystem['subscribers'][0].event).toBe(
      EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT
    );
    expect(eventSystem['subscribers'][0].handler).toBe(echoHandler);
    /* eslint-enable dot-notation */
  });
});

describe('Event System notification', () => {
  test("Event System's notify() method works", () => {
    EventSystem.init();
    const eventSystem = EventSystem.getInstance();

    eventSystem.subscribe(EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT, echoHandler);

    const spy = jest.spyOn(eventSystem, 'notify');
    // eslint-disable-next-line dot-notation
    spy.mockImplementation(eventSystem['subscribers'][0].handler);

    eventSystem.notify(EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT, 'Hello World!');

    expect(spy).toHaveBeenCalledWith(
      EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT,
      'Hello World!'
    );
  });
});
