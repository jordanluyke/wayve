import { Injectable } from '@angular/core';
import { Subscription, Subject } from 'rxjs/Rx';
import { AppEvent } from './app-event';
import { Multimap, ArrayListMultimap } from './../util';

/**
 * Event bus
 */

@Injectable()
export class AppBus {

    private subscribers: Multimap<string, Subject<any>> = ArrayListMultimap.create();

    // should be but seems like typescript bug:
    // public addSubscription<T>(event: T, handler: (o: Subject<T>) => Subscription): void {
    //     let subject: Subject<T> = Subject.create();
    //     this.subscribers.put(event.constructor.name, subject);
    //     handler(subject);
    // }

    public addSubscription<T extends AppEvent>(eventName: string, handler: (o: Subject<T>) => Subscription): void {
        // should be but seems like rxjs bug:
        // let subject: Subject<T> = Subject.create();
        let subject: Subject<T> = new Subject<T>();
        this.subscribers.put(eventName, subject);
        handler(subject);
    }

    public publish(event: AppEvent): void {
        this.subscribers.get(event.constructor.name)
            .forEach(subscription => subscription.next(event));
    }
}
