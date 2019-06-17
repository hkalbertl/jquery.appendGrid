import * as Util from './ag-util';
import UiBase from './ag-ui-base';

class UiBulma extends UiBase {
    constructor(uiParams, i18n, iconFramework) {
        super(i18n, iconFramework);
        this.name = 'ui-bulma';
        // Prepare default options
        let libParams = {
            useButtonGroup: true,
            sectionClasses: null,
            sizing: 'normal'
        };
        Object.assign(libParams, uiParams);
        // Prepare default section classes
        let libSectionClasses = {
            table: 'table',
            control: 'input',
            button: 'button',
            buttonGroup: 'field has-addons',
            append: 'is-outlined',
            removeLast: 'is-outlined',
            insert: 'is-outlined',
            remove: 'is-outlined',
            moveUp: 'is-outlined',
            moveDown: 'is-outlined',
            empty: 'has-text-centered'
        };
        // Apply sizing classes, if defined
        if (libParams.sizing === 'small') {
            // For small
            libSectionClasses.table += ' is-narrow';
            libSectionClasses.control += ' is-small';
            libSectionClasses.button += ' is-small';
        } else if (libParams.sizing === 'medium') {
            // For medium
            libSectionClasses.control += ' is-medium';
            libSectionClasses.button += ' is-medium';
        } else if (libParams.sizing === 'large') {
            // For large
            libSectionClasses.control += ' is-large';
            libSectionClasses.button += ' is-large';
        }
        // Override default classes if user defined
        if (libParams.sectionClasses) {
            Object.assign(libSectionClasses, libParams.sectionClasses);
        }
        this.applySectionClasses(libSectionClasses);
        this.uiParams = libParams;
    }

    generateButton(holder, type, buttonId) {
        // Create the button
        let button = Util.createElem('button', buttonId, null, null, 'button');
        button.title = this.i18n[type];
        Util.applyClasses(button,
            this.getSectionClasses('button'),
            this.getSectionClasses(type));
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
            if (this.uiParams.sizing === 'small'){
                wrapper.classList.add('is-small');
            } else if (this.uiParams.sizing === 'medium'){
                wrapper.classList.add('is-medium');
            } else if (this.uiParams.sizing === 'large'){
                wrapper.classList.add('is-large');
            }
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
        } else if (columnOpt.type === 'readonly') {
            // Create a readonly text input without border
            ctrl = Util.createElem('input', ctrlId, ctrlName, null, 'text');
            // Apply classes
            Util.applyClasses(ctrl, this.getSectionClasses('control'), columnOpt.ctrlClass);
            // Add is-static class
            ctrl.classList.add('is-static');
            // Set readonly
            ctrl.readOnly = true;
            // Add to holder
            ctrlHolder.appendChild(ctrl);
        } else {
            // Create by using default control generation
            ctrl = super.generateControl(ctrlHolder, columnOpt, ctrlId, ctrlName);
        }
        return ctrl;
    }
}

export default UiBulma;