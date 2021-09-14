/*
 * @example
 * const { subject: search$, setSubject: setSearch$ } = useSubject<string>();
 * const search = useObservable(search$.pipe(debounceTime(300), filter(query => !query || query.length >= 3 || query.length === 0), distinctUntilChanged()), '');
 */

import { onBeforeUnmount, Ref, ref } from 'vue';
import { Observable, Subject, Subscription } from 'rxjs';

const useSubscribeTo = <T>(
  observable: Observable<T>,
  next?: (value: T) => void,
  error?: (err: any) => void,
  complete?: () => void
): Subscription => {
  const subscription = observable.subscribe({ next, error, complete });
  onBeforeUnmount(() => {
    subscription.unsubscribe();
  });

  return subscription;
};

export const useObservable = <T>(observable: Observable<T>, defaultValue?: T): Ref<T> => {
  const handler = ref(defaultValue) as Ref<T>;
  useSubscribeTo(
    observable,
    value => {
      handler.value = value;
    },
    error => {
      throw error;
    }
  );

  return handler;
};

export const useSubscription = <T>(
  observable: Observable<T>,
  next?: (value: T) => void,
  error?: (err: any) => void,
  complete?: () => void
): Subscription => useSubscribeTo(observable, next, error, complete);

export const useSubject = <T>(): { subject: Subject<T>; setSubject: (value: T) => void } => {
  const subject = new Subject<T>();
  const setSubject = (value: T): void => {
    subject.next(value);
  };
  return { subject, setSubject };
};
