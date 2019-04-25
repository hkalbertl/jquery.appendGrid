import * as Util from './ag-util';
import IconBase from './ag-icon-base';

class IconFontAwesome5 extends IconBase {
    constructor(icons) {
        super('icon-fontawesome5');
        // Set default CSS class as icon
        Object.assign(this.icons, {
            append: 'fas fa-plus',
            removeLast: 'fas fa-minus',
            insert: 'fas fa-reply',
            remove: 'fas fa-times',
            moveUp: 'fas fa-angle-up',
            moveDown: 'fas fa-angle-down'
        });
        // Override default icons if defined
        if (icons) {
            Object.assign(this.icons, icons);
        }
    }

    generateIcon(container, type) {
        let icon = document.createElement('i');
        Util.applyClasses(icon, this.icons[type]);
        container.appendChild(icon);
        return icon;
    }
}

export default IconFontAwesome5;