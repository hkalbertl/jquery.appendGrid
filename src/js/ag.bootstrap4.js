
// Make sure appendGrid is defined
if ($.fn.appendGrid) {
    // Mandatory CSS classes / settings / functions for this UI framework that should not be changed
    $.fn.appendGrid._fw = {
        // The mandatory CSS classes to be added to elements
        layout: {
            table: 'table',
            thead: '',
            theadRow: '',
            theadCell: '',
            theadCellFirst: '',
            theadCellLast: '',
            tbody: '',
            tbodyRow: '',
            tbodyCell: '',
            tbodyCellFirst: '',
            tbodyCellLast: '',
            tfoot: '',
            tfootRow: '',
            tfootCell: '',
            // The CSS classes on row level button group.
            rowButtonGroup: 'btn-group',
            // The CSS classes on footer level button group.
            footerButtonGroup: 'btn-group',
            // CSS classes for all buttons.
            button: 'btn',
            // CSS classes for all button icons.
            buttonIcon: null
        },
        // Builder functions for different components
        builders: {
            // Button builder
            button: function (action, param) {
                // Check param
                var iconName = null, buttonClass = null;
                if (param) {
                    if ($.isPlainObject(param)) {
                        // Read the class name and icon from object
                        iconName = param.icon;
                        buttonClass = param.buttonClass;
                    } else if (typeof (param) == 'string') {
                        // Assume the string is icon name
                        iconName = param;
                    }
                }
                // Generate button with default settings
                var $button = $('<button/>').attr('type', 'button')
                    .addClass($.fn.appendGrid._fw.layout.button)
                    .addClass(buttonClass || $.fn.appendGrid.layout.button);
                // Generate icon and add to button
                var $icon = $.fn.appendGrid._fw.builders.icon(action, iconName);
                if ($icon) $icon.appendTo($button);
                // Return the button generated
                return $button;
            },
            // Icon builder, defined in icon framework such as fontawesome / octicons
            icon: null
        }
    };
    // Customizable CSS class to be applied to elements
    $.fn.appendGrid.layout = {
        // The mandatory CSS classes to be added to table
        table: 'table-sm',
        thead: '',
        theadRow: '',
        theadCell: '',
        theadCellFirst: '',
        theadCellLast: '',
        tbody: '',
        tbodyRow: '',
        tbodyCell: '',
        tbodyCellFirst: '',
        tbodyCellLast: '',
        tfoot: '',
        tfootRow: '',
        tfootCell: '',
        // The CSS classes on row level button group. Leave blank to disable button group generation.
        rowButtonGroup: 'btn-group-sm',
        // The CSS classes on footer level button group. Leave blank to disable button group generation.
        footerButtonGroup: 'btn-group-sm',
        // CSS classes for all buttons.
        button: 'btn-outline-secondary',
        // CSS classes for all button icons.
        buttonIcon: null
    };
}

