/**
 * @param array array to reorder
 * @param begin the index which is moving in the array
 * @param end the index where the array[begin] is moving to
 */
export function reorderItems<T = any>(array: T[], begin: number, end: number): T[] {

    if (array.length === 0) {
        return;
    }

    begin = fit(begin, array.length - 1);

    end = fit(end, array.length - 1);

    if (begin === end || end === -1 || begin === -1) {
        return array;
    }

    const shift = begin < end ? 1 : -1;
    const anchor = array[begin];

    for (let i = begin; i !== end; i += shift) {
        array[i] = array[i + shift];
    }

    array[end] = anchor;

    return array;
}

/**
 * @param array array to reorder
 * @param a the index of first element
 * @param b the index of second element
 */
export function swapItems<T = any>(array: T[], a: number, b: number): T[] {
    [array[a], array[b]] = [array[b], array[a]];
    return array;
}

/** To ensure to get a number not less than zero and not greater than a given max value
 * @param value number to check
 * @param max max value
 */
export function fit(value: number, max: number): number {
    if (isNaN(value) || value === null) {
        return -1;
    }
    return Math.max(0, Math.min(value, max));
}

/** Whether the event is touch or not */
export function isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
    return event.type[0] === 't';
}
