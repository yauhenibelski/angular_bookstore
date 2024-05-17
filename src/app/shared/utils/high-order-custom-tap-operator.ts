/* eslint-disable rxjs/no-nested-subscribe */
import { MonoTypeOperatorFunction, Observable, Subscription } from 'rxjs';

export function highOrderCustomTap<T>(proxy: Observable<unknown>): MonoTypeOperatorFunction<T> {
    return (source$: Observable<T>) =>
        new Observable<T>(subscriber => {
            const allSubscriptions = new Subscription();

            const parentSubscription = source$.subscribe(value => {
                const secondarySubscription = proxy.subscribe({
                    next: () => {
                        subscriber.next(value);
                    },
                    complete: () => {
                        subscriber.complete();
                    },
                    error: (err: unknown) => {
                        subscriber.error(err);
                    },
                });

                allSubscriptions.add(secondarySubscription);
            });

            allSubscriptions.add(parentSubscription);

            return () => {
                allSubscriptions.unsubscribe();
            };
        });
}
