<h1 align="center">
Event System
</h1>

<p align="center">
Event System used for handling events between components
</p>

<p align="center">
<a href="https://github.com/NickSettler/event-system/actions/workflows/npm.yml"><img src="https://github.com/NickSettler/event-system/actions/workflows/npm.yml/badge.svg"></a>
<a href="https://www.npmjs.com/package/events-system"><img alt="npm" src="https://img.shields.io/npm/v/events-system?label=npm%40latest"></a>
<a href="https://github.com/NickSettler/event-system/LICENSE.md"><img alt="GitHub" src="https://img.shields.io/github/license/nicksettler/event-system"></a>
</p>

Event System is a package used for handling different events between parts of code written in Typescript.

<!-- TOC -->
  * [EventsSystem](#eventssystem)
    * [`new EventSystem(options: EventsSystemOptions)`](#new-eventsystemoptions-eventssystemoptions)
    * [`subscribe(event, handler)`](#subscribeevent-handler)
    * [`unsubscribe(event, handler)`](#unsubscribeevent-handler)
    * [`notify(event, ...args)`](#notifyevent-args)
<!-- TOC -->

## EventsSystem

### `new EventSystem(options: EventsSystemOptions)`

Initializes the Event System class.

Parameters: 
* options
  * `bufferDirection` {"FIFO" | "LIFO"} - The direction of the events buffer. Defaults to "FIFO".
  * `bufferSize` {number} - The size of the buffer.

Example:
```typescript
// Initialization without options
const eventSystem = new EventSystem(); // OK ✅

// Initialization with options
const eventSystem = new EventSystem({
  bufferDirection: "LIFO",
  bufferSize: 10
}); // OK ✅
```


### `subscribe(event, handler)`

Subscribes handler to be called when the event is triggered.

Parameters: 
* `event {keyof E}` The event name.
* `handler {Function}` The handler function.

Example:
```typescript
type MyEvents = {
  "event": () => void;
}

const eventSystem = new EventSystem<MyEvents>();

// Subscribe to event
eventSystem.subscribe("event", () => {
  // Do something
});
```

### `unsubscribe(event, handler)`

Unsubscribes the handler from the event.

Parameters:
* `event {keyof E}` The event name.
* `handler {Function}` The handler function.

Example:
```typescript
type MyEvents = {
  "event": () => void;
}

const eventSystem = new EventSystem<MyEvents>();

// Subscribe to event
eventSystem.subscribe("event", () => {
  // Do something
});

// Unsubscribe from event
eventSystem.unsubscribe("event", () => {
  // Do something
});
```

### `notify(event, ...args)`

Triggers the event with the given arguments.

Parameters:
* `event {keyof E}` The event name.
* `args {Parameters<E[keyof E]>}` The arguments to pass to the handler.

Example:
```typescript
type MyEvents = {
  "event": (a: number, b: string) => void;
}

const eventSystem = new EventSystem<MyEvents>();

// Subscribe to event
eventSystem.subscribe("event", (a, b) => {
  // Do something
});

// Trigger event
eventSystem.notify("event", 1, "Hello");
```
