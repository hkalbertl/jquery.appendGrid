// import dependencies
import IconDefault from './ag-icon-default';
import IconFontAwesome5 from './ag-icon-fontawesome5';
import IconMaterialDesignIcons3 from './ag-icon-materialdesignicons3';
import IconIonicons4 from './ag-icon-ionicons4';
import IconTypicons2 from './ag-icon-typicons2';
import IconOpenIconic from './ag-icon-openiconic';
import UiDefault from './ag-ui-default';
import UiBootstrap4 from './ag-ui-bootstrap4';
import UiBulma from './ag-ui-bulma';
import UiFoundation6 from './ag-ui-foundation6';
import * as Util from './ag-util';

class GridCore {

    constructor(options) {
        // Define *self* variable that will not mix with the *this* in event handlers
        const self = this;

        // Define private variables
        Object.assign(self, {
            // The UniqueIndex accumulate counter
            uniqueIndex: 0,
            // The row order array
            rowOrder: [],
            // Indicate data is loaded or not
            isDataLoaded: false,
            // Visible column count for internal calculation
            visibleCount: 0,
            // Total colSpan count after excluding `hideRowNumColumn` and not generating last column
            finalColSpan: 0,
            // Indicate to hide last column or not
            hideLastColumn: false,
            // Settings
            settings: null,
            // The table element
            tbWhole: null,
            // The table body element
            tbBody: null,
            // Icon Framework object to be used
            iconFramework: null,
            // UI Framework object to be used
            uiFramework: null
        });

        // Merge default options
        const settings = Object.assign({}, options);
        self.settings = settings;
        console.debug('ag:Options initialized');

        // Check the table element
        let tbWhole = null;
        if (typeof settings.element === 'string') {
            tbWhole = document.getElementById(settings.element);
        } else {
            tbWhole = settings.element;
        }
        if (!tbWhole || !tbWhole.tagName || tbWhole.tagName !== 'TABLE') {
            throw '*element* is not defined or is not a table DOM element.';
        }
        self.tbWhole = tbWhole;
        tbWhole.innerHTML = '';
        console.debug('ag:Checked element');

        // Check Icon framework
        if (settings.iconFramework === 'fontawesome5') {
            self.iconFramework = new IconFontAwesome5(settings.iconParams);
        } else if (settings.iconFramework === 'ionicon4') {
            self.iconFramework = new IconIonicons4(settings.iconParams);
        } else if (settings.iconFramework === 'materialdesignicons3') {
            self.iconFramework = new IconMaterialDesignIcons3(settings.iconParams);
        } else if (settings.iconFramework === 'openiconic') {
            self.iconFramework = new IconOpenIconic(settings.iconParams);
        } else if (settings.iconFramework === 'typicons2') {
            self.iconFramework = new IconTypicons2(settings.iconParams);
        } else if (!settings.iconFramework || settings.iconFramework === 'default') {
            self.iconFramework = new IconDefault(settings.iconParams);
        } else {
            throw `Unknown Icon framework *${settings.iconFramework}*.`;
        }
        console.debug('ag:Checked icon framework');

        // Check UI framework
        if (settings.uiFramework === 'bootstrap4') {
            self.uiFramework = new UiBootstrap4(settings.uiParams, settings.i18n, self.iconFramework);
        } else if (settings.uiFramework === 'bulma') {
            self.uiFramework = new UiBulma(settings.uiParams, settings.i18n, self.iconFramework);
        } else if (settings.uiFramework === 'foundation6') {
            self.uiFramework = new UiFoundation6(settings.uiParams, settings.i18n, self.iconFramework);
        } else if (!settings.uiFramework || settings.uiFramework === 'default') {
            self.uiFramework = new UiDefault(settings.uiParams, settings.i18n, self.iconFramework);
        } else {
            throw `Unknown UI framework *${settings.uiFramework}*.`;
        }
        console.debug('ag:Checked ui framework');

        // Check `idPrefix` is defined
        if (Util.isEmpty(settings.idPrefix)) {
            // Check table ID defined
            if (!tbWhole.id) {
                // Generate an ID using current time
                settings.idPrefix = 'ag' + new Date().getTime();
            }
            else {
                settings.idPrefix = tbWhole.id;
            }
            console.debug(`*idPrefix* = ${settings.idPrefix}`);
        }

        // Assign custom section classes
        if (settings.sectionClasses) {
            self.uiFramework.applySectionClasses(settings.sectionClasses);
        }

        // Config table element
        Util.applyClasses(tbWhole, self.uiFramework.getSectionClasses('table'));

        // Create thead
        const thead = self.createElement('thead');
        tbWhole.appendChild(thead);
        let tbRow = self.createElement('tr', 'theadRow'), tbCell;
        thead.appendChild(tbRow);
        let visibleCount = 0;
        if (!settings.hideRowNumColumn) {
            tbCell = self.createElement('th', 'theadCell');
            tbRow.appendChild(tbCell);
            visibleCount++;
        }
        // Add cell in thead as column display name
        let pendingSkipCol = 0;
        for (let z = 0; z < settings.columns.length; z++) {
            // Skip generating column for hidden
            if (settings.columns[z].type === 'hidden') {
                continue;
            }
            // Check skip header colSpan
            if (pendingSkipCol === 0) {
                // Add cell for column name in thead section
                tbCell = self.createElement('th', 'theadCell');
                tbRow.appendChild(tbCell);
                // Apply extra classes
                Util.applyClasses(tbCell, settings.columns[z].displayClass);
                // Apply style
                if (!Util.isEmpty(settings.columns[z].displayCss)) {
                    for (let styleName in settings.columns[z].displayCss) {
                        tbCell.style[styleName] = settings.columns[z].displayCss[styleName];
                    }
                }
                if (settings.columns[z].headerSpan > 1) {
                    tbCell.setAttribute('colSpan', settings.columns[z].headerSpan);
                    pendingSkipCol = settings.columns[z].headerSpan - 1;
                }
                // Add the display text
                if (typeof settings.columns[z].display === 'function') {
                    // Add column display text by function
                    settings.columns[z].display(tbCell);
                } else if (settings.columns[z].display) {
                    // Add column display text
                    tbCell.innerText = settings.columns[z].display;
                }
            } else {
                pendingSkipCol--;
            }
            visibleCount++;
        }
        // Check to hide last column or not
        tbCell = self.createElement('th', 'theadCell');
        if (settings.hideButtons.insert && settings.hideButtons.remove && settings.hideButtons.moveUp && settings.hideButtons.moveDown) {
            // && (!$.isArray(settings.customRowButtons) || settings.customRowButtons.length == 0)
            self.hideLastColumn = true;
            tbCell.style.display = 'none';
        } else {
            visibleCount++;
        }
        if (!self.hideLastColumn && settings.rowButtonsInFront) {
            if (settings.hideRowNumColumn) {
                // Insert a cell at the front
                tbRow.insertBefore(tbCell, tbRow.firstChild);
            } else {
                // Insert a cell as the second column
                tbRow.insertBefore(tbCell, tbRow.childNodes[1]);
            }
        } else {
            tbRow.appendChild(tbCell);
        }
        // Calculate the `finalColSpan` value
        self.finalColSpan = visibleCount;

        // Create tbody
        const tbBody = self.createElement('tbody');
        tbWhole.appendChild(tbBody);
        self.tbBody = tbBody;

        // Create tfoot
        const tfoot = self.createElement('tfoot');
        tbWhole.appendChild(tfoot);
        tbRow = self.createElement('tr', 'tfootRow');
        tfoot.appendChild(tbRow);
        tbCell = self.createElement('td', 'tfootCell');
        tbCell.colSpan = self.finalColSpan;
        tbRow.appendChild(tbCell);

        // Add hidden for rowOrder
        const rowOrderName = settings.idPrefix + '_rowOrder';
        const rowOrderCtrl = Util.createElem('input', rowOrderName, rowOrderName, null, 'hidden');
        tbCell.appendChild(rowOrderCtrl);

        if (settings.hideButtons.append && settings.hideButtons.removeLast) {
            // && (!$.isArray(settings.customFooterButtons) || settings.customFooterButtons.length == 0)
            tbRow.style.display = 'none';
        } else {
            // Create button group, if defined
            let buttonContainer = self.uiFramework.createButtonGroup();
            if (buttonContainer) {
                tbCell.appendChild(buttonContainer);
            } else {
                buttonContainer = tbCell;
            }
            if (!settings.hideButtons.append) {
                let appendButton = self.uiFramework.generateButton(buttonContainer, 'append');
                appendButton.addEventListener('click', function (evt) {
                    self.insertRow(1);
                });
            }
            if (!settings.hideButtons.removeLast) {
                let removeLastButton = self.uiFramework.generateButton(buttonContainer, 'removeLast');
                removeLastButton.addEventListener('click', function (evt) {
                    self.removeRow();
                });
            }
        }

        // Show empty grid message
        this.showEmptyMessage();

        // Save settings
        self.settings = settings;
        console.debug('ag:Initialized');
    }

