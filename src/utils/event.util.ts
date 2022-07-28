import { Logger } from './logger.util';
import { uuid } from './toolbox.util';

const events: { [event: string]: { [id: string]: (arg: unknown) => void } } = {};

const on = (name: string, fn: (arg: unknown) => void, options?: { once: boolean }) => {
  const id = uuid();

  if (!events[name]) events[name] = {};

  events[name][id] = options?.once
    ? (arg: unknown) => {
        fn(arg);
        stop();
      }
    : fn;

  const stop = () => {
    if (events[name][id]) {
      delete events[name][id];
      if (Object.keys(events[name]).length === 0) delete events[name];
    } else {
      Logger.warn(`Event "${name}" already unsubscribed`);
    }
  };

  return stop;
};

const emit = (name: string, arg: unknown) => {
  if (!events[name]) {
    Logger.warn(`Event "${name}" not registered`);
    return;
  }

  Object.entries(events[name]).forEach(([_, fn]) => fn(arg));
};

export const eventuality = {
  on,
  emit
};
