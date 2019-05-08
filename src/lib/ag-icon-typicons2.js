import * as Util from './ag-util';
import IconBase from './ag-icon-base';

class IconTypicons2 extends IconBase {
    constructor(iconParams) {
        super('icon-typicons2');
        // Prepare default options
        let libParams = {
            icons: null
        };
        Object.assign(libParams, iconParams);
        // Set default CSS class as icon
        let icons = {
            append: 'typcn typcn-plus',
            removeLast: 'typcn typcn-minus',
            insert: 'typcn typcn-arrow-back',
            remove: 'typcn typcn-times',
            moveUp: 'typcn typcn-arrow-sorted-up',
            moveDown: 'typcn typcn-arrow-sorted-down'
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

export default IconTypicons2;