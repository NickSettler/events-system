export default class EventSystemInitError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'EventSystemInitError';

    Object.setPrototypeOf(this, EventSystemInitError.prototype);
  }
}
