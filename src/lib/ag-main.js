import GridCore from './ag-core'

// WeakMap object for keeping private grid data
const _grid = new WeakMap();

// Default grid options.
const _defaultGridOptions = {
    // Required. The table element.
    element: null,
    // The name of UI framework, such as 'bootstrap4' and 'bulma'. Default is 'default'.
    uiFramework: null,
    uiParams: null,
    // The name of Icon framework, such as 'fontawesome5'. Default is 'default'.
    iconFramework: null,
    iconParams: null,
    // The total number of empty rows generated when init the grid. This will be ignored if `initData` is assigned.
    initRows: 3,
    // The ID prefix of controls generated inside the grid. Table ID will be used if not defined.
    idPrefix: null,
    // An array of data to be filled after initialized the grid.
    initData: null,
    // Array of column options.
    columns: [],
    // Hide the buttons at the end of rows or bottom of grid.
    hideButtons: null,
    // Hide the row number column.
    hideRowNumColumn: false,
    // Generate row buttom column in the front of input columns.
    rowButtonsInFront: false,
    // The variable name of row count used for object mode of getAllValue
    rowCountName: '_RowCount',
    // Custom CSS classes to be added to different sections
    sectionClasses: null
};

// Default column options.
const _defaultColumnOptions = {
    // Type of column control.
    type: 'text',
    // Name of column.
    name: null,
    // Default value.
    value: null,
    // Display text on the header section.
    display: null,
    // Extra CSS setting to be added to display text.
    displayCss: null,
    // Tooltip for column head.
    displayTooltip: null,
    // The `colspan` setting on the column header.
    headerSpan: 1,
    // Extra CSS setting to be added to the control container table cell.
    cellCss: null,
    // Extra attributes to be added to the control.
    ctrlAttr: null,
    // Extra properties to be added to the control.
    ctrlProp: null,
    // Extra CSS to be added to the control.
    ctrlCss: null,
    // Extra name of class to be added to the control.
    ctrlClass: null,
    // The available option for building `select` type control.
    ctrlOptions: null,
    // Show or hide column after initialized.
    invisible: false,
    // The value to compare for indentify this column value is empty.
    emptyCriteria: null,
    // Callback function to build custom type control.
    customBuilder: null,
    // Callback function to get control value.
    customGetter: null,
    // Callback function to set control value.
    customSetter: null,
    // An object that contains event callbacks of control.
    events: null,
    // Add wrapper to the input control.
    wrapper: null
};

class AppendGrid {

    constructor(options) {
        // Merge default options
        let params = Object.assign({}, _defaultGridOptions, options);

        // Handle hideButtons option
        let hideButtons = {
            append: false,
            removeLast: false,
            insert: false,
            remove: false,
            moveUp: false,
            moveDown: false
        };
        if (params.hideButtons) {
            Object.assign(hideButtons, params.hideButtons);
        }
        params.hideButtons = hideButtons;

        // Apply column defaults
        for (let z = 0; z < params.columns.length; z++) {
            let columnOpt = Object.assign({}, _defaultColumnOptions, params.columns[z]);
            params.columns[z] = columnOpt;
        }

        // Save the core grid to WeakMap 
        _grid.set(this, new GridCore(params));
    }

    appendRow(numOfRowOrRowArray) {
        _grid.get(this).appendRow(numOfRowOrRowArray);
    }

    insertRow(numOfRowOrRowArray, rowIndex, callerUniqueIndex) {
        _grid.get(this).insertRow(numOfRowOrRowArray, rowIndex, callerUniqueIndex);
    }

    load(records) {
        _grid.get(this).loadData(records, true);
    }

    getAllValue(objectMode) {
        let grid = _grid.get(this), result = objectMode ? {} : [];
        grid.rowOrder.forEach(function (uniqueIndex, arrayIndex) {
            if (objectMode) {
                Object.assign(result, grid.getRowValue(uniqueIndex, arrayIndex));
            } else {
                result.push(grid.getRowValue(uniqueIndex));
            }
        });
        // For object mode, save the number of rows
        if (objectMode) {
            result[grid.settings.rowCountName] = grid.settings.rowOrder.length;
        }
        return result;
    }

    getRowOrder() {
        // Return a copy of `Row Order` array
        return _grid.get(this).rowOrder.slice();
    }
}

export default AppendGrid;
