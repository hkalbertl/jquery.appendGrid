import * as Util from './ag-util';
import IconBase from './ag-icon-base';

class IconMaterialDesignIcons3 extends IconBase {
    constructor(iconParams) {
        super('icon-materialdesignicons3');
        // Prepare default options
        let libParams = {
            icons: null
        };
        Object.assign(libParams, iconParams);
        // Set default CSS class as icon
        let icons = {
            append: 'mdi mdi-plus',
            removeLast: 'mdi mdi-minus',
            insert: 'mdi mdi-reply',
            remove: 'mdi mdi-close',
            moveUp: 'mdi mdi-chevron-up',
            moveDown: 'mdi mdi-chevron-down'
        };
        // Override default icons if defined
        if (libParams.icons) {
            Object.assign(icons, libParams.icons);
        }
        this.icons = icons;
    }

    generateIcon(container, type) {
        let icon = document.createElement('span');
        Util.applyClasses(icon, this.icons[type]);
        container.appendChild(icon);
        return icon;
    }
}

export default IconMaterialDesignIcons3;