import GridCore from './ag-core'
import * as Util from './ag-util'

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
    // Labels or messages used in grid.
    i18n: null,
    // Hide the buttons at the end of rows or bottom of grid.
    hideButtons: null,
    // Hide the row number column.
    hideRowNumColumn: false,
    // Generate row buttom column in the front of input columns.
    rowButtonsInFront: false,
    // The variable name of row count used for object mode of getAllValue
    rowCountName: '_RowCount',
    // Custom CSS classes to be added to different sections
    sectionClasses: null,
    // The maximum number of rows allowed in this grid
    maxRowsAllowed: 0
};

const _defaultCallbackContainer = {
    // The callback function for format the HTML name of generated controls.
    nameFormatter: null,
    // The callback function to be triggered after all data loaded to grid.
    dataLoaded: null,
    // The callback function to be triggered after data loaded to a row.
    rowDataLoaded: null,
    // The callback function to be triggered after new row appended.
    afterRowAppended: null,
    // The callback function to be triggered after new row inserted.
    afterRowInserted: null,
    // The callback function to be triggered after grid row swapped.
    afterRowSwapped: null,
    // The callback function to be triggered before grid row remove.
    beforeRowRemove: null,
    // The callback function to be triggered after grid row removed.
    afterRowRemoved: null,
    // The callback function to be triggered when row(s) is/are adding to grid but the maximum number of rows allowed is reached.
    maxNumRowsReached: null
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
    // Extra CSS setting to be added to display text cell (thead > tr > th).
    displayCss: null,
    // Extra name of class to be added to display text cell (thead > tr > th).
    displayClass: null,
    // Tooltip for column head.
    displayTooltip: null,
    // The `colspan` setting on the column header.
    headerSpan: 1,
    // Extra CSS setting to be added to the control container table cell (tbody > tr > td).
    cellCss: null,
    // Extra name of class to be added to the control container table cell (tbody > tr > td).
    cellClass: null,
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
    // Callback function when control added
    ctrlAdded: null
};

class AppendGrid {

    constructor(options) {
        // Merge default options
        let params = Object.assign({}, _defaultGridOptions, _defaultCallbackContainer, options);

        // Handle i18n option
        let i18n = {
            append: 'Append Row',
            removeLast: 'Remove Last Row',
            insert: 'Insert Row Above',
            remove: 'Remove Current Row',
            moveUp: 'Move Up',
            moveDown: 'Move Down',
            rowEmpty: 'This Grid Is Empty'
        };
        if (params.i18n) {
            Object.assign(i18n, params.i18n);
        }
        params.i18n = i18n;

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
        const gridCore = new GridCore(params);
        _grid.set(this, gridCore);

        // Handle initData or initRows
        if (Array.isArray(params.initData)) {
            // Load initData
            gridCore.loadData(params.initData, true);
        } else if (params.initRows > 0) {
            // Append initRows
            gridCore.insertRow(params.initRows);
        }
    }

    appendRow(numOfRowOrRowArray) {
        _grid.get(this).insertRow(numOfRowOrRowArray || 1);
    }

    insertRow(numOfRowOrRowArray, rowIndex) {
        _grid.get(this).insertRow(numOfRowOrRowArray, rowIndex);
    }

    removeRow(rowIndex) {
        _grid.get(this).removeRow(rowIndex);
    }

    moveUpRow(rowIndex) {
        _grid.get(this).moveUpRow(rowIndex);
    }

    moveDownRow(rowIndex) {
        _grid.get(this).moveDownRow(rowIndex);
    }

    load(records) {
        _grid.get(this).loadData(records);
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
            result[grid.settings.rowCountName] = grid.rowOrder.length;
        }
        return result;
    }

    getUniqueIndex(rowIndex) {
        const rowOrder = _grid.get(this).rowOrder;
        if (rowIndex >= 0 && rowIndex < rowOrder.length) {
            return rowOrder[rowIndex];
        }
        return null;
    }

    getRowIndex(uniqueIndex) {
        const rowOrder = _grid.get(this).rowOrder;
        for (let r = 0; r < rowOrder.length; r++) {
            if (rowOrder[r] === uniqueIndex) {
                return r;
            }
        }
        return null;
    }

    getRowCount() {
        return _grid.get(this).rowOrder.length;
    }

    getRowOrder() {
        // Return a copy of `Row Order` array
        return _grid.get(this).rowOrder.slice();
    }

    getRowValue(rowIndex) {
        return _grid.get(this).getRowValue(rowIndex);
    }

    getCtrlValue(name, rowIndex) {
        const colIndex = _grid.get(this).getColumnIndex(name);
        const uniqueIndex = this.getUniqueIndex(rowIndex);
        if (colIndex !== null && uniqueIndex !== null) {
            return _grid.get(this).getCtrlValue(colIndex, uniqueIndex);
        }
        return null;
    }

    setCtrlValue(name, rowIndex, value) {
        const colIndex = _grid.get(this).getColumnIndex(name);
        const uniqueIndex = this.getUniqueIndex(rowIndex);
        if (colIndex !== null && uniqueIndex !== null) {
            return _grid.get(this).setCtrlValue(colIndex, uniqueIndex, value);
        }
    }

    getColumns() {
        return _grid.get(this).settings.columns.slice();
    }

    getCellCtrl(name, rowIndex) {
        const uniqueIndex = this.getUniqueIndex(rowIndex);
        return this.getCellCtrlByUniqueIndex(name, uniqueIndex);
    }

    getCellCtrlByUniqueIndex(name, uniqueIndex) {
        const grid = _grid.get(this);
        const colIndex = grid.getColumnIndex(name);
        if (colIndex !== null && Util.isNumeric(uniqueIndex)) {
            return grid.getCellCtrl(grid.settings.idPrefix, name, uniqueIndex);
        }
        return null;
    }

    isRowEmpty(rowIndex) {
        const uniqueIndex = this.getUniqueIndex(rowIndex);
        if (uniqueIndex !== null) {
            return _grid.get(this).isRowEmpty(uniqueIndex);
        }
        return true;
    }

    removeEmptyRows() {
        const grid = _grid.get(this), rowOrder = this.getRowOrder();
        for (let r = 0; r < rowOrder.length; r++) {
            if (grid.isRowEmpty(rowOrder[r])) {
                grid.removeRow(null, rowOrder[r], true);
            }
        }
    }
}

export default AppendGrid;
