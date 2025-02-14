import { onBeforeUnmount } from 'vue';
import { Logger } from './logger.util';
import { uuid } from './toolbox.util';

type Subscription = { stop: () => void };

const events = new Map<string, Map<string, (...args: unknown[]) => void>>();

const getEvent = (event: string) => events.get(event);

const setEvent = (event: string, id: string, fn: (...args: unknown[]) => void) => {
  if (!events.has(event)) {
    events.set(event, new Map());
  }

  events.get(event)?.set(id, fn);
};

const removeEvent = (event: string, id: string) => {
  const eventMap = getEvent(event);

  if (eventMap) {
    eventMap.delete(id);

    if (eventMap.size === 0) events.delete(event);
  }
};

/**
 * Broadcaster object for managing event subscriptions and emissions.
 *
 * @example
 *
 * const sub = Broadcaster.on('test', (msg) => console.log('Received:', msg)); // Subscribe to an event
 * Broadcaster.emit('test', 'Hello, world!'); // Logs: Received: Hello, world!
 * sub.stop(); // Unsubscribes
 */
export const Broadcaster = {
  /**
   * Subscribes to an event.
   * @param {string} event - The event name.
   * @param {function} fn - The callback function to execute when the event is emitted.
   * @returns {Subscription} - The subscription object with a stop method to unsubscribe.
   */
  on(event: string, fn: (...args: unknown[]) => void): Subscription {
    const id = uuid();
    setEvent(event, id, fn);
    return { stop: () => removeEvent(event, id) };
  },

  /**
   * Subscribes to an event to be called only once.
   * @param {string} event - The event name.
   * @param {function} fn - The callback function to execute when the event is emitted.
   * @returns {Subscription} - The subscription object with a stop method to unsubscribe.
   */
  once(event: string, fn: (...args: unknown[]) => Promise<void> | void): Subscription {
    const id = uuid();
    setEvent(event, id, async (...args: unknown[]) => {
      await fn(...args);
      removeEvent(event, id);
    });
    return { stop: () => removeEvent(event, id) };
  },

  /**
   * Unsubscribes from an event.
   * @param {string} event - The event name.
   */
  off(event: string) {
    if (events.has(event)) {
      events.delete(event);
    } else {
      Logger.warn(`All "${event}" events are already removed`);
    }
  },

  /**
   * Emits an event, calling all listeners in sequence (awaiting async functions).
   * @param {string} event - The event name.
   * @param {...unknown[]} args - The arguments to pass to the callback functions.
   */
  async emit(event: string, ...args: unknown[]) {
    const eventMap = getEvent(event);
    if (eventMap) {
      for (const fn of eventMap.values()) {
        await fn(...args);
      }
    } else {
      Logger.warn(`Event "${event}" not registered`);
    }
  },
};

/**
 * Hook for subscribing to an event.
 *
 * @example
 *
 * receiver('asyncEvent', async (msg) => {
 *   await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay
 *   console.log('Async event received:', msg);
 * });
 * transmitter('asyncEvent', 'Hello, Async!'); // Logs: (await 2s) -> 'Async event received: Hello, Async!'
 *
 * @param {string} event - The event name.
 * @param {function} fn - The callback function to execute when the event is emitted.
 * @param {{ once?: boolean; immediate?: boolean }} [options] - The subscription options.
 *
 */
export const receiver = (
  event: string,
  fn: (...args: unknown[]) => void,
  options?: { once?: boolean; immediate?: boolean },
) => {
  const subscription = options?.once ? Broadcaster.once(event, fn) : Broadcaster.on(event, fn);

  if (options?.immediate) fn();

  onBeforeUnmount(() => {
    subscription.stop();
  });
};

/**
 * Alias for emitting events.
 *
 * @example
 *
 * receiver('syncEvent', (msg) => console.log('Sync event received:', msg), { once: true });
 * transmitter('syncEvent', 'Hello, Sync!'); // Logs: Sync event received: Hello, Sync!
 *
 * @param {string} event - The event name.
 * @param {...unknown[]} args - The arguments to pass to the callback functions.
 *
 */
export const transmitter = Broadcaster.emit;
