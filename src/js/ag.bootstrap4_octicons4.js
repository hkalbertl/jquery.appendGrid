$.fn.appendGrid._fw.layout.buttonIcon = 'octicon';
$.fn.appendGrid._fw.builders.icon = function (action, customIconName) {
    var iconName = null;
    if (customIconName) {
        iconName = customIconName;
    } else {
        switch (action) {
            case 'append':
                iconName = 'octicon-plus';
                break;
            case 'removeLast':
                iconName = 'octicon-dash';
                break;
            case 'insert':
                iconName = 'octicon-reply';
                break;
            case 'remove':
                iconName = 'octicon-trashcan';
                break;
            case 'moveUp':
                iconName = 'octicon-arrow-up';
                break;
            case 'moveDown':
                iconName = 'octicon-arrow-down';
                break;
        }
    }
    return $('<span></span>').addClass($.fn.appendGrid._fw.layout.buttonIcon).addClass(iconName);
};