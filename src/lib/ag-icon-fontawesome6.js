import * as Util from './ag-util';
import IconBase from './ag-icon-base';

class IconFontAwesome6 extends IconBase {
    constructor(iconParams) {
        super('icon-fontawesome6');
        // Prepare default options
        let libParams = {
            icons: null
        };
        Object.assign(libParams, iconParams);
        // Set default CSS class as icon
        let icons = {
            append: 'fa-solid fa-plus',
            removeLast: 'fa-solid fa-minus',
            insert: 'fa-solid fa-reply',
            remove: 'fa-solid fa-times',
            moveUp: 'fa-solid fa-angle-up',
            moveDown: 'fa-solid fa-angle-down'
        };
        // Override default icons if defined
        if (libParams.icons) {
            Object.assign(icons, libParams.icons);
        }
        this.icons = icons;
    }

    generateIcon(container, type) {
        let icon = document.createElement('i');
        Util.applyClasses(icon, this.icons[type]);
        container.appendChild(icon);
        return icon;
    }
}

export default IconFontAwesome6;