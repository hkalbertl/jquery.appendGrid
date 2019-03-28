import GridCore from './ag-core'

// WeakMap object for keeping private grid data
const _grid = new WeakMap();

class AppendGrid {

    constructor(options) {
        // Save the core grid to WeakMap 
        _grid.set(this, new GridCore(options));
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
