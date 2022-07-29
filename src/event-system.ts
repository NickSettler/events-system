export enum EVENT_SYSTEM_EVENT_NAMES {
  LOG_EVENT = 'log_event',
}

export interface EventSystemEvents {
  [EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT]: (message: string) => string | void;
}

export interface EventSystemSubscriber<K extends EVENT_SYSTEM_EVENT_NAMES> {
  event: K;
  handler: (...args: Parameters<EventSystemEvents[K]>) => void;
}

export default class EventSystem {
  private static instance: typeof this.prototype;

  private subscribers: EventSystemSubscriber<EVENT_SYSTEM_EVENT_NAMES>[] = [];

  public static getInstance() {
    if (!EventSystem.instance) EventSystem.instance = new EventSystem();

    return EventSystem.instance;
  }

  public subscribe<K extends EVENT_SYSTEM_EVENT_NAMES>(
    event: K,
    handler: (
      ...args: Parameters<EventSystemEvents[K]>
    ) => ReturnType<EventSystemEvents[K]>
  ) {
    this.subscribers.push({ event, handler });
  }

  public unsubscribe<K extends EVENT_SYSTEM_EVENT_NAMES>(
    event: K,
    handler: (
      ...args: Parameters<EventSystemEvents[K]>
    ) => ReturnType<EventSystemEvents[K]>
  ) {
    this.subscribers = this.subscribers.filter(
      (subscriber: EventSystemSubscriber<EVENT_SYSTEM_EVENT_NAMES>) =>
        subscriber.event !== event || subscriber.handler !== handler
    );
  }

  public notify<K extends EVENT_SYSTEM_EVENT_NAMES>(
    event: K,
    ...args: Parameters<EventSystemEvents[K]>
  ): ReturnType<EventSystemEvents[K]> {
    const handler = this.subscribers.find(
      (subscriber: EventSystemSubscriber<EVENT_SYSTEM_EVENT_NAMES>) =>
        subscriber.event === event
    );

    if (handler) return handler.handler.call(handler.handler, ...args);
  }
}
