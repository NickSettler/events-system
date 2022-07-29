export default class EventSystem {
  private static instance: typeof this.prototype;

  public static getInstance() {
    if (!EventSystem.instance) EventSystem.instance = new EventSystem();

    return EventSystem.instance;
  }
}
