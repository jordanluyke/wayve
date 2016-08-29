import { RandomUtil } from './../util';

export abstract class AppEvent {

    constructor(readonly message: string, readonly id: string = RandomUtil.generateId(), readonly causedAt: Date = new Date()) {
    }
}
