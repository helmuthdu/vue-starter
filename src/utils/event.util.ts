import { Logger } from './logger.util';
import { uuid } from './toolbox.util';

const events: { [event: string]: { [id: string]: (arg?: any) => void } } = {};

const on = (event: string, handler: (arg?: any) => void, options?: { once: boolean }) => {
  const id = uuid();

  if (!events[event]) events[event] = {};

  events[event][id] = options?.once
    ? (arg?: any) => {
        handler(arg);
        stop();
      }
    : handler;

  const stop = () => {
    if (events[event][id]) {
      delete events[event][id];
      if (Object.keys(events[event]).length === 0) delete events[event];
    } else {
      Logger.warn(`Event "${event}" already unsubscribed`);
    }
  };

  return stop;
};

const emit = (event: string, arg?: any) => {
  if (!events[event]) {
    Logger.warn(`Event "${event}" not registered`);
    return;
  }

  Object.entries(events[event]).forEach(([_, handler]) => handler(arg));
};

export const eventuality = {
  on,
  emit
};
