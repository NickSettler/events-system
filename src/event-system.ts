import { CircularBuffer } from 'mnemonist';

/**
 * Event System Subscriber interface. The interface contains event from {@link EVENT_SYSTEM_EVENT_NAMES}
 * and the function that will be called when the event is triggered.
 *
 * @interface EventSystemSubscriber
 */
export interface EventSystemSubscriber<
  E extends Record<
    string,
    (...args: Parameters<E[keyof E]>) => ReturnType<E[keyof E]>
  >,
  K extends keyof E
> {
  event: K;
  handler: (...args: Parameters<E[K]>) => void;
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
export default class EventSystem<
  E extends Record<
    string,
    (...args: Parameters<E[keyof E]>) => ReturnType<E[keyof E]>
  >
> {
  /**
   * The Event System subscribers.
   * @type {EventSystemSubscriber<E, keyof E>[]}
   * @private
   */
  private subscribers: EventSystemSubscriber<E, keyof E>[] = [];

  /**
   * The Event System buffer.
   * @type {Map<keyof E, CircularBuffer<Parameters<E[keyof E]>>>}
   * @private
   */
  private readonly buffer: Map<
    keyof E,
    CircularBuffer<Parameters<E[keyof E]>>
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
  constructor(options?: EventSystemOptions) {
    this.bufferDirection =
      options?.bufferDirection || DEFAULT_OPTIONS.bufferDirection;

    this.bufferSize = options?.bufferSize || DEFAULT_OPTIONS.bufferSize;
  }

  /**
   * Subscribes handler to be called when the event is triggered.
   * @param {K extends keyof E & string} event The event name.
   * @param {(...args: Parameters<E[keyof E]>) => ReturnType<E[keyof E]>} handler The handler function.
   */
  public subscribe<K extends keyof E & string>(
    event: K,
    handler: (...args: Parameters<E[K]>) => ReturnType<E[K]>
  ) {
    this.subscribers.push({ event, handler });

    if (this.buffer.has(event))
      this.buffer.get(event).forEach((args: Parameters<E[K]>) => {
        handler.call(handler, ...args);
      });
  }

  /**
   * Unsubscribes the handler from the event.
   * @param {K extends keyof E & string} event The event name.
   * @param {(...args: Parameters<E[keyof E]>) => ReturnType<E[keyof E]>} handler The handler function.
   */
  public unsubscribe<K extends keyof E & string>(
    event: K,
    handler: (...args: Parameters<E[K]>) => ReturnType<E[K]>
  ) {
    this.subscribers = this.subscribers.filter(
      (subscriber: EventSystemSubscriber<E, K>) =>
        subscriber.event !== event || subscriber.handler !== handler
    );
  }

  /**
   * Triggers the event with the given arguments.
   * @param {K extends keyof E & string} event The event name.
   * @param {Parameters<EventSystemEvents[keyof E]>} args The arguments to pass to the handler.
   */
  public notify<K extends keyof E & string>(
    event: K,
    ...args: Parameters<E[K]>
  ) {
    this.subscribers.forEach((subscriber: EventSystemSubscriber<E, K>) => {
      if (subscriber.event === event)
        subscriber.handler.call(subscriber.handler, ...args);
    });

    if (!this.buffer.has(event))
      this.buffer.set(event, new CircularBuffer(Array, this.bufferSize));

    this.buffer
      .get(event)
      [this.bufferDirection === 'FIFO' ? 'push' : 'unshift'](args);
  }
}
