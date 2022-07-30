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
    * [init(options: EventsSystemOptions)](#init--options--eventssystemoptions-)
    * [getInstance()](#getinstance--)
    * [subscribe(event, handler)](#subscribe--event-handler-)
    * [unsubscribe(event, handler)](#unsubscribe--event-handler-)
    * [notify(event, ...args)](#notify--event-args-)
<!-- TOC -->

## EventsSystem

### init(options: EventsSystemOptions)

Initializes the Event System class.

Parameters: 
* options
  * `bufferDirection` {"FIFO" | "LIFO"} - The direction of the events buffer. Defaults to "FIFO".
  * `bufferSize` {number} - The size of the buffer.


### getInstance()

Returns the Event System instance.

Returns: `EventSystem`

### subscribe(event, handler)

Subscribes handler to be called when the event is triggered.

Parameters: 
* event {EVENT_SYSTEM_EVENT_NAMES} The event name.
* handler {Function} The handler function.

### unsubscribe(event, handler)

Unsubscribes the handler from the event.

Parameters:
* event {EVENT_SYSTEM_EVENT_NAMES} The event name.
* handler {Function} The handler function.

### notify(event, ...args)

Triggers the event with the given arguments.

Parameters:
* event {EVENT_SYSTEM_EVENT_NAMES} The event name.
* args {Parameters<EventSystemEvents[EVENT_SYSTEM_EVENT_NAMES]>} The arguments to pass to the handler.
