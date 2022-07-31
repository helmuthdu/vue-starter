import { Logger } from './logger.util';
import { uuid } from './toolbox.util';

const events: { [event: string]: { [id: string]: (arg?: any) => void } } = {};

const getAll = (event: string) => events?.[event];

const get = (event: string, id: string) => events?.[event]?.[id];

const set = (event: string, id: string, fn: any) => {
  if (!getAll(event)) events[event] = {};
  events[event][id] = fn;
};

const stop = (event: string, id: string) => {
  if (get(event, id)) {
    delete events[event][id];
    if (Object.keys(getAll(event)).length === 0) delete events[event];
  } else {
    Logger.warn(`Event "${event}" already stopped`);
  }
};

const on = (event: string, fn: (arg?: any) => void) => {
  const id = uuid();

  set(event, id, fn);

  return { stop: () => stop(event, id) };
};

const once = (event: string, fn: (arg?: any) => void) => {
  const id = uuid();

  set(event, id, (arg?: any) => {
    fn(arg);
    stop(event, id);
  });

  return { stop: () => stop(event, id) };
};

const off = (event: string) => {
  if (getAll(event)) {
    delete events[event];
  } else {
    Logger.warn(`All "${event}" events are already removed`);
  }
};

const emit = (event: string, arg?: any) => {
  if (!events || !events[event]) {
    Logger.warn(`Event "${event}" not registered`);
    return;
  }

  Object.entries(getAll(event)).forEach(([_, fn]) => fn(arg));
};

export const Emitter = {
  on,
  once,
  off,
  emit
};
