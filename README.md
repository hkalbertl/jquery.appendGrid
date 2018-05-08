# jquery.appendGrid

**appendGrid** allow you to input structured data row by row such like filling spreadsheets. It allows you to add/remove/insert/delete row in the grid. The generated input/select/textarea controls are well named for submitting to server side applications such as ASP.NET/PHP/JSP. Multiple options and callback events are available to fit every situation.


## About verisons
**appendGrid** is moving to [version 2](../../tree/v2-dev) which support [Bootstrap 4](https://getbootstrap.com/) natively. For [version 1](../../tree/v1-dev) that based on [jQuery UI](https://jqueryui.com/) will provide bug fix only.


## Demo
Lots of demo cases are available on [Demo section](https://appendgrid.apphb.com/Demo) of **appendGrid** website.


## Prerequisite
- [jQuery](http://jquery.com) v1.12.4
- [jQuery UI](http://jqueryui.com) v1.12.1 with all components, or custom build included:
  - UI Core - Core
  - UI Core - Widget
  - Widgets - Button

For jQuery UI custom build option, you will need extra components as you wanted to use other jQuery widgets such as datepicker.


## How to use?
```html
<!DOCTYPE html>
<html>
<head>
    <!--jQuery and jQuery UI-->
    <link href="jquery-ui-1.12.1.css" rel="stylesheet"/>
    <script type="text/javascript" src="jquery-1.12.4.js"></script>
    <script type="text/javascript" src="jquery-ui-1.12.1.js"></script>
    <!--Reference the CSS and JS files-->
    <link href="jquery.appendGrid-x.x.x.css" rel="stylesheet"/>
    <script src="jquery.appendGrid-x.x.x.js"></script>
</head>
<body>
    <!--Prepare a table element as the grid-->
    <table id="tblAppendGrid"></table>
</body>
</html>
```
```javascript
// Initial the grid as you needed
$(function() {
    $('#tblAppendGrid').appendGrid({ /* Initial parameters */ });
});
```
Still have problems? Try to download a working sample in [demo section](https://appendgrid.apphb.com/Demo)!


## Documentation
The full list of options / methods / callback events are available on the [Documentation section](https://appendgrid.apphb.com/Documentation) of **appendGrid** website.


## Wanna help **appendGrid**?
Yeah, you can:
- Add more unit test cases
- Suggest enhancements
- Report issues
- And more?


## Changelog
Changelog is available [here](CHANGELOG.md).


## License
Dual licensed under the [LGPL](http://www.gnu.org/licenses/lgpl.html)
and [MIT](http://www.opensource.org/licenses/mit-license.php) licenses.
