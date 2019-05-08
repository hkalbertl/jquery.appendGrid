import IconBase from './ag-icon-base';

class IconOpenIconic extends IconBase {
    constructor(iconParams) {
        super('icon-openiconic');
        // Prepare default options
        let libParams = {
            icons: null
        };
        Object.assign(libParams, iconParams);
        // Set dataset value as icon
        let icons = {
            append: 'plus',
            removeLast: 'minus',
            insert: 'share',
            remove: 'x',
            moveUp: 'chevron-top',
            moveDown: 'chevron-bottom'
        };
        // Override default icons if defined
        if (libParams.icons) {
            Object.assign(icons, libParams.icons);
        }
        this.icons = icons;
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