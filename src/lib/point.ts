import { Point } from './interfaces';
import { isTouchEvent } from './utils';

/** Returns { 0, 0 } point */
export function createPoint() {
    return { x: 0, y: 0 } as Point;
}

/**
 * Returns the sum of two points
 * @param first first point
 * @param second second point
 */
export function pointSum(first: Point, second: Point) {
    return {
        x: first.x + second.x,
        y: first.y + second.y
    } as Point;
}

/**
 * Returns the difference between two points
 * @param first first point
 * @param second second point
 */
export function pointDif(first: Point, second: Point) {
    return {
        x: first.x - second.x,
        y: first.y - second.y
    } as Point;
}

/**
 * Returns point from pointer event
 * @param event Mouse or Touch event
 */
export function pointFromPointerEvent(event: MouseEvent | TouchEvent) {
    const $ = isTouchEvent(event) ? event.targetTouches[0] : event;
    return {
        x: $.clientX,
        y: $.clientY
    } as Point;
}
