
// Add CSS class(es) to specified HTML element
export function applyClasses(element, ...classNames) {
	// Check class names defined
	if (classNames && classNames.length) {
		// Process on each set of class names
		classNames.forEach(function (item) {
			// Split class names
			if (item) {
				let classes = item.split(/\s+/gi);
				if (classes && classes.length) {
					classes.forEach(function (value) {
						// Add classes when not empty
						if (value) element.classList.add(value);
					});
				}
			}
		});
	}
}

export function isEmpty(value) {
	return value === undefined || value === null;
}

export function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

export function isPlainObject(obj) {
	return Object.prototype.toString.call(obj) === '[object Object]';
};

export function createElem(tagName, id = null, name = null, classes = null, type = null) {
	let element = document.createElement(tagName);
	if (id) element.id = id;
	if (name) element.name = name;
	if (classes) applyClasses(element, classes);
	if (type) element.type = type;
	return element;
}