    createElement(elementName, sectionName, elementId) {
        let classNames = this.uiFramework.getSectionClasses(sectionName || elementName);
        let element = Util.createElem(elementName, elementId, null, classNames);
        return element;
    }

    loadData(records, isInit = false) {
        if (!Array.isArray(records) || !records.length) {
            throw '*records* should be in array format!';
        }

        // Clear existing content
        const self = this;
        const settings = self.settings;
        self.tbBody.innerHTML = '';
        self.rowOrder.length = 0;
        self.uniqueIndex = 0;

        // Add rows
        const insertResult = self.insertRow(records.length);

        // Set data
        for (let r = 0; r < insertResult.addedRows.length; r++) {
            for (let c = 0; c < settings.columns.length; c++) {
                self.setCtrlValue(c, self.rowOrder[r], records[r][settings.columns[c].name]);
            }
            if (typeof settings.rowDataLoaded === 'function') {
                settings.rowDataLoaded(self.tbWhole, records[r], r, self.rowOrder[r]);
            }
        }

        // Save setting
        self.isDataLoaded = true;

        // Clear initData
        if (isInit) self.settings.initData = null;

        // Trigger data loaded event
        if (typeof settings.dataLoaded === 'function') {
            settings.dataLoaded(self.tbWhole, records);
        }
    }

