describe('AppendGrid PlainJS', function () {
    // Prepare table
    var domTable = document.createElement('table');
    domTable.id = 'tblAppendGrid';
    document.body.appendChild(domTable);
    document.body.className = 'container';

    describe('#init', function () {
        window.myAppendGrid = new AppendGrid({
            element: domTable,
            uiFramework: 'default',
            iconFramework: 'default',
            columns: [
                { name: 'foo', display: 'Foo', type: 'text' },
                { name: 'bar', display: 'Bar', type: 'text' }
            ],
            initRows: 5
        });

        it('should initialized', function () {
            assert.isOk(myAppendGrid);
        });

        it('should have 5 rows', function () {
            assert.deepEqual(myAppendGrid.getRowOrder(), [1, 2, 3, 4, 5]);
        });
    });

    describe('#appendRow', function () {
        it('should have 7 rows', function () {
            myAppendGrid.appendRow(2);
            assert.deepEqual(myAppendGrid.getRowOrder(), [1, 2, 3, 4, 5, 6, 7]);
        });
    });
});