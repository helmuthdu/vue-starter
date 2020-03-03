import { Observable, SchedulerLike } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, pluck, startWith } from 'rxjs/operators';
import { WatchObservable } from 'vue-rx';

interface SearchObservableOptions {
  time?: number;
  scheduler?: SchedulerLike;
  minLength?: number;
}
/**
 * Creates an observable variable to be used with a search input
 * @example
 * debounceValueObservable(this.$watchAsObservable('search'))
 * @param observable
 * @param options
 * @return Observable<string>
 */
export const debounceValueObservable = (
  observable: Observable<WatchObservable<string>>,
  options: SearchObservableOptions = {}
): Observable<string> => {
  const { time = 400, scheduler, minLength = 3 } = options;
  return observable.pipe(
    pluck<WatchObservable<string>, string>('newValue'),
    debounceTime(time, scheduler),
    filter(query => !query || query.length >= minLength || query.length === 0),
    distinctUntilChanged(),
    startWith('')
  );
};
