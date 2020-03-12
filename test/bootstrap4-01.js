describe('AppendGrid Bootstrap4', function () {

    before(function () {
        // Prepare tables
        window.gridData = {
            uiFramework: 'bootstrap4',
            iconFramework: 'fontawesome5',
            list: [
                { id: 'tblAppendGrid', sizing: null, grid: null },
                { id: 'tbNormal', sizing: 'normal', grid: null },
                { id: 'tbSmall', sizing: 'small', grid: null },
                { id: 'tbLarge', sizing: 'large', grid: null }
            ]
        };
        window.gridData.list.forEach(function (gridConfig) {
            var domTable = document.createElement('table');
            domTable.id = gridConfig.id;
            document.body.appendChild(domTable);
        });

        // Add container class to body
        document.body.className = 'container';
    });

    describe('#init', function () {
        it('should initialized', function () {

            window.gridData.list[0].grid = new AppendGrid({
                element: window.gridData.list[0].id,
                uiFramework: window.gridData.uiFramework,
                iconFramework: window.gridData.iconFramework,
                columns: [
                    { name: 'foo', display: 'Foo', type: 'text' },
                    { name: 'bar', display: 'Bar', type: 'text' }
                ],
                initRows: 5
            });

            assert.isOk(window.gridData.list[0].grid);
        });

        it('should have 5 rows', function () {
            assert.deepEqual(window.gridData.list[0].grid.getRowOrder(), [1, 2, 3, 4, 5]);
        });
    });

    describe('#appendRow', function () {
        it('should have 7 rows', function () {
            let appendResult = window.gridData.list[0].grid.appendRow(2);
            assert.deepEqual(appendResult, [6, 7]);
            assert.deepEqual(window.gridData.list[0].grid.getRowOrder(), [1, 2, 3, 4, 5, 6, 7]);
        });
    });

    describe('#removeRow', function () {
        it('should have 6 rows', function () {
            window.gridData.list[0].grid.removeRow(3);
            assert.deepEqual(window.gridData.list[0].grid.getRowOrder(), [1, 2, 3, 5, 6, 7]);
        });
    });

    describe('#insertRow', function () {
        it('should have 8 rows', function () {
            let insertResult = window.gridData.list[0].grid.insertRow([
                { "foo": "3A", "bar": "2019-03-03" },
                { "foo": "4A", "bar": "2019-04-04" }
            ], 3);
            assert.deepEqual(insertResult, [8, 9]);
            assert.deepEqual(window.gridData.list[0].grid.getRowOrder(), [1, 2, 3, 8, 9, 5, 6, 7]);
            assert.deepEqual(window.gridData.list[0].grid.getRowValue(3), { "foo": "3A", "bar": "2019-03-03" });
        });
    });

    // Remove the test table
    // window.myAppendGrid = null;
    // document.body.removeChild(domTable);
});