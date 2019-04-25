import * as Util from './ag-util';
import IconBase from './ag-icon-base';

class IconIonicons4 extends IconBase {
    constructor(icons) {
        super('icon-ionicon4');
        // Set default CSS class as icon
        Object.assign(this.icons, {
            append: 'icon ion-md-add',
            removeLast: 'icon ion-md-remove',
            insert: 'icon ion-md-undo',
            remove: 'icon ion-md-close',
            moveUp: 'icon ion-md-arrow-dropup',
            moveDown: 'icon ion-md-arrow-dropdown'
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

export default IconIonicons4;