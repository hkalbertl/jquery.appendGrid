# jquery.appendGrid

**appendGrid** allow you to input structured data row by row such like filling spreadsheets. It allows you to add/remove/insert/delete row in the grid. The generated input/select/textarea controls are well named for submitting to server side applications such as ASP.NET/PHP/JSP. Multiple options and callback events are available to fit every situation.


## Demo
Lots of demo cases are available at [Demo section of **appendGrid** website](https://appendgrid.apphb.com/Demo).


## Prerequisite
- [jQuery](http://jquery.com) v1.11.1
- [jQuery UI](http://jqueryui.com) v1.11.1 with all components, or custom build included:
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
    <link href="jquery-ui-1.11.1.css" rel="stylesheet"/>
    <script type="text/javascript" src="jquery-1.11.1.js"></script>
	<script type="text/javascript" src="jquery-ui-1.11.1.js"></script>
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
Still have problems? Try to download a working sample in demo section!


## Documentation
The full list of options / methods / callback events are available in the [Documentation section of **appendGrid** website](https://appendgrid.apphb.com/Documentation).


## Wanna help **appendGrid**?
Yeah, you can:
- Add more unit test cases
- Suggest enhancements
- Report issues
- And more?


## Changelog
Changelog is available [here](https://github.com/hkalbertl/jquery.appendGrid/blob/master/CHANGELOG.md).


## License
Dual licensed under the [LGPL](http://www.gnu.org/licenses/lgpl.html)
and [MIT](http://www.opensource.org/licenses/mit-license.php) licenses.
