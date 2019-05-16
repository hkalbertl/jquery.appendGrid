import * as Util from './ag-util';

class UiBase {
	constructor(i18n, iconFramework) {
		// Save options
		this.i18n = i18n;
		this.iconFramework = iconFramework;
		this.sectionClasses = {
			table: null,
			thead: null,
			theadRow: null,
			theadCell: null,
			tbody: null,
			tbodyRow: null,
			tbodyCell: null,
			tfoot: null,
			tfootRow: null,
			tfootCell: null,
			first: null,
			last: null,
			control: null,
			button: null,
			buttonGroup: null,
			append: null,
			removeLast: null,
			insert: null,
			remove: null,
			moveUp: null,
			moveDown: null,
			empty: null
		};
		// Check methods defined
		/*
		['createButton'].forEach(function (name) {
			if (this[name] === undefined) {
				throw `Method *${name}* is not defined.`;
			}
		});
		*/
	}

	applySectionClasses(classes) {
		for (let key in this.sectionClasses) {
			if (classes[key]) {
				if (this.sectionClasses[key]) {
					this.sectionClasses[key] += ' ' + classes[key];
				} else {
					this.sectionClasses[key] = classes[key];
				}
			}
		}
	}

	getSectionClasses(section) {
		return this.sectionClasses[section];
	}

	createButtonGroup() {
		return null;
	}

	generateButton(holder, type, buttonId) {
		// Create the button
		let button = Util.createElem('button', buttonId, null, null, 'button');
		button.title = this.i18n[type];
		Util.applyClasses(button,
			this.getSectionClasses('button'),
			this.getSectionClasses(type));
		holder.appendChild(button);
		// Create related icon and append to button
		this.iconFramework.generateIcon(button, type);
		// Return generated button
		return button;
	}

	generateControl(ctrlHolder, columnOpt, ctrlId, ctrlName) {
		let ctrl = null;
		if (columnOpt.type === 'select') {
			ctrl = Util.createElem('select', ctrlId, ctrlName);
			// Build option list
			if (Array.isArray(columnOpt.ctrlOptions)) {
				// For array type option list
				if (columnOpt.ctrlOptions.length > 0) {
					if (Util.isPlainObject(columnOpt.ctrlOptions[0])) {
						// Check to generate optGroup or not
						let lastGroupName = null, lastGroupElem = null;
						for (let x = 0; x < columnOpt.ctrlOptions.length; x++) {
							if (!Util.isEmpty(columnOpt.ctrlOptions[x].group)) {
								if (lastGroupName !== columnOpt.ctrlOptions[x].group) {
									lastGroupName = columnOpt.ctrlOptions[x].group;
									lastGroupElem = Util.createElem('optgroup');
									lastGroupElem.label = lastGroupName;
									ctrl.appendChild(lastGroupElem);
								}
							} else {
								lastGroupElem = null;
							}
							let option = Util.createElem('option');
							option.value = columnOpt.ctrlOptions[x].value;
							option.innerText = columnOpt.ctrlOptions[x].label;
							if (!Util.isEmpty(columnOpt.ctrlOptions[x].title)) {
								option.setAttribute('title', columnOpt.ctrlOptions[x].title);
							}
							if (null === lastGroupElem) {
								option.appendTo(ctrl);
							}
							else {
								option.appendTo(lastGroupElem);
							}
						}
					}
					else {
						// Array of values
						for (let x = 0; x < columnOpt.ctrlOptions.length; x++) {
							let opValue = columnOpt.ctrlOptions[x];
							ctrl.options[ctrl.options.length] = new Option(opValue, opValue);
						}
					}
				}
			} else if (Util.isPlainObject(columnOpt.ctrlOptions)) {
				// For plain object type option list
				for (let x in columnOpt.ctrlOptions) {
					ctrl.options[ctrl.options.length] = new Option(columnOpt.ctrlOptions[x], x);
				}
			} else if (typeof (columnOpt.ctrlOptions) === 'string') {
				// For string type option list
				let arrayOpt = columnOpt.ctrlOptions.split(';');
				for (let x = 0; x < arrayOpt.length; x++) {
					let eqIndex = arrayOpt[x].indexOf(':');
					if (-1 === eqIndex) {
						ctrl.options[ctrl.options.length] = new Option(arrayOpt[x], arrayOpt[x]);
					} else {
						ctrl.options[ctrl.options.length] = new Option(arrayOpt[x].substring(eqIndex + 1, arrayOpt[x].length), arrayOpt[x].substring(0, eqIndex));
					}
				}
			} else if (typeof (columnOpt.ctrlOptions) === 'function') {
				// Create options by using custom functions
				columnOpt.ctrlOptions(ctrl);
			}
		}
		else if (columnOpt.type === 'checkbox') {
			ctrl = Util.createElem('input', ctrlId, ctrlName, null, 'checkbox');
			ctrl.value = 1;
			// ctrlHolder.style.textAlign = 'center';
		}
		else if (columnOpt.type === 'textarea') {
			ctrl = Util.createElem('textarea', ctrlId, ctrlName);
		}
		else if (-1 != columnOpt.type.search(/^(color|date|datetime|datetime\-local|email|month|number|range|search|tel|time|url|week)$/)) {
			ctrl = Util.createElem('input', ctrlId, ctrlName);
			try {
				ctrl.type = columnOpt.type;
			}
			catch (err) { /* Not supported type */ }
		}
		else {
			// Generate text input
			ctrl = Util.createElem('input', ctrlId, ctrlName);
			ctrl.type = 'text';
		}
		// Apply classes
		Util.applyClasses(ctrl, this.getSectionClasses('control'), columnOpt.ctrlClass);
		// Append to holder
		if (ctrlHolder) ctrlHolder.appendChild(ctrl);
		return ctrl;
	}
}

export default UiBase;