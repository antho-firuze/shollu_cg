# Bootstrap Combogrid

JQuery Plugins Ajax Combobox with Bootstrap interface.

## Getting Started

In your web page:

```html
<link rel="stylesheet" href="plugins/bootstrap/css/bootstrap.min.css">
<link rel="stylesheet" href="css/shollu_cg-white.css">
<script src="plugins/jQuery/jQuery-2.1.4.min.js"></script>
<script src="js/shollu_cg.js"></script>
<script>
jQuery(function($) {
  $("#element").shollu_cg();
});
</script>
```

## Documentation
_(Coming soon)_

## Examples

For update queryParams:
```html
$("#element").shollu_cg({queryParams: {"id":4}});
```

For adding aditional field/row:
```html
$("#element").shollu_cg({ 
	addition: {"id":0, "name":"Non Standard"}
});
```

For update event onSelect/onChange:
```html
$("#element").combogrid({ 
	onSelect: function(rowData){ 
		$("#element_other").combogrid({queryParams: {"country_id":rowData.id}});
	},
	onChange: function(rowData){ 
		$("#element_other").combogrid({queryParams: {"country_id":rowData.id}});
	}
});
```

## Release History
_(Nothing yet)_
