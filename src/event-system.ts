import { CircularBuffer } from 'mnemonist';
import EventSystemInitError from './errors/event-system-init-error';

/**
 * Enum for the different event types names.
 * @enum {string}
 */
export enum EVENT_SYSTEM_EVENT_NAMES {
  LOG_EVENT = 'log_event',
}

/**
 * Event System Events interface. The interface contains events from the {@link EVENT_SYSTEM_EVENT_NAMES}
 * enum and the function prototype for the event listeners.
 *
 * @interface EventSystemEvents
 */
export interface EventSystemEvents {
  [EVENT_SYSTEM_EVENT_NAMES.LOG_EVENT]: (message: string) => string | void;
}

/**
 * Event System Subscriber interface. The interface contains event from {@link EVENT_SYSTEM_EVENT_NAMES}
 * and the function that will be called when the event is triggered.
 *
 * @interface EventSystemSubscriber
 */
export interface EventSystemSubscriber<K extends EVENT_SYSTEM_EVENT_NAMES> {
  event: K;
  handler: (...args: Parameters<EventSystemEvents[K]>) => void;
}

/**
 * The buffer direction type. Defaults to "FIFO". If set to "LIFO", the buffer will
 * be filled from the end of the buffer. If set to "FIFO", the buffer will be
 * filled from the beginning of the buffer.
 *
 * @type {"FIFO" | "LIFO"}
 * @default "FIFO"
 */
export type EventSystemBufferDirection = 'FIFO' | 'LIFO';

/**
 * Event System init options type.
 *
 * @property {EventSystemBufferDirection} [bufferDirection="FIFO"] - The buffer direction.
 * @property {number} [bufferSize=3] - The buffer size.
 */
export type EventSystemOptions = {
  /**
   * The buffer direction.
   */
  bufferDirection?: EventSystemBufferDirection;
  /**
   * The buffer size.
   */
  bufferSize?: number;
};

const DEFAULT_OPTIONS: Required<EventSystemOptions> = {
  bufferDirection: 'FIFO',
  bufferSize: 3,
};

/**
 * Event System class. The class is used to manage events and trigger their handlers.
 */
export default class EventSystem {
  /**
   * The Event System instance.
   * @type {EventSystem}
   * @private
   */
  private static instance: typeof this.prototype;

  /**
   * The Event System subscribers.
   * @type {EventSystemSubscriber<EVENT_SYSTEM_EVENT_NAMES>[]}
   * @private
   */
  private subscribers: EventSystemSubscriber<EVENT_SYSTEM_EVENT_NAMES>[] = [];

  /**
   * The Event System buffer.
   * @type {Map<EVENT_SYSTEM_EVENT_NAMES, CircularBuffer<Parameters<EventSystemEvents[EVENT_SYSTEM_EVENT_NAMES]>>>}
   * @private
   */
  private readonly buffer: Map<
    EVENT_SYSTEM_EVENT_NAMES,
    CircularBuffer<Parameters<EventSystemEvents[EVENT_SYSTEM_EVENT_NAMES]>>
  > = new Map();

  /**
   * The Event System buffer direction.
   * @type {EventSystemBufferDirection}
   * @private
   */
  private readonly bufferDirection: EventSystemBufferDirection;

  /**
   * The Event System buffer size.
   * @type {number}
   * @private
   */
  private readonly bufferSize: number;

  /**
   * Event System constructor.
   * @param {EventSystemOptions} options
   * @private
   */
  private constructor(options: EventSystemOptions) {
    this.bufferDirection =
      options?.bufferDirection || DEFAULT_OPTIONS.bufferDirection;

    this.bufferSize = options?.bufferSize || DEFAULT_OPTIONS.bufferSize;
  }

  /**
   * Initializes the Event System class.
   * @param {EventSystemOptions} options
   */
  public static init(options?: EventSystemOptions) {
    if (!EventSystem.instance) EventSystem.instance = new EventSystem(options);
  }

  /**
   * Returns the Event System instance.
   */
  public static getInstance() {
    if (!EventSystem.instance)
      throw new EventSystemInitError('Event System class not initialized');

    return EventSystem.instance;
  }

  /**
   * Subscribes handler to be called when the event is triggered.
   * @param {EVENT_SYSTEM_EVENT_NAMES} event The event name.
   * @param {Function} handler The handler function.
   */
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

  /**
   * Unsubscribes the handler from the event.
   * @param {EVENT_SYSTEM_EVENT_NAMES} event The event name.
   * @param {Function} handler The handler function.
   */
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

  /**
   * Triggers the event with the given arguments.
   * @param {EVENT_SYSTEM_EVENT_NAMES} event The event name.
   * @param {Parameters<EventSystemEvents[EVENT_SYSTEM_EVENT_NAMES]>} args The arguments to pass to the handler.
   */
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