    insertRow(numOfRowOrRowArray, rowIndex, callerUniqueIndex) {
        // Define variables
        const self = this;
        const settings = self.settings, uiFramework = self.uiFramework, tbBody = self.tbBody;
        let tbRow, tbCell, addedRows = [], parentIndex = null, reachMaxRow = false;
        // let tbWhole = self.tbWhole, tbSubRow = null;
        // let oldHeight = 0, oldScroll = 0;
        // Check number of row to be inserted
        let numOfRow = numOfRowOrRowArray, loadData = false;
        if (Array.isArray(numOfRowOrRowArray)) {
            numOfRow = numOfRowOrRowArray.length;
            loadData = true;
        }
        // Check parent row
        if (Util.isNumeric(callerUniqueIndex)) {
            for (let z = 0; z < self.rowOrder.length; z++) {
                if (self.rowOrder[z] === callerUniqueIndex) {
                    rowIndex = z;
                    if (z !== 0) parentIndex = z - 1;
                    break;
                }
            }
        } else if (Util.isNumeric(rowIndex)) {
            if (rowIndex >= self.rowOrder.length) {
                rowIndex = null;
            } else {
                parentIndex = rowIndex - 1;
            }
        } else if (self.rowOrder.length !== 0) {
            rowIndex = null;
            parentIndex = self.rowOrder.length - 1;
        }
        // Store old grid height
        /*
        if (settings.maintainScroll && !$.isNumeric(rowIndex)) {
            oldHeight = $(tbWhole).height();
            oldScroll = $(tbWhole).scrollParent().scrollTop();
        }
        */
        // Remove empty row
        if (self.rowOrder.length === 0) {
            tbBody.innerHTML = '';
        }
        // Add total number of row
        for (let z = 0; z < numOfRow; z++) {
            // Check maximum number of rows
            if (0 < settings.maxRowsAllowed && self.rowOrder.length >= settings.maxRowsAllowed) {
                reachMaxRow = true;
                break;
            }
            // Prepare variables
            let uniqueIndex = ++self.uniqueIndex, hiddenColumns = [];
            // Prepare the table row
            tbRow = self.createElement('tr', 'tbodyRow', settings.idPrefix + '_$row_' + uniqueIndex);
            tbRow.dataset.uniqueIndex = uniqueIndex;
            // Check row insert index
            if (Util.isNumeric(rowIndex)) {
                self.rowOrder.splice(rowIndex, 0, uniqueIndex);
                /*
                if (settings.useSubPanel) {
                    tbBody.insertBefore(tbSubRow = document.createElement('tr'), tbBody.childNodes[rowIndex * 2]);
                    tbBody.insertBefore(tbRow = document.createElement('tr'), tbBody.childNodes[rowIndex * 2]);
                } else {
                    tbBody.insertBefore(tbRow = document.createElement('tr'), tbBody.childNodes[rowIndex]);
                }
                */
                tbBody.insertBefore(tbRow, tbBody.childNodes[rowIndex]);
                addedRows.push(rowIndex);
            }
            else {
                self.rowOrder.push(uniqueIndex);
                tbBody.appendChild(tbRow);
                /*
                if (settings.useSubPanel) {
                    tbBody.appendChild(tbSubRow = document.createElement('tr'));
                }
                */
                addedRows.push(self.rowOrder.length - 1);
            }

            // Config on the sub panel row
            /*
            if (tbSubRow != null) {
                tbSubRow.id = settings.idPrefix + '_SubRow_' + uniqueIndex;
                $(tbSubRow).data('appendGrid', uniqueIndex);
                if (settings._sectionClasses.subPanel) {
                    tbSubRow.className = settings._sectionClasses.subPanel;
                }
            }
            */
            // Add row number
            if (!settings.hideRowNumColumn) {
                tbCell = self.createElement('td', 'tbodyCell', settings.idPrefix + '_$rowNum_' + uniqueIndex);
                tbCell.innerText = '' + self.rowOrder.length;
                Util.applyClasses(tbCell, uiFramework.getSectionClasses('first'));
                // if (settings.useSubPanel) tbCell.rowSpan = 2;
                tbRow.appendChild(tbCell);
            }
            // Process on each columns
            for (let y = 0; y < settings.columns.length; y++) {
                // Skip hidden
                if (settings.columns[y].type === 'hidden') {
                    hiddenColumns.push(y);
                    continue;
                }
                // Check column invisble
                // var className = 'ui-widget-content';
                // if (settings.columns[y].invisible) className += ' invisible';
                // Insert cell
                tbCell = self.createElement('td', 'tbodyCell');
                tbRow.appendChild(tbCell);
                // Apply extra CSS classes and styles
                Util.applyClasses(tbCell, settings.columns[y].cellClass);
                if (!Util.isEmpty(settings.columns[y].cellCss)) {
                    for (let styleName in settings.columns[y].cellCss) {
                        tbCell.style[styleName] = settings.columns[y].cellCss[styleName];
                    }
                }
                // Prepare control id and name
                let ctrlId = settings.idPrefix + '_' + settings.columns[y].name + '_' + uniqueIndex, ctrlName;
                if (typeof settings.nameFormatter === 'function') {
                    ctrlName = settings.nameFormatter(settings.idPrefix, settings.columns[y].name, uniqueIndex);
                } else {
                    ctrlName = ctrlId;
                }
                // Check control type
                let ctrl = null;
                const isCustom = (settings.columns[y].type === 'custom');
                if (isCustom) {
                    if (typeof settings.columns[y].customBuilder === 'function') {
                        ctrl = settings.columns[y].customBuilder(tbCell, settings.idPrefix, settings.columns[y].name, uniqueIndex);
                    }
                } else {
                    // Generate control
                    ctrl = self.uiFramework.generateControl(tbCell, settings.columns[y], ctrlId, ctrlName);
                    // Add control attributes as needed
                    if (!Util.isEmpty(settings.columns[y].ctrlAttr)) {
                        for (let attrName in settings.columns[y].ctrlAttr) {
                            ctrl.setAttribute(attrName, settings.columns[y].ctrlAttr[attrName]);
                        }
                    }
                    // Add control CSS as needed
                    if (!Util.isEmpty(settings.columns[y].ctrlCss)) {
                        for (let cssName in settings.columns[y].ctrlCss) {
                            ctrl.style[cssName] = settings.columns[y].ctrlCss[cssName];
                        }
                    }
                    // Add control events as needed
                    if (settings.columns[y].events) {
                        ctrl.dataset.columnName = settings.columns[y].name;
                        ctrl.dataset.uniqueIndex = uniqueIndex;
                        for (let name in settings.columns[y].events) {
                            let ctrlHandler = settings.columns[y].events[name];
                            ctrl.addEventListener(name, function (evt) {
                                evt.columnName = evt.currentTarget.dataset.columnName;
                                evt.uniqueIndex = parseInt(evt.currentTarget.dataset.uniqueIndex);
                                ctrlHandler(evt);
                            });
                        }
                    }
                }
                // Set default value
                if (loadData) {
                    // Load data if needed
                    self.setCtrlValue(y, uniqueIndex, numOfRowOrRowArray[z][settings.columns[y].name]);
                } else if (!Util.isEmpty(settings.columns[y].value)) {
                    // Set default value
                    self.setCtrlValue(y, uniqueIndex, settings.columns[y].value);
                }
                // Trigger ctrlAdded callbacks
                if (!isCustom && typeof settings.columns[y].ctrlAdded === 'function') {
                    settings.columns[y].ctrlAdded(ctrl, tbCell, uniqueIndex);
                }
            }
            // Add button cell if needed
            tbCell = self.createElement('td', 'tbodyCell', settings.idPrefix + '_$rowButton_' + uniqueIndex);
            if (self.hideLastColumn || !settings.rowButtonsInFront) {
                tbRow.appendChild(tbCell);
            } else if (!settings.hideRowNumColumn) {
                tbRow.insertBefore(tbCell, tbRow.childNodes[1]);
            } else {
                tbRow.insertBefore(tbCell, tbRow.firstChild);
            }
            // Add hidden controls
            hiddenColumns.forEach(function (hi) {
                // Prepare control ID / name
                const hiddenName = settings.columns[hi].name;
                let ctrlId = settings.idPrefix + '_' + hiddenName + '_' + uniqueIndex, ctrlName;
                if (typeof settings.nameFormatter === 'function') {
                    ctrlName = settings.nameFormatter(settings.idPrefix, hiddenName, uniqueIndex);
                } else {
                    ctrlName = ctrlId;
                }
                // Create hidden element
                tbCell.appendChild(Util.createElem('input', ctrlId, ctrlName, null, 'hidden'));
                // Assign value
                if (loadData) {
                    // Load data if needed
                    self.setCtrlValue(hi, uniqueIndex, numOfRowOrRowArray[z][hiddenName]);
                } else if (!Util.isEmpty(settings.columns[hi].value)) {
                    // Set default value
                    self.setCtrlValue(hi, uniqueIndex, settings.columns[hi].value);
                }
            });
            // Check to add row buttons
            if (self.hideLastColumn) {
                // Set display = none if not showing the button cell
                tbCell.style.display = 'none';
            } else if (settings.columns.length > self.visibleCount) {
                Util.applyClasses(tbCell, uiFramework.getSectionClasses('last'));
                // Check to use button group or not
                let container = uiFramework.createButtonGroup();
                if (container) {
                    tbCell.appendChild(container);
                } else {
                    container = tbCell;
                }
                // Add standard buttons
                ['insert', 'remove', 'moveUp', 'moveDown'].forEach(function (type) {
                    if (!settings.hideButtons[type]) {
                        const buttonId = settings.idPrefix + '_$' + type + '_' + uniqueIndex;
                        const button = uiFramework.generateButton(container, type, buttonId);
                        button.dataset.uniqueIndex = uniqueIndex;
                        button.addEventListener('click', function (evt) {
                            const callerUniqueIndex = parseInt(evt.currentTarget.dataset.uniqueIndex);
                            self.rowButtonActions(type, callerUniqueIndex);
                        });
                    }
                });
                // Add extra buttons
                /*
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
                */
            }
            // Create sub panel
            /*
            if (settings.useSubPanel) {
                tbSubRow.appendChild(tbCell = document.createElement('td'));
                tbCell.className = 'ui-widget-content';
                tbCell.colSpan = settings._visibleCount + (settings._hideLastColumn ? 0 : 1);
                if ($.isFunction(settings.subPanelBuilder)) {
                    settings.subPanelBuilder(tbCell, uniqueIndex);
                }
            }
            */
        }

        // Save setting
        self.saveSetting();

        // Sort row number
        if (!settings.hideRowNumColumn && !Util.isEmpty(rowIndex)) {
            self.sortSequence(rowIndex);
        }

        // Trigger grid callbacks
        if (Util.isNumeric(rowIndex)) {
            if (typeof settings.afterRowInserted === 'function') {
                settings.afterRowInserted(self.tbWhole, parentIndex, addedRows);
            }
        } else {
            if (typeof settings.afterRowAppended === 'function') {
                settings.afterRowAppended(self.tbWhole, parentIndex, addedRows);
            }
        }
        if (reachMaxRow && typeof settings.maxNumRowsReached === 'function') {
            settings.maxNumRowsReached();
        }
        // Scroll the page when append row
        /*
        if (settings.maintainScroll && !$.isNumeric(rowIndex)) {
            // Try to maintain the height so that user no need to scroll every time when row added
            var newHeight = $(tbWhole).height();
            $(tbWhole).scrollParent().scrollTop(oldScroll + newHeight - oldHeight);
        }
        */
        // Return added rows' uniqueIndex
        return { addedRows: addedRows, parentIndex: parentIndex, rowIndex: rowIndex };
    }

