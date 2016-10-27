import { Component, OnInit } from '@angular/core';
import { ToneEntry } from './tone_entry/tone-entry';
import { Observable, Subscription } from 'rxjs/Rx';
import { ToneEndedEvent, ToneRemovedEvent, ToneAddedEvent } from './tone_entry/events/index';
import { AppBus } from './../app_bus/app-bus';
import { Multimap, ArrayListMultimap, MathUtil } from './../util/index';
import { ActivatedRoute } from '@angular/router';

@Component({
    providers: [AppBus],
    selector: 'tone-list-component',
    styleUrls: ['./app/tone_list/tone-list.css'],
    templateUrl: './app/tone_list/tone-list.html'
})
export class ToneListComponent implements OnInit {

    private audioContext: AudioContext = new AudioContext();

    public entries: Array<ToneEntry> = [];
    public isPlaying: boolean = false;
    public elapsed: number = 0;
    private elapsedSubscription: Subscription;

    constructor(private appBus: AppBus, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.addEntry(true);
        this.addSubscriptions();
        this.route.queryParams.subscribe(
            params => {
                if(params["entries"] != null) {
                    try {
                        let entries = JSON.parse(params["entries"]);
                        this.entries = [];
                        this.addEntriesFromQueryParam(entries);
                    } catch(err) {
                        console.log(params["entries"]);
                        throw new Error("Unable to parse entries");
                    }
                }
                if(params["start"] == "true")
                    this.startAll();
            }
        );
    }

    public addEntry(temp: boolean = false): void {
        let entry = new ToneEntry();
        entry.temp = temp;
        this.entries.push(entry);
    }

    public removeEntry(id: string): void {
        this.entries = this.entries.filter(entry => entry.id != id);
    }

    public startAll(): void {
        if(this.isPlaying)
            throw new Error("List is already playing");

        this.entries = this.entries.filter(entry => !entry.temp);

        Observable.from(this.entries)
            .flatMap(entry => entry.start(this.audioContext))
            .subscribe(
                Void => {},
                err => {
                    throw new Error(err);
                },
                () => {
                    this.isPlaying = true;
                    this.elapsed = 0;
                    this.elapsedSubscription = Observable.interval(100)
                        .timeInterval()
                        .subscribe(
                            time => {
                                this.elapsed += time.interval;
                            },
                            err => {
                                throw new Error(err);
                            }
                        );
                }
            );
    }

    public stopAll(): void {
        Observable.from(this.entries)
            .flatMap(entry => entry.stop())
            .subscribe(
                Void => {},
                err => {
                    throw new Error(err);
                },
                () => {
                    this.elapsedSubscription.unsubscribe();
                    this.isPlaying = false;
                    this.addEntry(true);
                    // time elapsed sometimes slightly off
                    if(MathUtil.numberWithinPercentOfMod(this.elapsed, 1000, 10))
                        this.elapsed = Math.round(this.elapsed / 1000) * 1000;
                }
            );
    }

    public entriesValid(): Observable<boolean> {
        return Observable.from(this.entries)
            .filter(entry => !entry.temp)
            .defaultIfEmpty(null)
            .every(entry => {
                if(entry == null)
                    return false;
                return entry.validate();
            });
    }

    private addSubscriptions(): void {
        this.appBus.addSubscription(ToneEndedEvent.name, o => o
            .subscribe(
                event => {
                    if(this.entries.every(entry => entry.ended))
                        this.stopAll();
                },
                err => {
                    throw new Error(err);
                }
            )
        );

        this.appBus.addSubscription<ToneRemovedEvent>(ToneRemovedEvent.name, o => o
            .subscribe(
                event => this.removeEntry(event.toneEntry.id),
                err => {
                    throw new Error(err);
                }
            )
        );

        this.appBus.addSubscription(ToneAddedEvent.name, o => o
            .subscribe(
                event => this.addEntry(true),
                err => {
                    throw new Error(err);
                }
            )
        );
    }

    private addEntriesFromQueryParam(entries: any[]): void {
        Observable.from(entries)
            .map(input => {
                let entry = new ToneEntry();
                for(let key in input) {
                    entry.frequency = input["frequency"];
                }
                return entry;
            })
            .subscribe(
                entry => this.entries.push(entry)
            );
    }
}
