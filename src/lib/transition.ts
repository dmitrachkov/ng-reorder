/**
 * Returns time of a transition of a speciphic property in miliseconds.
 * @param element DOM element to check
 * @param property required CSS property
 * @param includeAll include or not the "all" property. By default true
 */
export function transitionTimeOf(element: HTMLElement, property: string, includeAll: boolean = true) {

	const style = getComputedStyle(element);

	const properties = style.transitionProperty.split(',');

	// filter for the 'all' property
	const target = ($) => {
		if (includeAll) { return $ === property || $ === 'all'; } else { return $ === property; }
	};

	const foundProperty = properties.find(target);
	// If no fouded property returns zero
	if (!foundProperty) {
		return 0;
	}

	const index = properties.indexOf(foundProperty);
	let delay: number | string = style.transitionDelay.split(',')[index];
	let duration: number | string = style.transitionDuration.split(',')[index];

	// Destructuring assignment.
	// Next lines check whether the values in ms and return parsed time in ms
	[delay, duration] = [delay, duration].map($ => {
		const k = $.toLowerCase().indexOf('ms') !== -1 ? 1 : 1000;
		return parseFloat($) * k;
	});
	return delay + duration;
}