    removeRow(rowIndex, uniqueIndex, force) {
        // Define variables
        const self = this;
        let settings = self.settings, tbBody = self.tbBody;
        if (Util.isNumeric(uniqueIndex)) {
            for (let z = 0; z < self.rowOrder.length; z++) {
                if (self.rowOrder[z] === uniqueIndex) {
                    rowIndex = z;
                    break;
                }
            }
        }
        if (Util.isNumeric(rowIndex)) {
            // Remove middle row
            if (force || typeof settings.beforeRowRemove !== 'function' || settings.beforeRowRemove(self.tbWhole, rowIndex)) {
                self.rowOrder.splice(rowIndex, 1);
                /*
                if (settings.useSubPanel) {
                    tbBody.removeChild(tbBody.childNodes[rowIndex * 2]);
                    tbBody.removeChild(tbBody.childNodes[rowIndex * 2]);
                } else {
                    tbBody.removeChild(tbBody.childNodes[rowIndex]);
                }
                */
                tbBody.removeChild(tbBody.childNodes[rowIndex]);
                // Save setting
                self.saveSetting();
                // Sort sequence
                if (!settings.hideRowNumColumn) {
                    self.sortSequence(rowIndex);
                }
                // Trigger event
                if (typeof settings.afterRowRemoved === 'function') {
                    settings.afterRowRemoved(self.tbWhole, rowIndex);
                }
            }
        } else {
            // Store old window scroll value
            /*
            var oldHeight = 0, oldScroll = 0;
            if (settings.maintainScroll) {
                oldHeight = $(tbWhole).height();
                oldScroll = $(tbWhole).scrollParent().scrollTop();
            }
            */
            // Remove last row
            if (force || typeof settings.beforeRowRemove !== 'function' || settings.beforeRowRemove(self.tbWhole, self.rowOrder.length - 1)) {
                uniqueIndex = self.rowOrder.pop();
                tbBody.removeChild(tbBody.lastChild);
                /*
                if (settings.useSubPanel) {
                    tbBody.removeChild(tbBody.lastChild);
                }
                */
                // Save setting
                self.saveSetting();
                // Trigger event
                if (typeof settings.afterRowRemoved === 'function') {
                    settings.afterRowRemoved(self.tbWhole, null);
                }
            }
            // Scroll the page when append row
            /*
            if (settings.maintainScroll) {
                // Try to maintain the height so that user no need to scroll every time when row added
                var newHeight = $(tbWhole).height();
                $(tbWhole).scrollParent().scrollTop(oldScroll + newHeight - oldHeight);
            }
            */
        }
        // Add empty row
        if (self.rowOrder.length === 0) {
            self.showEmptyMessage();
        }
    }

