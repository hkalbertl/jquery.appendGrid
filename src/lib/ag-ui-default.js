import UiBase from './ag-ui-base';

class UiDefault extends UiBase {
	constructor(uiParams, i18n, iconFramework) {
		super(i18n, iconFramework);
		this.name = 'ui-default';
	}
}

export default UiDefault;