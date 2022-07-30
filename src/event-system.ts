import { CircularBuffer } from 'mnemonist';
import EventSystemInitError from './errors/event-system-init-error';

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

export type EventSystemBufferDirection = 'FIFO' | 'LIFO';

export type EventSystemOptions = {
  bufferDirection?: EventSystemBufferDirection;
  bufferSize?: number;
};

const DEFAULT_OPTIONS: Required<EventSystemOptions> = {
  bufferDirection: 'FIFO',
  bufferSize: 3,
};

export default class EventSystem {
  private static instance: typeof this.prototype;

  private subscribers: EventSystemSubscriber<EVENT_SYSTEM_EVENT_NAMES>[] = [];

  private readonly buffer: Map<
    EVENT_SYSTEM_EVENT_NAMES,
    CircularBuffer<Parameters<EventSystemEvents[EVENT_SYSTEM_EVENT_NAMES]>>
  > = new Map();

  private readonly bufferDirection: EventSystemBufferDirection;

  private constructor(options: EventSystemOptions) {
    this.bufferDirection =
      options.bufferDirection || DEFAULT_OPTIONS.bufferDirection;

    const bufferSize = options.bufferSize || DEFAULT_OPTIONS.bufferSize;

    Object.values(EVENT_SYSTEM_EVENT_NAMES).forEach(
      (v: EVENT_SYSTEM_EVENT_NAMES) => {
        this.buffer.set(v, new CircularBuffer(Array, bufferSize));
      }
    );
  }

  public static init(options?: EventSystemOptions) {
    if (!EventSystem.instance) EventSystem.instance = new EventSystem(options);
  }

  public static getInstance() {
    if (!EventSystem.instance)
      throw new EventSystemInitError('Event System class not initialized');

    return EventSystem.instance;
  }

  public subscribe<K extends EVENT_SYSTEM_EVENT_NAMES>(
    event: K,
    handler: (
      ...args: Parameters<EventSystemEvents[K]>
    ) => ReturnType<EventSystemEvents[K]>
  ) {
    this.subscribers.push({ event, handler });

    this.buffer.get(event).forEach((args: Parameters<EventSystemEvents[K]>) => {
      handler.call(handler, ...args);
    });
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
  ): void {
    this.subscribers.forEach(
      (subscriber: EventSystemSubscriber<EVENT_SYSTEM_EVENT_NAMES>) => {
        if (subscriber.event === event)
          subscriber.handler.call(subscriber.handler, ...args);
      }
    );

    this.buffer
      .get(event)
      [this.bufferDirection === 'FIFO' ? 'push' : 'unshift'](args);
  }
}
