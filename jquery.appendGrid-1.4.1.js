/*!
* jQuery appendGrid v1.4.1
* https://appendgrid.apphb.com/
*
* Copyright 2014 Albert L.
* Dual licensed under the LGPL (http://www.gnu.org/licenses/lgpl.html)
* and MIT (http://www.opensource.org/licenses/mit-license.php) licenses.
*
* Depends:
* jQuery v1.9.1+
* jquery UI v1.10.2+
*/
(function ($) {
    // The default initial options.
    var _defaultInitOptions = {
        // The text as table caption, set null to disable caption generation.
        caption: null,
        // The total number of empty rows generated when init the grid. This will be ignored if `initData` is assigned.
        initRows: 3,
        // An array of data to be filled after initialized the grid.
        initData: null,
        // Array of column options.
        columns: null,
        // Labels or messages used in grid.
        i18n: null,
        // The ID prefix of controls generated inside the grid. Table ID will be used if not defined.
        idPrefix: null,
        // Enable row dragging by using jQuery UI sortable on grid rows.
        rowDragging: false,
        // Hide the buttons at the end of rows or bottom of grid.
        hideButtons: null,
        // Hide the row number column.
        hideRowNumColumn: false,
        // Generate row buttom column in the front of input columns.
        rowButtonsInFront: false,
        // The extra class names for buttons.
        buttonClasses: null,
        // Custom the standard grid buttons.
        customGridButtons: null,
        // Adding extra button(s) at the end of rows.
        customRowButtons: null,
        // Adding extra button(s) at the bottom of grid.
        customFooterButtons: null,
        // The callback function for format the HTML name of generated controls.
        nameFormatter: null,
        // The callback function to be triggered after data loaded to grid.
        dataLoaded: null,
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
        // The callback function to be triggered after grid row dragged.
        afterRowDragged: null
    };
    // Default column options.
    var _defaultColumnOptions = {
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
        // Options for initalize jQuery UI widget.
        uiOption: null,
        // Options for initalize jQuery UI tooltip.
        uiTooltip: null,
        // Let column resizable by using jQuery UI Resizable Interaction.
        resizable: false,
        // Show or hide column after initialized.
        invisible: false,
        // Callback function to build custom type control.
        customBuilder: null,
        // Callback function to get control value.
        customGetter: null,
        // Callback function to set control value.
        customSetter: null,
        // The `OnClick` event callback of control.
        onClick: null,
        // The `OnChange` event callback of control.
        onChange: null
    };
    var _systemMessages = {
        noColumnInfo: 'Cannot initial grid without column information!',
        elemNotTable: 'Cannot initial grid on element other than TABLE!',
        notInit: '`appendGrid` does not initialized',
        getValueMultiGrid: 'Cannot get values on multiple grid',
        notSupportMethod: 'Method is not supported by `appendGrid`: '
    };
    var _defaultTextResources = {
        append: 'Append Row',
        removeLast: 'Remove Last Row',
        insert: 'Insert Row Above',
        remove: 'Remove Current Row',
        moveUp: 'Move Up',
        moveDown: 'Move Down',
        rowDrag: 'Sort Row',
        rowEmpty: 'This Grid Is Empty'
    };
    var _defaultButtonClasses = { append: null, removeLast: null, insert: null, remove: null, moveUp: null, moveDown: null, rowDrag: null };
    var _defaultHideButtons = { append: false, removeLast: false, insert: false, remove: false, moveUp: false, moveDown: false };
    var _methods = {
        init: function (options) {
            var target = this;
            if (target.length > 0) {
                // Check mandatory paramters included
                if (!$.isArray(options.columns) || options.columns.length == 0) {
                    alert(_systemMessages.noColumnInfo);
                    return target;
                }
                // Check target element is table or not
                var tbWhole = target[0], tbHead, tbBody, tbFoot, tbRow, tbCell;
                if (isEmpty(tbWhole.tagName) || tbWhole.tagName != 'TABLE') {
                    alert(_systemMessages.elemNotTable);
                    return target;
                }
                // Generate settings
                var settings = $.extend({}, _defaultInitOptions, options);
                // Add internal settings
                $.extend(settings, {
                    //The UniqueIndex accumulate counter.
                    _uniqueIndex: 0,
                    // The row order array.
                    _rowOrder: [],
                    // Indicate data is loaded or not.
                    _isDataLoaded: false,
                    // Visible column count for internal calculation.
                    _visibleCount: 0,
                    // Total colSpan count after excluding `hideRowNumColumn` and not generating last column.
                    _finalColSpan: 0,
                    // Indicate to hide last column or not
                    _hideLastColumn: false
                });
                // Labels or messages used in grid.
                if ($.isPlainObject(options.i18n))
                    settings._i18n = $.extend({}, _defaultTextResources, options.i18n);
                else
                    settings._i18n = $.extend({}, _defaultTextResources);
                // The extra class names for buttons.
                if ($.isPlainObject(options.buttonClasses))
                    settings._buttonClasses = $.extend({}, _defaultButtonClasses, options.buttonClasses);
                else
                    settings._buttonClasses = $.extend({}, _defaultButtonClasses);
                // Make sure the `hideButtons` setting defined
                if ($.isPlainObject(options.hideButtons))
                    settings.hideButtons = $.extend({}, _defaultHideButtons, options.hideButtons);
                else
                    settings.hideButtons = $.extend({}, _defaultHideButtons);
                // Check `idPrefix` is defined
                if (isEmpty(settings.idPrefix)) {
                    // Check table ID defined
                    if (isEmpty(tbWhole.id) || tbWhole.id == '') {
                        // Generate an ID using current time
                        settings.idPrefix = 'ag' + new Date().getTime();
                    }
                    else {
                        settings.idPrefix = tbWhole.id;
                    }
                }
                // Check custom grid button parameters
                if (!$.isPlainObject(settings.customGridButtons)) {
                    settings.customGridButtons = {};
                }
                // Create thead and tbody
                tbHead = document.createElement('thead');
                tbHead.className = 'ui-widget-header';
                tbBody = document.createElement('tbody');
                tbBody.className = 'ui-widget-content';
                tbFoot = document.createElement('tfoot');
                tbFoot.className = 'ui-widget-header';
                // Remove existing content and append new thead and tbody
                $(tbWhole).empty().addClass('appendGrid ui-widget').append(tbHead, tbBody, tbFoot);
                // Handle header row
                var tbHeadCellRowNum, tbHeadCellRowButton;
                tbRow = tbHead.insertRow(-1);
                if (!settings.hideRowNumColumn) {
                    tbHeadCellRowNum = tbRow.insertCell(-1);
                    tbHeadCellRowNum.className = 'ui-widget-header';
                }
                // Prepare column information and add column header
                var pendingSkipCol = 0;
                for (var z = 0; z < settings.columns.length; z++) {
                    // Assign default setting
                    var columnOpt = $.extend({}, _defaultColumnOptions, settings.columns[z]);
                    settings.columns[z] = columnOpt;
                    // Skip hidden
                    if (settings.columns[z].type != 'hidden') {
                        // Check column is invisible
                        if (!settings.columns[z].invisible) {
                            settings._visibleCount++;
                        }
                        // Check skip header colSpan
                        if (pendingSkipCol == 0) {
                            var className = 'ui-widget-header';
                            if (settings.columns[z].invisible) className += ' invisible';
                            if (settings.columns[z].resizable) className += ' resizable';
                            tbCell = tbRow.insertCell(-1);
                            tbCell.id = settings.idPrefix + '_' + settings.columns[z].name + '_td_head';
                            tbCell.className = className;
                            $(tbCell).text(settings.columns[z].display);
                            if (settings.columns[z].displayCss) $(tbCell).css(settings.columns[z].displayCss);
                            if (settings.columns[z].headerSpan > 1) {
                                $(tbCell).attr('colSpan', settings.columns[z].headerSpan);
                                pendingSkipCol = settings.columns[z].headerSpan - 1;
                            }
                        } else {
                            pendingSkipCol--;
                        }
                    }
                }
                // Enable columns resizable
                $('td.resizable', tbHead).resizable({ handles: 'e' });
                // Check to hide last column or not
                if (settings.hideButtons.insert && settings.hideButtons.remove
                        && settings.hideButtons.moveUp && settings.hideButtons.moveDown
                        && (!$.isArray(settings.customRowButtons) || settings.customRowButtons.length == 0)) {
                    settings._hideLastColumn = true;
                }
                // Calculate the `_finalColSpan` value
                settings._finalColSpan = settings._visibleCount;
                if (!settings.hideRowNumColumn) settings._finalColSpan++;
                if (!settings._hideLastColumn) settings._finalColSpan++;
                // Generate last column header if needed
                if (!settings._hideLastColumn) {
                    if (settings.rowButtonsInFront) {
                        if (settings.hideRowNumColumn) {
                            tbHeadCellRowButton = tbRow.insertCell(0);
                        } else {
                            tbHeadCellRowNum.colSpan = 2;
                            tbHeadCellRowButton = tbHeadCellRowNum;
                        }
                    } else {
                        tbHeadCellRowButton = tbRow.insertCell(-1);
                    }
                    tbHeadCellRowButton.className = 'ui-widget-header';
                }
                // Add caption when defined
                if (settings.caption) {
                    tbRow = tbHead.insertRow(0);
                    tbCell = tbRow.insertCell(-1);
                    tbCell.id = settings.idPrefix + '_caption_td';
                    tbCell.className = 'ui-state-active caption';
                    tbCell.colSpan = settings._finalColSpan;
                    $(tbCell).text(settings.caption);
                }
                // Handle footer row
                tbRow = tbFoot.insertRow(-1);
                tbCell = tbRow.insertCell(-1);
                tbCell.id = settings.idPrefix + '_footer_td';
                tbCell.colSpan = settings._finalColSpan;
                $('<input/>').attr({
                    type: 'hidden',
                    id: settings.idPrefix + '_rowOrder',
                    name: settings.idPrefix + '_rowOrder'
                }).appendTo(tbCell);
                // Make row invisible if all buttons are hidden
                if (settings.hideButtons.append && settings.hideButtons.removeLast
                        && (!$.isArray(settings.customFooterButtons) || settings.customFooterButtons.length == 0)) {
                    tbRow.style.display = 'none';
                } else {
                    if (!settings.hideButtons.append) {
                        createGridButton(settings.customGridButtons.append, 'ui-icon-plusthick')
						.attr({ title: settings._i18n.append }).addClass('append', settings._buttonClasses.append)
                        .click(function (evt) {
                            insertRow(tbWhole, 1, null, null);
                            if (evt && evt.preventDefault) evt.preventDefault();
                            return false;
                        }).appendTo(tbCell);
                    }
                    if (!settings.hideButtons.removeLast) {
                        createGridButton(settings.customGridButtons.removeLast, 'ui-icon-closethick')
						.attr({ title: settings._i18n.removeLast }).addClass('removeLast', settings._buttonClasses.removeLast)
						.click(function (evt) {
						    removeRow(tbWhole, null, this.value, false);
						    if (evt && evt.preventDefault) evt.preventDefault();
						    return false;
						}).appendTo(tbCell);
                    }
                    if (settings.customFooterButtons && settings.customFooterButtons.length) {
                        // Add front buttons
                        for (var y = settings.customFooterButtons.length - 1; y >= 0; y--) {
                            var buttonCfg = settings.customFooterButtons[y];
                            if (buttonCfg && buttonCfg.uiButton && buttonCfg.click && buttonCfg.atTheFront) {
                                $(tbCell).prepend(makeCustomBottomButton(tbWhole, buttonCfg));
                            }
                        }
                        // Add end buttons
                        for (var y = 0; y < settings.customFooterButtons.length; y++) {
                            var buttonCfg = settings.customFooterButtons[y];
                            if (buttonCfg && buttonCfg.uiButton && buttonCfg.click && !buttonCfg.atTheFront) {
                                $(tbCell).append(makeCustomBottomButton(tbWhole, buttonCfg));
                            }
                        }
                    }
                }
                // Enable dragging
                if (settings.rowDragging) {
                    $(tbBody).sortable({
                        axis: 'y',
                        containment: tbWhole,
                        handle: '.rowDrag',
                        helper: function (e, tr) {
                            var org = tr.children();
                            var helper = tr.clone();
                            // Fix the cell width of cloned table cell
                            helper.children().each(function (index) {
                                $(this).width(org.eq(index).width());
                                // Set the value of drop down list when drag (Issue #18)
                                var helperSelect = $('select', this);
                                if (helperSelect.length > 0) {
                                    for (var y = 0; y < helperSelect.length; y++) {
                                        var orgSelect = org.eq(index).find('select');
                                        if (orgSelect.length > y) {
                                            helperSelect[y].value = orgSelect[y].value;
                                        }
                                    }
                                }
                            });
                            return helper;
                        },
                        update: function (event, ui) {
                            var uniqueIndex = ui.item[0].id.substring(ui.item[0].id.lastIndexOf('_') + 1);
                            var tbRowIndex = ui.item[0].rowIndex - $('tr', tbHead).length;
                            gridRowDragged(tbWhole, ui.originalPosition.top > ui.position.top, uniqueIndex, tbRowIndex);
                        }
                    });
                }
                // Save options
                $(tbWhole).data('appendGrid', settings);
                if ($.isArray(options.initData)) {
                    // Load data if initData is array
                    loadData(tbWhole, options.initData, true);
                } else {
                    // Add empty rows
                    $(tbWhole).appendGrid('appendRow', settings.initRows);
                }
                // Show no rows in grid
                if (settings._rowOrder.length == 0) {
                    var empty = $('<td></td>').text(settings._i18n.rowEmpty).attr('colspan', settings._finalColSpan);
                    $('tbody', tbWhole).append($('<tr></tr>').addClass('empty').append(empty));
                }
            }
            return target;
        },
        isReady: function () {
            // Check the appendGrid is initialized or not
            var settings = checkGridAndGetSettings(this, true);
            if (settings) {
                return true;
            }
            return false;
        },
        isDataLoaded: function () {
            // Check the grid data is loaded by `load` method or `initData` parameter or not
            var settings = checkGridAndGetSettings(this);
            if (settings) {
                return settings._isDataLoaded;
            }
            return false;
        },
        load: function (records) {
            var settings = checkGridAndGetSettings(this), target = this;
            if (settings) {
                if (records != null && records.length > 0) {
                    loadData(target[0], records, false);
                } else {
                    emptyGrid(target[0]);
                }
            }
            return target;
        },
        appendRow: function (numOfRowOrRowArray) {
            return this.appendGrid('insertRow', numOfRowOrRowArray);
        },
        insertRow: function (numOfRowOrRowArray, rowIndex, callerUniqueIndex) {
            var settings = checkGridAndGetSettings(this);
            if (settings) {
                if (($.isArray(numOfRowOrRowArray) && numOfRowOrRowArray.length > 0) || ($.isNumeric(numOfRowOrRowArray) && numOfRowOrRowArray > 0)) {
                    // Define variables
                    var tbWhole = this[0];
                    insertResult = insertRow(tbWhole, numOfRowOrRowArray, rowIndex, callerUniqueIndex);
                    // Reorder sequence as needed
                    if ($.isNumeric(rowIndex) || $.isNumeric(callerUniqueIndex)) {
                        // Sort sequence
                        sortSequence(tbWhole, insertResult.rowIndex);
                        // Move focus
                        var insertUniqueIndex = settings._rowOrder[insertResult.addedRows[0]];
                        $('#' + settings.idPrefix + '_Insert_' + insertUniqueIndex, tbWhole).focus();
                    }
                }
            }
            return this;
        },
        removeRow: function (rowIndex, uniqueIndex) {
            var settings = checkGridAndGetSettings(this);
            if (settings && settings._rowOrder.length > 0) {
                removeRow(this[0], rowIndex, uniqueIndex, true);
            }
            return this;
        },
        emptyGrid: function () {
            var settings = checkGridAndGetSettings(this);
            if (settings) {
                emptyGrid(this[0]);
            }
            return target;
        },
        moveUpRow: function (rowIndex, uniqueIndex) {
            var settings = checkGridAndGetSettings(this), target = this;
            if (settings) {
                var tbWhole = target[0], trTarget, trSwap, swapSeq, oldIndex = null;
                var tbBody = tbWhole.getElementsByTagName('tbody')[0];
                if ($.isNumeric(rowIndex) && rowIndex > 0 && rowIndex < settings._rowOrder.length) {
                    oldIndex = rowIndex;
                    uniqueIndex = settings._rowOrder[rowIndex];
                    trTarget = document.getElementById(settings.idPrefix + '_Row_' + uniqueIndex, tbWhole);
                } else if ($.isNumeric(uniqueIndex)) {
                    oldIndex = findRowIndex(uniqueIndex, settings);
                    trTarget = document.getElementById(settings.idPrefix + '_Row_' + uniqueIndex, tbWhole);
                }
                if (oldIndex != null && oldIndex > 0) {
                    // Get row to swap
                    trSwap = document.getElementById(settings.idPrefix + '_Row_' + settings._rowOrder[oldIndex - 1], tbWhole);
                    // Remove current row
                    tbBody.removeChild(trTarget);
                    // Insert before the above row
                    tbBody.insertBefore(trTarget, trSwap);
                    // Update rowOrder
                    settings._rowOrder[oldIndex] = settings._rowOrder[oldIndex - 1];
                    settings._rowOrder[oldIndex - 1] = uniqueIndex;
                    // Update row label
                    swapSeq = $('td.first', trSwap).html();
                    $('td.first', trSwap).html($('td.first', trTarget).html());
                    $('td.first', trTarget).html(swapSeq)
                    // Save setting
                    saveSetting(tbWhole, settings);
                    // Change focus
                    $('td.last button.moveUp', trTarget).removeClass('ui-state-hover').blur();
                    $('td.last button.moveUp', trSwap).focus();
                    // Trigger event
                    if (settings.afterRowSwapped) {
                        settings.afterRowSwapped(tbWhole, oldIndex, oldIndex - 1);
                    }
                }
            }
            return target;
        },
        moveDownRow: function (rowIndex, uniqueIndex) {
            var settings = checkGridAndGetSettings(this), target = this;
            if (settings) {
                var tbWhole = target[0], trTarget, trSwap, swapSeq, oldIndex = null;
                var tbBody = tbWhole.getElementsByTagName('tbody')[0];
                if ($.isNumeric(rowIndex) && rowIndex >= 0 && rowIndex < settings._rowOrder.length - 1) {
                    oldIndex = rowIndex;
                    uniqueIndex = settings._rowOrder[rowIndex];
                    trTarget = document.getElementById(settings.idPrefix + '_Row_' + uniqueIndex, tbWhole);
                } else if ($.isNumeric(uniqueIndex)) {
                    oldIndex = findRowIndex(uniqueIndex, settings);
                    trTarget = document.getElementById(settings.idPrefix + '_Row_' + uniqueIndex, tbWhole);
                }
                if (oldIndex != null && oldIndex != settings._rowOrder.length - 1) {
                    // Get row to swap
                    trSwap = document.getElementById(settings.idPrefix + '_Row_' + settings._rowOrder[oldIndex + 1], tbWhole);
                    // Remove current row
                    tbBody.removeChild(trSwap);
                    // Insert before the above row
                    tbBody.insertBefore(trSwap, trTarget);
                    // Update rowOrder
                    settings._rowOrder[oldIndex] = settings._rowOrder[oldIndex + 1];
                    settings._rowOrder[oldIndex + 1] = uniqueIndex;
                    // Update row label
                    swapSeq = $('td.first', trSwap).html();
                    $('td.first', trSwap).html($('td.first', trTarget).html());
                    $('td.first', trTarget).html(swapSeq)
                    // Save setting
                    saveSetting(tbWhole, settings);
                    // Change focus
                    $('td.last button.moveDown', trTarget).removeClass('ui-state-hover').blur();
                    $('td.last button.moveDown', trSwap).focus();
                    // Trigger event
                    if (settings.afterRowSwapped) {
                        settings.afterRowSwapped(tbWhole, oldIndex, oldIndex + 1);
                    }
                }
            }
            return target;
        },
        showColumn: function (name) {
            var settings = checkGridAndGetSettings(this);
            if (settings && name) {
                // Find column index
                var colIndex = -1, tbWhole = this[0];
                for (var z = 0; z < settings.columns.length; z++) {
                    if (settings.columns[z].name == name) {
                        colIndex = z;
                        break;
                    }
                }
                // Make sure the column exist and show the column if it is invisible only
                if (colIndex != -1 && settings.columns[colIndex].invisible) {
                    // Change caption and footer column span
                    settings._visibleCount++;
                    settings._finalColSpan++;
                    $('#' + settings.idPrefix + '_caption_td').attr('colSpan', settings._finalColSpan);
                    $('#' + settings.idPrefix + '_footer_td').attr('colSpan', settings._finalColSpan);
                    // Remove invisible class on each row
                    $('#' + settings.idPrefix + '_' + name + '_td_head').removeClass('invisible');
                    for (var z = 0; z < settings._rowOrder.length; z++) {
                        var uniqueIndex = settings._rowOrder[z];
                        $('#' + settings.idPrefix + '_' + name + '_td_' + uniqueIndex).removeClass('invisible');
                    }
                    // Save changes
                    settings.columns[colIndex].invisible = false;
                    saveSetting(tbWhole, settings);
                }
            }
            return this;
        },
        hideColumn: function (name) {
            var settings = checkGridAndGetSettings(this);
            if (settings && name) {
                // Find column index
                var colIndex = -1, tbWhole = this[0];
                for (var z = 0; z < settings.columns.length; z++) {
                    if (settings.columns[z].name == name) {
                        colIndex = z;
                        break;
                    }
                }
                // Make sure the column exist and hide the column if it is visible only
                if (colIndex != -1 && !settings.columns[colIndex].invisible) {
                    // Change caption and footer column span
                    settings._visibleCount--;
                    settings._finalColSpan--;
                    $('#' + settings.idPrefix + '_caption_td').attr('colSpan', settings._finalColSpan);
                    $('#' + settings.idPrefix + '_footer_td').attr('colSpan', settings._finalColSpan);
                    // Add invisible class on each row
                    $('#' + settings.idPrefix + '_' + name + '_td_head').addClass('invisible');
                    for (var z = 0; z < settings._rowOrder.length; z++) {
                        var uniqueIndex = settings._rowOrder[z];
                        $('#' + settings.idPrefix + '_' + name + '_td_' + uniqueIndex).addClass('invisible');
                    }
                    // Save changes
                    settings.columns[colIndex].invisible = true;
                    saveSetting(tbWhole, settings);
                }
            }
            return this;
        },
        isColumnInvisible: function (name) {
            var settings = checkGridAndGetSettings(this);
            if (settings && name) {
                for (var z = 0; z < settings.columns.length; z++) {
                    if (settings.columns[z].name == name) {
                        return settings.columns[z].invisible;
                    }
                }
            }
            return null;
        },
        getRowCount: function () {
            var settings = checkGridAndGetSettings(this);
            if (settings) {
                return settings._rowOrder.length;
            }
            return null;
        },
        getUniqueIndex: function (rowIndex) {
            var settings = checkGridAndGetSettings(this);
            if (settings && $.isNumeric(rowIndex) && rowIndex < settings._rowOrder.length) {
                return settings._rowOrder[rowIndex];
            }
            return null;
        },
        getRowIndex: function (uniqueIndex) {
            var settings = checkGridAndGetSettings(this);
            if (settings && $.isNumeric(uniqueIndex)) {
                for (var z = 0; z < settings._rowOrder.length; z++) {
                    if (settings._rowOrder[z] == uniqueIndex) {
                        return z;
                    }
                }
            }
            return null;
        },
        getRowValue: function (rowIndex, uniqueIndex, loopIndex) {
            var settings = checkGridAndGetSettings(this), result = null;
            if (settings) {
                if ($.isNumeric(rowIndex) && rowIndex >= 0 && rowIndex < settings._rowOrder.length) {
                    uniqueIndex = settings._rowOrder[rowIndex];
                }
                if (!isEmpty(uniqueIndex)) {
                    result = getRowValue(settings, uniqueIndex, loopIndex);
                }
            }
            return result;
        },
        getAllValue: function (objectMode) {
            var settings = checkGridAndGetSettings(this), result = null;
            if (settings) {
                // Prepare result based on objectMode setting
                result = objectMode ? {} : [];
                // Process on each rows
                for (var z = 0; z < settings._rowOrder.length; z++) {
                    if (objectMode) {
                        rowValue = getRowValue(settings, settings._rowOrder[z], z);
                        $.extend(result, rowValue)
                    } else {
                        rowValue = getRowValue(settings, settings._rowOrder[z]);
                        result.push(rowValue);
                    }
                }
                if (objectMode) {
                    result['_RowCount'] = settings._rowOrder.length;
                }
            }
            return result;
        },
        getCtrlValue: function (name, rowIndex) {
            var settings = checkGridAndGetSettings(this);
            if (settings && rowIndex >= 0 && rowIndex < settings._rowOrder.length) {
                for (var z = 0; z < settings.columns.length; z++) {
                    if (settings.columns[z].name === name) {
                        return getCtrlValue(settings, z, settings._rowOrder[rowIndex]);
                    }
                }
            }
            return null;
        },
        setCtrlValue: function (name, rowIndex, value) {
            var settings = checkGridAndGetSettings(this);
            if (settings && rowIndex >= 0 && rowIndex < settings._rowOrder.length) {
                for (var z = 0; z < settings.columns.length; z++) {
                    if (settings.columns[z].name == name) {
                        setCtrlValue(settings, z, settings._rowOrder[rowIndex], value);
                        break;
                    }
                }
            }
            return this;
        },
        getCellCtrl: function (name, rowIndex) {
            var settings = checkGridAndGetSettings(this);
            if (settings && rowIndex >= 0 && rowIndex < settings._rowOrder.length) {
                var uniqueIndex = settings._rowOrder[rowIndex];
                for (var z = 0; z < settings.columns.length; z++) {
                    if (settings.columns[z].name === name) {
                        return getCellCtrl(settings.columns[z].type, settings.idPrefix, name, uniqueIndex);
                    }
                }
            }
            return null;
        },
        getCellCtrlByUniqueIndex: function (name, uniqueIndex) {
            var settings = checkGridAndGetSettings(this);
            if (settings) {
                for (var z = 0; z < settings.columns.length; z++) {
                    if (settings.columns[z].name === name) {
                        return getCellCtrl(settings.columns[z].type, settings.idPrefix, name, uniqueIndex);
                    }
                }
            }
            return null;
        },
        getRowOrder: function () {
            var settings = checkGridAndGetSettings(this);
            if (settings) {
                // Return a copy of `Row Order` array
                return settings._rowOrder.slice();
            }
            return null;
        },
        getColumns: function () {
            var settings = checkGridAndGetSettings(this);
            if (settings) {
                // Return a copy of the columns array
                return settings.columns.slice();
            }
            return null;
        }
    };
    function checkGridAndGetSettings(grid, noMsg) {
        // Check the jQuery grid object is initialized and return its settings
        var settings = null;
        if (grid.length == 1) {
            settings = grid.data('appendGrid');
            if (!settings && !noMsg) {
                alert(_systemMessages.notInit);
            }
        } else if (!noMsg) {
            alert(_systemMessages.getValueMultiGrid);
        }
        return settings;
    }
    function insertRow(tbWhole, numOfRowOrRowArray, rowIndex, callerUniqueIndex) {
        // Define variables
        var settings = $(tbWhole).data('appendGrid');
        var addedRows = [], parentIndex = null, uniqueIndex, ctrl, hidden = [];
        var tbHead = tbWhole.getElementsByTagName('thead')[0];
        var tbBody = tbWhole.getElementsByTagName('tbody')[0];
        // Check number of row to be inserted
        var numOfRow = numOfRowOrRowArray, loadData = false;
        if ($.isArray(numOfRowOrRowArray)) {
            numOfRow = numOfRowOrRowArray.length;
            loadData = true;
        }
        // Check parent row
        if ($.isNumeric(callerUniqueIndex)) {
            for (var z = 0; z < settings._rowOrder.length; z++) {
                if (settings._rowOrder[z] == callerUniqueIndex) {
                    rowIndex = z;
                    if (z != 0) parentIndex = z - 1;
                    break;
                }
            }
        }
        else if ($.isNumeric(rowIndex)) {
            if (rowIndex >= settings._rowOrder.length) {
                rowIndex = null;
            } else {
                parentIndex = rowIndex - 1;
            }
        }
        else if (settings._rowOrder.length != 0) {
            rowIndex = null;
            parentIndex = settings._rowOrder.length - 1;
        }
        // Remove empty row
        if (settings._rowOrder.length == 0) {
            $('tr.empty', tbWhole).remove();
        }
        // Add total number of row
        for (var z = 0; z < numOfRow; z++) {
            // Update variables
            settings._uniqueIndex++;
            uniqueIndex = settings._uniqueIndex;
            hidden.length = 0;
            // Check row insert index
            if ($.isNumeric(rowIndex)) {
                settings._rowOrder.splice(rowIndex, 0, uniqueIndex);
                tbRow = tbBody.insertRow(rowIndex);
                addedRows.push(rowIndex);
            }
            else {
                settings._rowOrder.push(uniqueIndex);
                tbRow = tbBody.insertRow(-1);
                addedRows.push(settings._rowOrder.length - 1);
            }
            tbRow.id = settings.idPrefix + '_Row_' + uniqueIndex;
            $(tbRow).data('appendGrid', uniqueIndex);
            // Add row number
            if (!settings.hideRowNumColumn) {
                tbCell = tbRow.insertCell(-1);
                $(tbCell).addClass('ui-widget-content first').text(settings._rowOrder.length);
            }
            // Process on each columns
            for (var y = 0; y < settings.columns.length; y++) {
                // Skip hidden
                if (settings.columns[y].type == 'hidden') {
                    hidden.push(y);
                    continue;
                }
                // Check column invisble
                var className = 'ui-widget-content';
                if (settings.columns[y].invisible) className += ' invisible';
                // Insert cell
                tbCell = tbRow.insertCell(-1);
                tbCell.id = settings.idPrefix + '_' + settings.columns[y].name + '_td_' + uniqueIndex;
                tbCell.className = className;
                if (settings.columns[y].cellCss != null) $(tbCell).css(settings.columns[y].cellCss);
                // Prepare control id and name
                var ctrlId = settings.idPrefix + '_' + settings.columns[y].name + '_' + uniqueIndex, ctrlName;
                if (typeof (settings.nameFormatter) == 'function') {
                    ctrlName = settings.nameFormatter(settings.idPrefix, settings.columns[y].name, uniqueIndex);
                } else {
                    ctrlName = ctrlId;
                }
                // Check control type
                ctrl = null;
                if (settings.columns[y].type == 'custom') {
                    if (typeof (settings.columns[y].customBuilder) == 'function') {
                        ctrl = settings.columns[y].customBuilder(tbCell, settings.idPrefix, settings.columns[y].name, uniqueIndex);
                    }
                }
                else if (settings.columns[y].type == 'select') {
                    ctrl = document.createElement('select');
                    ctrl.id = ctrlId;
                    ctrl.name = ctrlName;
                    // Build option list
                    if ($.isArray(settings.columns[y].ctrlOptions)) {
                        // For array type option list
                        if (settings.columns[y].ctrlOptions.length > 0) {
                            if ($.isPlainObject(settings.columns[y].ctrlOptions[0])) {
                                for (var x = 0; x < settings.columns[y].ctrlOptions.length; x++) {
                                    ctrl.options[ctrl.options.length] = new Option(settings.columns[y].ctrlOptions[x].label, settings.columns[y].ctrlOptions[x].value);
                                }
                            }
                            else {
                                for (var x = 0; x < settings.columns[y].ctrlOptions.length; x++) {
                                    ctrl.options[ctrl.options.length] = new Option(settings.columns[y].ctrlOptions[x], settings.columns[y].ctrlOptions[x]);
                                }
                            }
                        }
                    }
                    else if ($.isPlainObject(settings.columns[y].ctrlOptions)) {
                        // For plain object type option list
                        for (var x in settings.columns[y].ctrlOptions) {
                            ctrl.options[ctrl.options.length] = new Option(settings.columns[y].ctrlOptions[x], x);
                        }
                    }
                    else if (typeof (settings.columns[y].ctrlOptions) == 'string') {
                        // For string type option list
                        var arrayOpt = settings.columns[y].ctrlOptions.split(';');
                        for (var x = 0; x < arrayOpt.length; x++) {
                            var eqIndex = arrayOpt[x].indexOf(':');
                            if (-1 == eqIndex) {
                                ctrl.options[ctrl.options.length] = new Option(arrayOpt[x], arrayOpt[x]);
                            } else {
                                ctrl.options[ctrl.options.length] = new Option(arrayOpt[x].substring(eqIndex + 1, arrayOpt[x].length), arrayOpt[x].substring(0, eqIndex));
                            }
                        }
                    }
                    tbCell.appendChild(ctrl);
                }
                else if (settings.columns[y].type == 'checkbox') {
                    ctrl = document.createElement('input');
                    ctrl.type = 'checkbox';
                    ctrl.id = ctrlId;
                    ctrl.name = ctrlName;
                    ctrl.value = 1;
                    tbCell.appendChild(ctrl);
                    tbCell.style.textAlign = 'center';
                }
                else if (settings.columns[y].type == 'textarea') {
                    ctrl = document.createElement('textarea');
                    ctrl.id = ctrlId;
                    ctrl.name = ctrlName;
                    tbCell.appendChild(ctrl);
                }
                else if (-1 != settings.columns[y].type.search(/^(color|date|datetime|datetime\-local|email|month|number|range|search|tel|time|url|week)$/)) {
                    ctrl = document.createElement('input');
                    try {
                        ctrl.type = settings.columns[y].type;
                    }
                    catch (err) { /* Not supported type */ }
                    ctrl.id = ctrlId;
                    ctrl.name = ctrlName;
                    tbCell.appendChild(ctrl);
                }
                else {
                    // Generate text input
                    ctrl = document.createElement('input');
                    ctrl.type = 'text';
                    ctrl.id = ctrlId;
                    ctrl.name = ctrlName;
                    tbCell.appendChild(ctrl);
                    // Handle UI widget
                    if (settings.columns[y].type == 'ui-datepicker') {
                        $(ctrl).datepicker(settings.columns[y].uiOption);
                    } else if (settings.columns[y].type == 'ui-spinner') {
                        $(ctrl).spinner(settings.columns[y].uiOption);
                    } else if (settings.columns[y].type == 'ui-autocomplete') {
                        $(ctrl).autocomplete(settings.columns[y].uiOption);
                    }
                }
                // Add extra control properties
                if (settings.columns[y].type != 'custom') {
                    // Add control attributes as needed
                    if (settings.columns[y].ctrlAttr != null) $(ctrl).attr(settings.columns[y].ctrlAttr);
                    // Add control properties as needed
                    if (settings.columns[y].ctrlProp != null) $(ctrl).prop(settings.columns[y].ctrlProp);
                    // Add control CSS as needed
                    if (settings.columns[y].ctrlCss != null) $(ctrl).css(settings.columns[y].ctrlCss);
                    // Add control class as needed
                    if (settings.columns[y].ctrlClass != null) $(ctrl).addClass(settings.columns[y].ctrlClass);
                    // Add jQuery UI tooltip as needed
                    if (settings.columns[y].uiTooltip) $(ctrl).tooltip(settings.columns[y].uiTooltip);
                    // Add control events as needed
                    if (typeof (settings.columns[y].onClick) == 'function') {
                        $(ctrl).click({ caller: tbWhole, callback: settings.columns[y].onClick, uniqueIndex: uniqueIndex }, function (evt) {
                            evt.data.callback(evt, $(evt.data.caller).appendGrid('getRowIndex', evt.data.uniqueIndex));
                        });
                    }
                    if (typeof (settings.columns[y].onChange) == 'function') {
                        $(ctrl).change({ caller: tbWhole, callback: settings.columns[y].onChange, uniqueIndex: uniqueIndex }, function (evt) {
                            evt.data.callback(evt, $(evt.data.caller).appendGrid('getRowIndex', evt.data.uniqueIndex));
                        });
                    }
                }
                if (loadData) {
                    // Load data if needed
                    setCtrlValue(settings, y, uniqueIndex, numOfRowOrRowArray[z][settings.columns[y].name]);
                } else if (!isEmpty(settings.columns[y].value)) {
                    // Set default value
                    setCtrlValue(settings, y, uniqueIndex, settings.columns[y].value);
                }
            }
            // Add button cell if needed
            if (!settings._hideLastColumn || settings.columns.length > settings._visibleCount) {
                if (!settings.rowButtonsInFront) {
                    tbCell = tbRow.insertCell(-1);
                } else if (!settings.hideRowNumColumn) {
                    tbCell = tbRow.insertCell(1);
                } else {
                    tbCell = tbRow.insertCell(0);
                }
                tbCell.className = 'ui-widget-content last';
                if (settings._hideLastColumn) tbCell.style.display = 'none';
                // Add standard buttons
                if (!settings.hideButtons.insert) {
                    createGridButton(settings.customGridButtons.insert, 'ui-icon-arrowreturnthick-1-w')
						.attr({ id: settings.idPrefix + '_Insert_' + uniqueIndex, title: settings._i18n.insert, tabindex: -1 })
						.addClass('insert', settings._buttonClasses.insert).data('appendGrid', { uniqueIndex: uniqueIndex })
						.click(function (evt) {
						    var rowUniqueIndex = $(this).data('appendGrid').uniqueIndex;
						    $(tbWhole).appendGrid('insertRow', 1, null, rowUniqueIndex);
						    if (evt && evt.preventDefault) evt.preventDefault();
						    return false;
						}).appendTo(tbCell);
                }
                if (!settings.hideButtons.remove) {
                    createGridButton(settings.customGridButtons.remove, 'ui-icon-trash')
						.attr({ id: settings.idPrefix + '_Delete_' + uniqueIndex, title: settings._i18n.remove, tabindex: -1 })
						.addClass('remove', settings._buttonClasses.remove).data('appendGrid', { uniqueIndex: uniqueIndex })
                        .click(function (evt) {
                            var rowUniqueIndex = $(this).data('appendGrid').uniqueIndex;
                            removeRow(tbWhole, null, rowUniqueIndex, false);
                            if (evt && evt.preventDefault) evt.preventDefault();
                            return false;
                        }).appendTo(tbCell);
                }
                if (!settings.hideButtons.moveUp) {
                    createGridButton(settings.customGridButtons.moveUp, 'ui-icon-arrowthick-1-n')
						.attr({ id: settings.idPrefix + '_MoveUp_' + uniqueIndex, title: settings._i18n.moveUp, tabindex: -1 })
						.addClass('moveUp', settings._buttonClasses.moveUp).data('appendGrid', { uniqueIndex: uniqueIndex })
						.click(function (evt) {
						    var rowUniqueIndex = $(this).data('appendGrid').uniqueIndex;
						    $(tbWhole).appendGrid('moveUpRow', null, rowUniqueIndex);
						    if (evt && evt.preventDefault) evt.preventDefault();
						    return false;
						}).appendTo(tbCell);
                }
                if (!settings.hideButtons.moveDown) {
                    createGridButton(settings.customGridButtons.moveDown, 'ui-icon-arrowthick-1-s')
						.attr({ id: settings.idPrefix + '_MoveDown_' + uniqueIndex, title: settings._i18n.moveDown, tabindex: -1 })
						.addClass('moveDown', settings._buttonClasses.moveDown).data('appendGrid', { uniqueIndex: uniqueIndex })
						.click(function (evt) {
						    var rowUniqueIndex = $(this).data('appendGrid').uniqueIndex;
						    $(tbWhole).appendGrid('moveDownRow', null, rowUniqueIndex);
						    if (evt && evt.preventDefault) evt.preventDefault();
						    return false;
						}).appendTo(tbCell);
                }
                // Handle row dragging
                if (settings.rowDragging) {
                    $('<div/>').addClass('rowDrag ui-state-default ui-corner-all', settings._buttonClasses.rowDrag)
                        .attr('title', settings._i18n.rowDrag).append($('<div/>').addClass('ui-icon ui-icon-carat-2-n-s').append($('<span/>').addClass('ui-button-text').text('Drag')))
                        .appendTo(tbCell);
                }
                // Add hidden
                for (var y = 0; y < hidden.length; y++) {
                    ctrl = document.createElement('input');
                    ctrl.id = settings.idPrefix + '_' + settings.columns[hidden[y]].name + '_' + uniqueIndex;
                    ctrl.name = ctrl.id;
                    ctrl.type = 'hidden';

                    if (loadData) {
                        // Load data if needed
                        ctrl.value = numOfRowOrRowArray[z][settings.columns[hidden[y]].name];
                    } else if (!isEmpty(settings.columns[hidden[y]].value)) {
                        // Set default value
                        ctrl.value = settings.columns[hidden[y]].value;
                    }
                    tbCell.appendChild(ctrl);
                }
                // Add extra buttons
                if (settings.customRowButtons && settings.customRowButtons.length) {
                    // Add front buttons
                    for (var y = settings.customRowButtons.length - 1; y >= 0; y--) {
                        var buttonCfg = settings.customRowButtons[y];
                        if (buttonCfg && buttonCfg.uiButton && buttonCfg.click && buttonCfg.atTheFront) {
                            $(tbCell).prepend(makeCustomRowButton(tbWhole, buttonCfg, uniqueIndex));
                        }
                    }
                    // Add end buttons
                    for (var y = 0; y < settings.customRowButtons.length; y++) {
                        var buttonCfg = settings.customRowButtons[y];
                        if (buttonCfg && buttonCfg.uiButton && buttonCfg.click && !buttonCfg.atTheFront) {
                            $(tbCell).append(makeCustomRowButton(tbWhole, buttonCfg, uniqueIndex));
                        }
                    }
                }
            }
        }
        // Save setting
        saveSetting(tbWhole, settings);
        // Trigger events
        if ($.isNumeric(rowIndex)) {
            if (typeof (settings.afterRowInserted) == 'function') {
                settings.afterRowInserted(tbWhole, parentIndex, addedRows);
            }
        }
        else {
            if (typeof (settings.afterRowAppended) == 'function') {
                settings.afterRowAppended(tbWhole, parentIndex, addedRows);
            }
        }
        // Return added rows' uniqueIndex
        return { addedRows: addedRows, parentIndex: parentIndex, rowIndex: rowIndex };
    }
    function makeCustomBottomButton(tbWhole, buttonCfg) {
        var exButton = $('<button/>').attr({ type: 'button', tabindex: -1 })
        .button(buttonCfg.uiButton).click({ tbWhole: tbWhole }, buttonCfg.click);
        if (buttonCfg.btnClass) exButton.addClass(buttonCfg.btnClass);
        if (buttonCfg.btnCss) exButton.css(buttonCfg.btnCss);
        if (buttonCfg.btnAttr) exButton.attr(buttonCfg.btnAttr);
        return exButton;
    }
    function makeCustomRowButton(tbWhole, buttonCfg, uniqueIndex) {
        var exButton = $('<button/>').val(uniqueIndex).attr({ type: 'button', tabindex: -1 })
        .button(buttonCfg.uiButton).click({ tbWhole: tbWhole, uniqueIndex: uniqueIndex }, function (evt) {
            var rowData = $(evt.data.tbWhole).appendGrid('getRowValue', null, evt.data.uniqueIndex);
            buttonCfg.click(evt, evt.data.uniqueIndex, rowData);
        });
        if (buttonCfg.btnClass) exButton.addClass(buttonCfg.btnClass);
        if (buttonCfg.btnCss) exButton.css(buttonCfg.btnCss);
        if (buttonCfg.btnAttr) exButton.attr(buttonCfg.btnAttr);
        return exButton;
    }
    function removeRow(tbWhole, rowIndex, uniqueIndex, force) {
        var settings = $(tbWhole).data('appendGrid');
        var tbBody = tbWhole.getElementsByTagName('tbody')[0];
        if ($.isNumeric(uniqueIndex)) {
            for (var z = 0; z < settings._rowOrder.length; z++) {
                if (settings._rowOrder[z] == uniqueIndex) {
                    rowIndex = z;
                    break;
                }
            }
        }
        if ($.isNumeric(rowIndex)) {
            // Remove middle row
            if (force || typeof (settings.beforeRowRemove) != 'function' || settings.beforeRowRemove(tbWhole, rowIndex)) {
                settings._rowOrder.splice(rowIndex, 1);
                tbBody.deleteRow(rowIndex);
                // Save setting
                saveSetting(tbWhole, settings);
                // Sort sequence
                sortSequence(tbWhole, rowIndex);
                // Trigger event
                if (typeof (settings.afterRowRemoved) == 'function') {
                    settings.afterRowRemoved(tbWhole, rowIndex);
                }
            }
        }
        else {
            // Remove last row
            if (force || typeof (settings.beforeRowRemove) != 'function' || settings.beforeRowRemove(tbWhole, settings._rowOrder.length - 1)) {
                uniqueIndex = settings._rowOrder.pop();
                tbBody.deleteRow(-1);
                // Save setting
                saveSetting(tbWhole, settings);
                // Trigger event
                if (typeof (settings.afterRowRemoved) == 'function') {
                    settings.afterRowRemoved(tbWhole, null);
                }
            }
        }
        // Add empty row
        if (settings._rowOrder.length == 0) {
            var empty = $('<td></td>').text(settings._i18n.rowEmpty).attr('colspan', settings._finalColSpan);
            $('tbody', tbWhole).append($('<tr></tr>').addClass('empty').append(empty));
        }
    }
    function emptyGrid(tbWhole) {
        // Load settings
        var settings = $(tbWhole).data('appendGrid');
        // Remove rows
        $('tbody', tbWhole).empty();
        settings._rowOrder.length = 0;
        settings._uniqueIndex = 0;
        // Save setting
        saveSetting(tbWhole, settings);
        // Add empty row
        if (settings._rowOrder.length == 0) {
            var empty = $('<td></td>').text(settings._i18n.rowEmpty).attr('colspan', settings._finalColSpan);
            $('tbody', tbWhole).append($('<tr></tr>').addClass('empty').append(empty));
        }
    }
    function sortSequence(tbWhole, startIndex) {
        var settings = $(tbWhole).data('appendGrid');
        if (!settings.hideRowNumColumn) {
            for (var z = startIndex; z < settings._rowOrder.length; z++) {
                $('#' + settings.idPrefix + '_Row_' + settings._rowOrder[z] + ' td.first', tbWhole).text(z + 1);
            }
        }
    }
    function loadData(tbWhole, records, isInit) {
        var tbBody, tbRow, tbCell, uniqueIndex, insertResult;
        var settings = $(tbWhole).data('appendGrid');
        if (settings) {
            // Clear existing content
            tbBody = tbWhole.getElementsByTagName('tbody')[0];
            $(tbBody).empty();
            settings._rowOrder.length = 0;
            settings._uniqueIndex = 0;
            // Check any records
            if (records != null && records.length) {
                // Add rows
                insertResult = insertRow(tbWhole, records.length, null, null);
                // Set data
                for (var r = 0; r < insertResult.addedRows.length; r++) {
                    for (var c = 0; c < settings.columns.length; c++) {
                        setCtrlValue(settings, c, settings._rowOrder[r], records[r][settings.columns[c].name]);
                    }
                }
            }
            // Save setting
            settings._isDataLoaded = true;
            if (isInit) settings.initData = null;
            $(tbWhole).data('appendGrid', settings);
            // Trigger data loaded event
            if (typeof (settings.dataLoaded) == 'function') {
                settings.dataLoaded(tbWhole);
            }
        }
    }
    function findRowIndex(uniqueIndex, settings) {
        for (var z = 0; z < settings._rowOrder.length; z++) {
            if (settings._rowOrder[z] == uniqueIndex) {
                return z;
            }
        }
        return null;
    }
    function isEmpty(value) {
        return typeof (value) == 'undefined' || value == null;
    }
    function getObjValue(obj, key) {
        if (!isEmpty(obj) && $.isPlainObject(obj) && !isEmpty(obj[key])) {
            return obj[key];
        }
        return null;
    }
    function saveSetting(tbWhole, settings) {
        $(tbWhole).data('appendGrid', settings);
        $('#' + settings.idPrefix + '_rowOrder', tbWhole).val(settings._rowOrder.join());
    }
    function getRowIndex(settings, uniqueIndex) {
        var rowIndex = null;
        for (var z = 0; z < settings._rowOrder.length; z++) {
            if (settings._rowOrder[z] == uniqueIndex) {
                return z;
            }
        }
        return rowIndex;
    }
    function getRowValue(settings, uniqueIndex, loopIndex) {
        var result = {}, keyName = null;
        for (var z = 0; z < settings.columns.length; z++) {
            keyName = settings.columns[z].name + (isEmpty(loopIndex) ? '' : '_' + loopIndex);
            result[keyName] = getCtrlValue(settings, z, uniqueIndex);
        }
        return result;
    }
    function getCtrlValue(settings, colIndex, uniqueIndex) { // type, idPrefix, columnName, uniqueIndex
        var ctrl = null, type = settings.columns[colIndex].type, columnName = settings.columns[colIndex].name;
        if (type == 'checkbox') {
            ctrl = getCellCtrl(type, settings.idPrefix, columnName, uniqueIndex);
            if (ctrl == null)
                return null;
            else
                return ctrl.checked ? 1 : 0;
        }
        else if (type == 'custom') {
            if (typeof (settings.columns[colIndex].customGetter) == 'function')
                return settings.columns[colIndex].customGetter(settings.idPrefix, columnName, uniqueIndex);
            else
                return null;
        }
        else {
            ctrl = getCellCtrl(type, settings.idPrefix, columnName, uniqueIndex);
            if (ctrl == null)
                return null;
            else
                return ctrl.value;
        }
    }
    function getCellCtrl(type, idPrefix, columnName, uniqueIndex) {
        return document.getElementById(idPrefix + '_' + columnName + '_' + uniqueIndex);
    }
    function setCtrlValue(settings, colIndex, uniqueIndex, data) {
        var type = settings.columns[colIndex].type;
        var columnName = settings.columns[colIndex].name;
        if (type == 'checkbox') {
            getCellCtrl(type, settings.idPrefix, columnName, uniqueIndex).checked = (data != null && data != 0);
        }
        else if (type == 'custom') {
            if (typeof (settings.columns[colIndex].customSetter) == 'function') {
                settings.columns[colIndex].customSetter(settings.idPrefix, columnName, uniqueIndex, data);
            }
        }
        else {
            getCellCtrl(type, settings.idPrefix, columnName, uniqueIndex).value = (data == null ? '' : data);
        }
    }
    function gridRowDragged(tbWhole, isMoveUp, uniqueIndex, tbRowIndex) {
        // Get setting
        var settings = $(tbWhole).data('appendGrid');
        // Find the start sorting index
        var startIndex = -1;
        for (var z = 0; z < settings._rowOrder.length; z++) {
            if (settings._rowOrder[z] == uniqueIndex) {
                if (isMoveUp) {
                    startIndex = tbRowIndex;
                    settings._rowOrder.splice(z, 1);
                    settings._rowOrder.splice(tbRowIndex, 0, uniqueIndex);
                } else {
                    startIndex = z;
                    settings._rowOrder.splice(tbRowIndex + 1, 0, uniqueIndex);
                    settings._rowOrder.splice(z, 1);
                }
                break;
            }
        }
        // Do re-order
        sortSequence(tbWhole, startIndex);
        // Save setting
        saveSetting(tbWhole, settings);

        // Trigger event
        if (typeof (settings.afterRowDragged) == 'function') {
            settings.afterRowDragged(tbWhole, tbRowIndex);
        }
    }
    function createGridButton(param, uiIcon) {
        // Generate the standard grid action button based on its parameter.
        var genButton = null;
        if (param) {
            if (typeof (param) == 'function') {
                // Generate button if it is a function.
                genButton = $(param());
            } else if (param.nodeType) {
                // Clone the button if it is a DOM element.
                genButton = $(param).clone();
            } else if (param.icons) {
                // Generate jQuery UI Button if it is a plain object with `icons` property.
                genButton = $('<button/>').attr({ type: 'button' }).button(param);
            }
        }
        if (!genButton) {
            // Use default setting (jQuery UI Button) if button is not created.
            genButton = $('<button/>').attr({ type: 'button' }).button({ icons: { primary: uiIcon }, text: false });
        }
        return genButton;
    }
    /// <summary>
    /// Initialize append grid or calling its methods.
    /// </summary>
    $.fn.appendGrid = function (params) {
        if (_methods[params]) {
            return _methods[params].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof (params) === 'object' || !params) {
            return _methods.init.apply(this, arguments);
        } else {
            $.error(_systemMessages.notSupportMethod + params);
        }
    };
})(jQuery);