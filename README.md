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
  * [Api](#api)
    * [EventsSystem](#eventssystem)
<!-- TOC -->

## Api

### EventsSystem

| Method                        | Description                                                |
|-------------------------------|------------------------------------------------------------|
| `getInstance()`               | Get an instance of Event System                            |
| `subscribe(event, handler)`   | Subscribe a `handler` to be fired when the `event` happens |
| `unsubscribe(event, handler)` | Unsubscribe `handler` from the `event`                     |
| `notify(event, ...args)`      | Fire an `event` with `args`                                |