import { onBeforeUnmount } from 'vue';
import { Logger } from './logger.util';
import { uuid } from './toolbox.util';

type Subscription = { stop: () => void };

const events: { [event: string]: { [id: string]: (arg?: any) => void } } = {};

const getEvent = (event: string) => events?.[event];

const getEventById = (event: string, id: string) => events?.[event]?.[id];

const setEvent = (event: string, id: string, fn: any) => {
  if (!getEvent(event)) events[event] = {};
  events[event][id] = fn;
};

const stop = (event: string, id: string) => {
  if (getEventById(event, id)) {
    delete events[event][id];
    if (Object.keys(getEvent(event)).length === 0) delete events[event];
  } else {
    Logger.warn(`Event "${event}" already stopped`);
  }
};

const on = (event: string, fn: (arg?: any) => void): Subscription => {
  const id = uuid();

  setEvent(event, id, fn);

  return { stop: () => stop(event, id) };
};

const once = (event: string, fn: (arg?: any) => void): Subscription => {
  const id = uuid();

  setEvent(event, id, (arg?: any) => {
    fn(arg);
    stop(event, id);
  });

  return { stop: () => stop(event, id) };
};

const off = (event: string) => {
  if (getEvent(event)) {
    delete events[event];
  } else {
    Logger.warn(`All "${event}" events are already removed`);
  }
};

const emit = (event: string, arg?: any) => {
  if (getEvent(event)) {
    Object.entries(getEvent(event)).forEach(([_, fn]) => fn(arg));
  } else {
    Logger.warn(`Event "${event}" not registered`);
  }
};

export const receiver = (event: string, fn: (arg?: any) => void, options?: { once: boolean; immediate: boolean }) => {
  let subscription: Subscription;

  if (options?.once) {
    subscription = once(event, fn);
  } else {
    subscription = on(event, fn);
  }

  if (options?.immediate) {
    fn();
  }

  onBeforeUnmount(() => {
    subscription.stop();
  });
};

export const transmitter = emit;

export const Broadcaster = {
  on,
  once,
  off,
  emit,
};
