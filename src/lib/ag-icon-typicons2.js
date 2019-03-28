import * as Util from './ag-util';
import IconBase from './ag-icon-base';

class IconTypicons2 extends IconBase {
    constructor(icons) {
        super('icon-typicons2');
        // Set default CSS class as icon
        Object.assign(this.icons, {
            append: 'typcn typcn-plus',
            removeLast: 'typcn typcn-minus',
            insert: 'typcn typcn-arrow-back',
            remove: 'typcn typcn-times',
            moveUp: 'typcn typcn-arrow-sorted-up',
            moveDown: 'typcn typcn-arrow-sorted-down'
        });
        // Override default icons if defined
        if (icons) {
            Object.assign(this.icons, icons);
        }
    }

    generateIcon(container, type) {
        let icon = document.createElement('span');
        Util.applyClasses(icon, this.icons[type]);
        container.appendChild(icon);
        return icon;
    }
}

export default IconTypicons2;