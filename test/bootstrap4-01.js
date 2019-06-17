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
            window.gridData.list[0].grid.appendRow(2);
            assert.deepEqual(window.gridData.list[0].grid.getRowOrder(), [1, 2, 3, 4, 5, 6, 7]);
        });
    });

    // Remove the test table
    // window.myAppendGrid = null;
    // document.body.removeChild(domTable);
});