    moveUpRow(rowIndex, uniqueIndex) {
        const self = this;
        let settings = self.settings, tbBody = self.tbBody, oldIndex = null; // trAdtTarget
        if (Util.isNumeric(rowIndex) && rowIndex > 0 && rowIndex < self.rowOrder.length) {
            oldIndex = rowIndex;
            uniqueIndex = self.rowOrder[rowIndex];
        } else if (Util.isNumeric(uniqueIndex)) {
            oldIndex = self.findRowIndex(uniqueIndex);
        }
        if (!Util.isEmpty(oldIndex) && oldIndex > 0) {
            // Get row to swap
            let swapUniqueIndex = self.rowOrder[oldIndex - 1];
            let trTarget = document.getElementById(settings.idPrefix + '_$row_' + uniqueIndex);
            let trSwap = document.getElementById(settings.idPrefix + '_$row_' + swapUniqueIndex);
            // Get the sub panel row if used
            /*
            if (settings.useSubPanel) {
                trAdtTarget = document.getElementById(settings.idPrefix + '_SubRow_' + uniqueIndex, tbWhole);
            }
            */
            // Remove current row
            tbBody.removeChild(trTarget);
            /*
            if (settings.useSubPanel) {
                tbBody.removeChild(trAdtTarget);
            }
            */
            // Insert before the above row
            tbBody.insertBefore(trTarget, trSwap);
            /*
            if (settings.useSubPanel) {
                tbBody.insertBefore(trAdtTarget, trSwap);
            }
            */
            // Update rowOrder
            self.rowOrder[oldIndex] = swapUniqueIndex;
            self.rowOrder[oldIndex - 1] = uniqueIndex;
            // Update row label
            if (!settings.hideRowNumColumn) {
                let targetRowNumCell = document.getElementById(settings.idPrefix + '_$rowNum_' + uniqueIndex);
                let swapRowNumCell = document.getElementById(settings.idPrefix + '_$rowNum_' + swapUniqueIndex);
                let swapSeq = swapRowNumCell.innerHTML;
                swapRowNumCell.innerHTML = targetRowNumCell.innerHTML;
                targetRowNumCell.innerHTML = swapSeq;
            }
            // Save setting
            self.saveSetting();
            // Change focus
            document.getElementById(settings.idPrefix + '_$moveUp_' + uniqueIndex).blur();
            document.getElementById(settings.idPrefix + '_$moveUp_' + swapUniqueIndex).focus();
            // Trigger event
            if (typeof settings.afterRowSwapped === 'function') {
                settings.afterRowSwapped(self.tbWhole, oldIndex, oldIndex - 1);
            }
        }
    }

