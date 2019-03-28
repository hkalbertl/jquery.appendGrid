import IconBase from './ag-icon-base';

class IconDefault extends IconBase {
    constructor(icons) {
        super('icon-default', true);
        // Set default text as icon
        Object.assign(this.icons, {
            append: '\uff0b',
            removeLast: '\uff0d',
            insert: '\u219c',
            remove: '\u2715',
            moveUp: '\u25b2',
            moveDown: '\u25bc'
        });
        // Override default icons if defined
        if (icons) {
            Object.assign(this.icons, icons);
        }
    }

    generateIcon(container, type) {
        let label = document.createTextNode(this.icons[type] || '');
        container.appendChild(label);
        return label;
    }
}

export default IconDefault;