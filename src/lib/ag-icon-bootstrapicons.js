import * as Util from './ag-util';
import IconBase from './ag-icon-base';

class IconBootstrapIcons extends IconBase {
    constructor(iconParams) {
        super('icon-bootstrapicons');
        // Prepare default options
        let libParams = {
            baseUrl: '',
            icons: null
        };
        Object.assign(libParams, iconParams);
        // Set default CSS class as icon
        let icons = {
            append: 'plus',
            removeLast: 'dash',
            insert: 'arrow-90deg-left',
            remove: 'trash',
            moveUp: 'chevron-up',
            moveDown: 'chevron-down'
        };
        // Override default icons if defined
        if (libParams.icons) {
            Object.assign(icons, libParams.icons);
        }
        this.icons = icons;
        this.baseUrl = libParams.baseUrl;
    }

    generateIcon(container, type) {
        let icon = document.createElement('img');
        icon.src = this.baseUrl + this.icons[type] + '.svg';
        Util.applyClasses(icon, this.icons[type]);
        container.appendChild(icon);
        return icon;
    }
}

export default IconBootstrapIcons;