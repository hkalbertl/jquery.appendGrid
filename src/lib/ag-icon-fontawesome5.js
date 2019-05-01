import * as Util from './ag-util';
import IconBase from './ag-icon-base';

class IconFontAwesome5 extends IconBase {
    constructor(iconParams) {
        super('icon-fontawesome5');
        // Prepare default options
        let libParams = {
            icons: null
        };
        Object.assign(libParams, iconParams);
        // Set default CSS class as icon
        let icons = {
            append: 'fas fa-plus',
            removeLast: 'fas fa-minus',
            insert: 'fas fa-reply',
            remove: 'fas fa-times',
            moveUp: 'fas fa-angle-up',
            moveDown: 'fas fa-angle-down'
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

export default IconFontAwesome5;