import * as Util from './ag-util';
import UiBase from './ag-ui-base';

class UiBootstrap4 extends UiBase {
    constructor(uiParams, i18n, iconFramework) {
        super(i18n, iconFramework);
        this.name = 'ui-bootstrap4';
        // Prepare default options
        let libParams = {
            useButtonGroup: true,
            sectionClasses: null
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
            moveDown: 'btn-outline-secondary'
        };
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
        } else {
            // Create by using default control generation
            ctrl = super.generateControl(ctrlHolder, columnOpt, ctrlId, ctrlName);
        }
        return ctrl;
    }
}

export default UiBootstrap4;