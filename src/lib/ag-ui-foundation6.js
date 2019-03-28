import * as Util from './ag-util';
import UiBase from './ag-ui-base';

class UiFoundation6 extends UiBase {
    constructor(uiParams, iconFramework) {
        super(iconFramework);
        this.name = 'ui-foundation6';
        // Prepare default options
        let libParams = {
            useButtonGroup: true,
            sectionClasses: null
        };
        Object.assign(libParams, uiParams);
        // Prepare default section classes
        let libSectionClasses = {
            button: 'button',
            buttonGroup: 'button-group'
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
}

export default UiFoundation6;