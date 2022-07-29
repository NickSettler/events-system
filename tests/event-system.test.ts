import EventSystem from '../src';
import { EVENT_SYSTEM_EVENT_NAMES } from '../src/event-system';

const echoHandler = (message: string) => message;

describe('Event System initialization', () => {
  test('Event System getInstance() method works', () => {
    expect(EventSystem.getInstance()).toBeInstanceOf(EventSystem);
  });
});

describe('Event System subscription worker', () => {
  test("Event System's subscribe() method works", () => {
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
    const eventSystem = EventSystem.getInstance();

    eventSystem.subscribe(EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT, echoHandler);
    eventSystem.unsubscribe(EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT, echoHandler);

    /* eslint-disable dot-notation */
    expect(eventSystem['subscribers'].length).toBe(0);
    /* eslint-enable dot-notation */
  });

  test("Event System's resubscribe logic works", () => {
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
