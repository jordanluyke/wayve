import { RandomUtil } from './../util/index';

export abstract class AppEvent {

    constructor(readonly message: string, readonly id: string = RandomUtil.generateId(), readonly causedAt: Date = new Date()) {
    }
}
