import EventSystem from '../src';
import { EVENT_SYSTEM_EVENT_NAMES } from '../src/event-system';

const emptyHandler = () => {
  // ...
};

describe('Event System initialization', () => {
  test('Event System getInstance() method works', () => {
    expect(EventSystem.getInstance()).toBeInstanceOf(EventSystem);
  });
});

describe('Event System subscription worker', () => {
  test("Event System's subscribe() method works", () => {
    const eventSystem = EventSystem.getInstance();

    eventSystem.subscribe(EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT, emptyHandler);

    /* eslint-disable dot-notation */
    expect(eventSystem['subscribers'].length).toBe(1);
    expect(eventSystem['subscribers'][0].event).toBe(
      EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT
    );
    expect(eventSystem['subscribers'][0].handler).toBe(emptyHandler);
    /* eslint-enable dot-notation */
  });

  test("Event System's unsubscribe() method works", () => {
    const eventSystem = EventSystem.getInstance();

    eventSystem.subscribe(EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT, emptyHandler);
    eventSystem.unsubscribe(EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT, emptyHandler);

    /* eslint-disable dot-notation */
    expect(eventSystem['subscribers'].length).toBe(0);
    /* eslint-enable dot-notation */
  });

  test("Event System's resubscribe logic works", () => {
    const eventSystem = EventSystem.getInstance();

    eventSystem.subscribe(EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT, emptyHandler);
    eventSystem.unsubscribe(EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT, emptyHandler);
    eventSystem.subscribe(EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT, emptyHandler);

    /* eslint-disable dot-notation */
    expect(eventSystem['subscribers'].length).toBe(1);
    expect(eventSystem['subscribers'][0].event).toBe(
      EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT
    );
    expect(eventSystem['subscribers'][0].handler).toBe(emptyHandler);
    /* eslint-enable dot-notation */
  });
});