    moveDownRow(rowIndex, uniqueIndex) {
        const self = this;
        let settings = self.settings, tbBody = self.tbBody, oldIndex = null; // trAdtTarget
        if (Util.isNumeric(rowIndex) && rowIndex >= 0 && rowIndex < self.rowOrder.length - 1) {
            oldIndex = rowIndex;
            uniqueIndex = self.rowOrder[rowIndex];
        } else if (Util.isNumeric(uniqueIndex)) {
            oldIndex = self.findRowIndex(uniqueIndex);
        }
        if (!Util.isEmpty(oldIndex) && oldIndex !== self.rowOrder.length - 1) {
            // Get row to swap
            let swapUniqueIndex = self.rowOrder[oldIndex + 1];
            let trTarget = document.getElementById(settings.idPrefix + '_$row_' + uniqueIndex);
            let trSwap = document.getElementById(settings.idPrefix + '_$row_' + swapUniqueIndex);
            // Get the sub panel row if used
            /*
            if (settings.useSubPanel) {
                trAdtSwap = document.getElementById(settings.idPrefix + '_SubRow_' + settings._rowOrder[oldIndex + 1], tbWhole);
            }
            */
            // Remove current row
            tbBody.removeChild(trSwap);
            // Insert before the above row
            tbBody.insertBefore(trSwap, trTarget);
            /*
            if (settings.useSubPanel) {
                tbBody.insertBefore(trAdtSwap, trTarget);
            }
            */
            // Update rowOrder
            self.rowOrder[oldIndex] = swapUniqueIndex;
            self.rowOrder[oldIndex + 1] = uniqueIndex;
            // Update row label
            if (!settings.hideRowNumColumn) {
                let targetRowNumCell = document.getElementById(settings.idPrefix + '_$rowNum_' + uniqueIndex);
                let swapRowNumCell = document.getElementById(settings.idPrefix + '_$rowNum_' + swapUniqueIndex);
                let swapSeq = swapRowNumCell.innerHTML;
                swapRowNumCell.innerHTML = targetRowNumCell.innerHTML;
                targetRowNumCell.innerHTML = swapSeq;
            }
            // Save setting
            self.saveSetting();
            // Change focus
            document.getElementById(settings.idPrefix + '_$moveDown_' + uniqueIndex).blur();
            document.getElementById(settings.idPrefix + '_$moveDown_' + swapUniqueIndex).focus();
            // Trigger event
            if (typeof settings.afterRowSwapped === 'function') {
                settings.afterRowSwapped(self.tbWhole, oldIndex, oldIndex + 1);
            }
        }
    }

