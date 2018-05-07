$.fn.appendGrid._fw.layout.buttonIcon = 'fas';
$.fn.appendGrid._fw.builders.icon = function (action, customIconName) {
    var iconName = null;
    if (customIconName) {
        iconName = customIconName;
    } else {
        switch (action) {
            case 'append':
                iconName = 'fa-plus';
                break;
            case 'removeLast':
                iconName = 'fa-minus';
                break;
            case 'insert':
                iconName = 'fa-reply';
                break;
            case 'remove':
                iconName = 'fa-trash';
                break;
            case 'moveUp':
                iconName = 'fa-arrow-up';
                break;
            case 'moveDown':
                iconName = 'fa-arrow-down';
                break;
        }
    }
    return $('<i></i>').addClass($.fn.appendGrid._fw.layout.buttonIcon).addClass(iconName);
};