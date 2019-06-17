/*
describe('AppendGrid Bootstrap4', function () {
    // Prepare tables
    var tableList = [
        { id: 'tblAppendGridNormal', sizing: 'normal', grid: null },
        { id: 'tblAppendGridSmall', sizing: 'small', grid: null },
        { id: 'tblAppendGridLarge', sizing: 'large', grid: null }
    ];
    $.each(tableList, function (index) {
        var domTable = document.createElement('table');
        domTable.id = tableList[index].id;
        document.body.appendChild(domTable);
    });

    describe('#init', function () {
        $.each(tableList, function (index) {
            tableList[index].grid = new AppendGrid({
                element: tableList[index].id,
                uiFramework: 'bootstrap4',
                uiParams: {
                    sizing: tableList[index].sizing
                },
                iconFramework: 'fontawesome5',
                columns: [
                    { name: 'foo', display: 'Foo', type: 'text' },
                    { name: 'bar', display: 'Bar', type: 'text' }
                ],
                initRows: 5
            });
        });

        it('should initialized table[0]', function () {
            assert.isOk(tableList[0].grid);
        });

        it('should initialized table[1]', function () {
            assert.isOk(tableList[1].grid);
        });

        it('should initialized table[2]', function () {
            assert.isOk(tableList[2].grid);
        });

        it('small should be shorter', function () {
            var smallGridHeight = document.getElementById(tableList[1].id).offsetHeight;
            assert.isBelow(smallGridHeight, document.getElementById(tableList[0].id).offsetHeight);
        });

        it('large should be taller', function () {
            var largeGridHeight = document.getElementById(tableList[2].id).offsetHeight;
            assert.isAbove(largeGridHeight, document.getElementById(tableList[0].id).offsetHeight);
        });
    });
});
*/