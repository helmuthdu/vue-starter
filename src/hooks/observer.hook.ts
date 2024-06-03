/*
 * @example
 * const { subject: search$, setSubject: setSearch$ } = useSubject<string>();
 * const search = useObservable(search$.pipe(debounceTime(300), filter(query => !query || query.length >= 3 || query.length === 0), distinctUntilChanged()), '');
 */

import { type Observable, Subject, type Subscription } from 'rxjs';
import { type Ref, onBeforeUnmount, ref } from 'vue';

const useSubscribeTo = <T, E>(
  observable: Observable<T>,
  next?: (value: T) => void,
  error?: (err: E) => void,
  complete?: () => void,
): Subscription => {
  const subscription = observable.subscribe({ next, error, complete });

  onBeforeUnmount(() => {
    subscription.unsubscribe();
  });

  return subscription;
};

export const useSubscription = <T, E>(
  observable: Observable<T>,
  next?: (value: T) => void,
  error?: (err: E) => void,
  complete?: () => void,
): Subscription => useSubscribeTo(observable, next, error, complete);

export const useObservable = <T>(observable: Observable<T>, defaultValue?: T, outRef?: Ref<T>): Ref<T> => {
  if (outRef && defaultValue && !outRef.value) {
    outRef.value = defaultValue;
  }

  const handler = outRef ?? (ref(defaultValue) as Ref<T>);

  useSubscribeTo(
    observable,
    (value) => {
      handler.value = value;
    },
    (error) => {
      throw error;
    },
  );

  return handler;
};

export const useSubject = <T>(): { subject: Subject<T>; setSubject: (value: T) => void } => {
  const subject = new Subject<T>();
  const setSubject = (value: T): void => {
    subject.next(value);
  };

  return { subject, setSubject };
};
