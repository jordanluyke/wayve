import { Observable, Subscription, Subject } from 'rxjs/Rx';
import { TimeUnit, RandomUtil } from './../../util/index';
import { ToneEndedEvent } from './events/index';

export class ToneEntry {

    private audioNodes: Array<any> = [];
    private toneEndedSubscription: Subscription;

    readonly id: string = RandomUtil.generateId();

    public frequency: string = "";
    public delayAmount: string = "";
    public delayUnit: TimeUnit = TimeUnit.SECONDS;
    public durationAmount: string = "";
    public durationUnit: TimeUnit = TimeUnit.SECONDS;
    public oscillationType: string = "sine";
    public volume: string = "100";
    public pan: string = "0";
    public started: boolean = false;
    public ended: boolean = false;
    public temp: boolean = false;
    public onEnded: Subject<{}> = new Subject<{}>();

    constructor() {
    }

    public start(audioContext: AudioContext): Observable<{}> {
        this.started = true;
        this.ended = false;

        let oscillatorNode = this.setupOscillatorNode(audioContext);
        let gainNode = this.setupGainNode(audioContext);
        let panNode = this.setupPanNode(audioContext);

        this.toneEndedSubscription = Observable.fromEvent(oscillatorNode, "ended")
            .subscribe(
                event => {
                    this.ended = true;
                    this.onEnded.next(null);
                },
                err => {
                    throw new Error(err);
                }
            );

        oscillatorNode.connect(gainNode);
        gainNode.connect(panNode);
        panNode.connect(audioContext.destination);

        this.audioNodes.push(oscillatorNode);
        this.audioNodes.push(gainNode);
        this.audioNodes.push(panNode);

        return Observable.empty();
    }

    public stop(): Observable<{}> {
        return Observable.from(this.audioNodes)
            .flatMap(node => {
                if(node.constructor.name == OscillatorNode.name)
                    node.stop();
                node.disconnect();
                return Observable.empty();
            })
            .defaultIfEmpty(null)
            .do(Void => {
                this.toneEndedSubscription.unsubscribe()
                this.audioNodes = [];
                this.started = false;
            });
    }

    public validate(): boolean {
        return !!Number(this.frequency) &&
            (this.delayAmount ? !!Number(this.delayAmount) : true) &&
            (this.durationAmount ? !!Number(this.durationAmount) : true);
    }

    private setupOscillatorNode(audioContext: AudioContext): OscillatorNode {
        let oscillatorNode = audioContext.createOscillator();
        oscillatorNode.type = this.oscillationType;
        oscillatorNode.frequency.value = Number(this.frequency);
        oscillatorNode.start(audioContext.currentTime + this.delayUnit.toSeconds(Number(this.delayAmount)));
        if(Number(this.durationAmount) > 0)
            oscillatorNode.stop(audioContext.currentTime + this.delayUnit.toSeconds(Number(this.delayAmount)) + this.durationUnit.toSeconds(Number(this.durationAmount)));
        return oscillatorNode;
    }

    private setupGainNode(audioContext: AudioContext): GainNode {
        let gainNode = audioContext.createGain();
        gainNode.gain.value = Number(this.volume) / 100;
        return gainNode;
    }

    private setupPanNode(audioContext: AudioContext): StereoPannerNode {
        let panNode = audioContext.createStereoPanner();
        panNode.pan.value = Number(this.pan);
        return panNode;
    }
}
