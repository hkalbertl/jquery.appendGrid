import * as Util from './ag-util';
import UiBase from './ag-ui-base';

class UiBulma extends UiBase {
    constructor(uiParams, iconFramework) {
        super(iconFramework);
        this.name = 'ui-bulma';
        // Prepare default options
        let libParams = {
            useButtonGroup: true,
            sectionClasses: null
        };
        Object.assign(libParams, uiParams);
        // Prepare default section classes
        let libSectionClasses = {
            table: 'table',
            first: 'is-narrow',
            last: 'is-narrow',
            control: 'input',
            button: 'button',
            buttonGroup: 'field has-addons',
            append: 'is-outlined',
            removeLast: 'is-outlined',
            insert: 'is-outlined',
            remove: 'is-outlined',
            moveUp: 'is-outlined',
            moveDown: 'is-outlined'
        };
        if (libParams.sectionClasses) {
            Object.assign(libSectionClasses, libParams.sectionClasses);
        }
        this.applySectionClasses(libSectionClasses);
        this.uiParams = libParams;
    }

    generateButton(holder, type) {
        // Create the button
        let button = document.createElement('button');
        button.type = 'button';
        Util.applyClasses(button, this.getSectionClasses('button'));
        Util.applyClasses(button, this.getSectionClasses(type));
        // Create related icon and append to button
        let container = null;
        if (this.iconFramework.isTextBased) {
            container = button;
        } else {
            container = document.createElement('span');
            container.classList.add('icon');
            button.appendChild(container);
        }
        this.iconFramework.generateIcon(container, type);
        // Add wrapper if button group is used
        if (this.uiParams.useButtonGroup) {
            let wrapper = document.createElement('p');
            wrapper.classList.add('control');
            wrapper.appendChild(button);
            holder.appendChild(wrapper);
        } else {
            holder.appendChild(button);
        }
        // Return button
        return button;
    }

    createButtonGroup() {
        if (this.uiParams.useButtonGroup) {
            let group = document.createElement('div');
            Util.applyClasses(group, this.getSectionClasses('buttonGroup'));
            return group;
        } else {
            return super.createButtonGroup();
        }
    }

    generateControl(ctrlHolder, columnOpt, ctrlId, ctrlName) {
        let ctrl = null;
        if (columnOpt.type === 'select') {
            // Create wrapper
            let wrapper = Util.createElem('div', null, null, 'select');
            ctrlHolder.appendChild(wrapper);
            // Create select
            ctrl = super.generateControl(null, columnOpt, ctrlId, ctrlName);
            wrapper.appendChild(ctrl);
        } else if (columnOpt.type === 'checkbox') {
            // Create wrapper
            let wrapper = Util.createElem('label', null, null, 'checkbox');
            ctrlHolder.appendChild(wrapper);
            // Create checkbox
            ctrl = Util.createElem('input', ctrlId, ctrlName, null, 'checkbox');
            ctrl.value = 1;
            wrapper.appendChild(ctrl);
        } else {
            // Create by using default control generation
            ctrl = super.generateControl(ctrlHolder, columnOpt, ctrlId, ctrlName);
        }
        return ctrl;
    }
}

export default UiBulma;