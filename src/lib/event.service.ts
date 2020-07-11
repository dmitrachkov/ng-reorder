import { Injectable, Inject, NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';

@Injectable()
export class EventService {

    readonly move = new Subject<MouseEvent | TouchEvent>();

    readonly up = new Subject<MouseEvent | TouchEvent>();

    readonly scroll = new Subject<Event>();

    private _globalListeners = new Map<string, {
        func: (event) => void,
        options: AddEventListenerOptions | boolean;
    }>();

    constructor(
        @Inject(DOCUMENT) private _document: HTMLElement,
        private _zone: NgZone
    ) {
    }

    public applyGlobalListeners(event: MouseEvent | TouchEvent) {
        const isMouse = event.type.startsWith('mouse');
        const moveEvent = isMouse ? 'mousemove' : 'touchmove';
        const endEvent = isMouse ? 'mouseup' : 'touchend';

        this._globalListeners
            .set(
                'scroll', {
                    func: (e: Event) => {
                        this.scroll.next(e);
                    },
                    options: true
            })
            .set(
                'selectstart', {
                    func: (e: Event) => {
                        e.preventDefault();
                    },
                    options: false
            })
            .set(
                moveEvent, {
                    func: (e: Event) => {
                        this.move.next(e as MouseEvent | TouchEvent);
                        e.preventDefault();
                    },
                    options: { passive: false }
            })
            .set(
                endEvent, {
                    func: e => {
                        this.up.next(e as MouseEvent | TouchEvent);
                    },
                    options: true
            });

        this._zone.runOutsideAngular(() => {
            this._globalListeners.forEach((handler, e) => {
                this._document.addEventListener(e, handler.func, handler.options);
            });
        });
    }

    removeGlobalListeners() {
        this._zone.runOutsideAngular(() => {
            this._globalListeners.forEach((handler, event) => {
                this._document.removeEventListener(event, handler.func, handler.options);
            });
        });
    }
}