    setCtrlValue(colIndex, uniqueIndex, data) {
        const self = this;
        let settings = self.settings,
            type = settings.columns[colIndex].type,
            columnName = settings.columns[colIndex].name;
        // Handle values by type
        if (type === 'custom') {
            if (typeof settings.columns[colIndex].customSetter === 'function') {
                settings.columns[colIndex].customSetter(settings.idPrefix, columnName, uniqueIndex, data);
            } else {
                // `customSetter` is not a function?? Skip handling...
            }
        } else {
            let element = self.getCellCtrl(settings.idPrefix, columnName, uniqueIndex);
            if (type === 'checkbox') {
                // For checkbox type, check the data type of value
                if (typeof data === 'boolean') {
                    element.checked = data;
                } else if (Util.isNumeric(data)) {
                    element.checked = data !== 0;
                } else {
                    element.checked = !Util.isEmpty(data);
                }
            } else {
                // For other input types
                element.value = Util.isEmpty(data) ? '' : data;
            }
        }
    }

    getCellCtrl(idPrefix, columnName, uniqueIndex) {
        return document.getElementById(idPrefix + '_' + columnName + '_' + uniqueIndex);
    }

    getCtrlValue(colIndex, uniqueIndex) {
        const self = this;
        const settings = self.settings;
        const column = settings.columns[colIndex];
        // let type = self.settings.columns[colIndex].type, columnName = settings.columns[colIndex].name;
        if (column.type === 'custom') {
            if (typeof column.customGetter === 'function') {
                return column.customGetter(settings.idPrefix, column.name, uniqueIndex);
            } else {
                // customGetter is not defined
                throw `*customGetter* of column *${column.name}* is not defined.`;
            }
        } else {
            let ctrl = self.getCellCtrl(settings.idPrefix, column.name, uniqueIndex);
            if (ctrl === null) {
                return null;
            }
            else if (column.type === 'checkbox') {
                return ctrl.checked ? 1 : 0;
            } else {
                return ctrl.value;
            }
        }
    }

