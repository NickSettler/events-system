import EventSystem from '../src';

describe('Event System initialization', () => {
  test('Event System getInstance() works', () => {
    expect(EventSystem.getInstance()).toBeInstanceOf(EventSystem);
  });
});
