import IconBase from './ag-icon-base';

class IconOpenIconic extends IconBase {
    constructor(icons) {
        super('icon-openiconic');
        // Set default CSS class as icon
        Object.assign(this.icons, {
            append: 'plus',
            removeLast: 'minus',
            insert: 'share',
            remove: 'x',
            moveUp: 'chevron-top',
            moveDown: 'chevron-bottom'
        });
        // Override default icons if defined
        if (icons) {
            Object.assign(this.icons, icons);
        }
    }

    generateIcon(container, type) {
        let icon = document.createElement('span');
        icon.className = 'oi';
        icon.dataset.glyph = this.icons[type];
        icon.setAttribute('aria-hidden', 'true');
        container.appendChild(icon);
        return icon;
    }
}

export default IconOpenIconic;