    getRowValue(uniqueIndex, loopIndex) {
        const self = this;
        let result = {}, suffix = (Util.isEmpty(loopIndex) ? '' : '_' + loopIndex);
        self.settings.columns.forEach(function (column, colIndex) {
            let keyName = column.name + suffix;
            result[keyName] = self.getCtrlValue(colIndex, uniqueIndex);
        });
        // Merge control values from sub panel if getter method defined
        /*
        if (settings.useSubPanel && $.isFunction(settings.subPanelGetter)) {
            var adtData = settings.subPanelGetter(uniqueIndex);
            if ($.isPlainObject(adtData)) {
                if (suffix == '') {
                    // Extend to row data directly for array mode
                    $.extend(result, adtData);
                } else {
                    // For returning values in object mode, add suffix to all keys
                    var newData = {};
                    for (var key in adtData) {
                        newData[key + suffix] = adtData[key];
                    }
                    $.extend(result, newData);
                }
            }
        }
        */
        return result;
    }

    getColumnIndex(name) {
        const columns = this.settings.columns;
        for (let c = 0; c < columns.length; c++) {
            if (columns[c].name === name) {
                return c;
            }
        }
        return null;
    }

    isRowEmpty(uniqueIndex) {
        const self = this;
        const columns = self.settings.columns;
        for (let c = 0; c < columns.length; c++) {
            const emptyCriteria = columns[c].emptyCriteria;
            let currentValue = self.getCtrlValue(c, uniqueIndex);
            // Check the empty criteria is function
            if (typeof emptyCriteria === 'function') {
                if (!emptyCriteria(currentValue)) {
                    return false;
                }
            } else {
                // Find the default value
                let defaultValue = null;
                if (!Util.isEmpty(emptyCriteria)) {
                    defaultValue = emptyCriteria;
                } else {
                    // Check default value based on its type
                    const colType = columns[c].type;
                    if (colType === 'checkbox') {
                        defaultValue = 0;
                    } else if (colType === 'select') {
                        const options = self.getCellCtrl(self.settings.idPrefix, columns[c].name, uniqueIndex).options;
                        if (options.length > 0) {
                            defaultValue = options[0].value;
                        } else {
                            defaultValue = '';
                        }
                    } else {
                        defaultValue = '';
                    }
                }
                // Compare with the default value
                if (currentValue !== defaultValue) {
                    return false;
                }
            }
        }
        return true;
    }

    findRowIndex(uniqueIndex) {
        for (let z = 0; z < this.rowOrder.length; z++) {
            if (this.rowOrder[z] === uniqueIndex) {
                return z;
            }
        }
        return null;
    }

    saveSetting() {
        const self = this;
        document.getElementById(self.settings.idPrefix + '_rowOrder').value = self.rowOrder.join();
    }

    showEmptyMessage() {
        const self = this;
        self.tbBody.innerHTML = '';
        const tbRow = self.createElement('tr', 'tbodyRow');
        self.tbBody.appendChild(tbRow);
        const tbCell = self.createElement('td', 'tbodyCell');
        tbCell.setAttribute('colspan', self.finalColSpan);
        Util.applyClasses(tbCell, self.uiFramework.getSectionClasses('empty'));
        tbCell.innerText = self.settings.i18n.rowEmpty;
        tbRow.appendChild(tbCell);
    }

    /**
     * Update the row number displayed in the front of each row.
     * @param {*} startIndex 
     */
    sortSequence(startIndex) {
        const self = this;
        for (let z = startIndex || 0; z < self.rowOrder.length; z++) {
            document.getElementById(self.settings.idPrefix + '_$rowNum_' + self.rowOrder[z])
                .innerText = '' + (z + 1);
        }
    }

    rowButtonActions(type, uniqueIndex) {
        const self = this;
        if (type === 'insert') {
            self.insertRow(1, null, uniqueIndex);
        } else if (type === 'remove') {
            self.removeRow(null, uniqueIndex);
        } else if (type === 'moveUp') {
            self.moveUpRow(null, uniqueIndex);
        } else if (type === 'moveDown') {
            self.moveDownRow(null, uniqueIndex);
        }
    }
}

export default GridCore;
