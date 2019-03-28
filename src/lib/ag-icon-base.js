
class IconBase {
	constructor(name, isTextBased = false) {
		// Set name of icon set
		this.name = name;
		// Define icons for different buttons
		this.icons = {
			append: null,
			removeLast: null,
			insert: null,
			remove: null,
			moveUp: null,
			moveDown: null
		};
		// Indicate this icon set is text-based or not
		this.isTextBased = isTextBased;
	}

	generateIcon(container, type) {
		throw `*generateIcon* is not overrided for *${this.name}*.`;
	}
}

export default IconBase;