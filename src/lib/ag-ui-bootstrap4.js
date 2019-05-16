import * as Util from './ag-util';
import UiBase from './ag-ui-base';

class UiBootstrap4 extends UiBase {
    constructor(uiParams, i18n, iconFramework) {
        super(i18n, iconFramework);
        this.name = 'ui-bootstrap4';
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
            thead: 'thead-light',
            control: 'form-control',
            button: 'btn',
            buttonGroup: 'btn-group',
            append: 'btn-outline-secondary',
            removeLast: 'btn-outline-secondary',
            insert: 'btn-outline-secondary',
            remove: 'btn-outline-secondary',
            moveUp: 'btn-outline-secondary',
            moveDown: 'btn-outline-secondary',
            empty: 'text-center'
        };
        // Apply sizing classes, if defined
        if (libParams.sizing === 'small') {
            // For small
            libSectionClasses.table += ' table-sm';
            libSectionClasses.buttonGroup += ' btn-group-sm';
            libSectionClasses.control += ' form-control-sm';
        } else if (libParams.sizing === 'large') {
            // For large
            libSectionClasses.buttonGroup += ' btn-group-lg';
            libSectionClasses.control += ' form-control-lg';
        }
        // Override default classes if user defined
        if (libParams.sectionClasses) {
            Object.assign(libSectionClasses, libParams.sectionClasses);
        }
        this.applySectionClasses(libSectionClasses);
        this.uiParams = libParams;
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
        if (columnOpt.type === 'checkbox') {
            // Create wrapper
            let wrapper = Util.createElem('div', null, null, 'form-check');
            ctrlHolder.appendChild(wrapper);
            // Create checkbox
            ctrl = Util.createElem('input', ctrlId, ctrlName, 'form-check-input position-static');
            ctrl.type = 'checkbox';
            ctrl.value = 1;
            wrapper.appendChild(ctrl);
        } else if (columnOpt.type === 'readonly') {
            // Create a readonly text input without border
            ctrl = Util.createElem('input', ctrlId, ctrlName, null, 'text');
            // Apply classes
            Util.applyClasses(ctrl, this.getSectionClasses('control'), columnOpt.ctrlClass);
            // Remove form-control and add form-control-plaintext
            ctrl.classList.remove('form-control');
            ctrl.classList.add('form-control-plaintext');
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

export default UiBootstrap4;