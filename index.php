<?php	$base_url = "http://localhost/ci/app1/"; ?>
<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" href="plugins/bootstrap/css/bootstrap.min.css">
	<link rel="stylesheet" href="css/shollu_cg-white.css">
	<script src="plugins/jQuery/jQuery-2.1.4.min.js"></script>
	<script src="js/shollu_cg.js"></script>
	<script src="plugins/bootstrap.helper.js"></script>
	<script src="plugins/common.func.js"></script>
</head>
<body>
<script>
var col = [];
var form = $('<form />', { autocomplete:'off', style:'margin:15px;' });
col.push(BSHelper.Combogrid({ label:"Country", idname:"country_id", url:"<?=$base_url;?>systems/c_1country", remote:true }));
col.push(BSHelper.Combogrid({ label:"Province", idname:"province_id", url:"<?=$base_url;?>systems/c_2province", remote:true }));
col.push(BSHelper.Combogrid({ label:"City", idname:"city_id", url:"<?=$base_url;?>systems/c_3city", value: -1, remote:true }));
col.push(BSHelper.Combogrid({ label:"District", idname:"district_id", url:"<?=$base_url;?>systems/c_4district", value: -1, remote:true }));
col.push(BSHelper.Combogrid({ label:"Village", idname:"village_id", url:"<?=$base_url;?>systems/c_5village", value: -1, remote:true }));
col.push(BSHelper.Input({ type:"text", label:"Villagex", idname:"village_idx", value: -1 }));
form.append(subRow(subCol(12, col)));
col = [];
col.push( BSHelper.Button({ type:"button", idname:"btn-disable", label:"Disable", cls:"btn-primary" }) );
col.push( BSHelper.Button({ type:"button", idname:"btn-enable", label:"Enable", cls:"btn-primary" }) );
col.push( BSHelper.Button({ type:"button", idname:"btn-init", label:"Init", cls:"btn-primary" }) );
col.push( BSHelper.Button({ type:"button", idname:"btn-destroy", label:"Destroy", cls:"btn-primary" }) );
col.push( BSHelper.Button({ type:"button", idname:"btn-setParams", label:"setParams Village (district_id = 3276030)", cls:"btn-primary" }) );
col.push( BSHelper.Button({ type:"button", idname:"btn-getValue", label:"getValue Village", cls:"btn-primary" }) );
col.push( BSHelper.Button({ type:"button", idname:"btn-setValue", label:"setValue Village (1101010012:Labuhan Bakti)", cls:"btn-primary" }) );
col.push( BSHelper.Button({ type:"button", idname:"btn-setValue2", label:"setValue Village (null/-1)", cls:"btn-primary" }) );
col.push( BSHelper.Button({ type:"button", idname:"btn-version", label:"Version", cls:"btn-primary" }) );
form.append(subRow(subCol(12, col)));
$('body').append( form );

/* $("#country_id").shollu_cg({ 
	url: $(this).attr('url'),
	idField: 'id',
	textField: 'name',
	emptyMessage: '<center><b>No results were found</b></center>',
	remote: $(this).attr('remote'),
}); */

$("#country_id").shollu_cg({ 
	onSelect: function(rowData){
		console.log(rowData);
		$("#province_id")
			.shollu_cg({ queryParams: { "country_id":rowData.id } })
			.shollu_cg('setValue', '');
	}
});

$("#province_id").shollu_cg({ 
	onSelect: function(rowData){
		console.log(rowData);
		$("#city_id")
			.shollu_cg({ queryParams: { "province_id":rowData.id } })
			.shollu_cg('setValue', '');
	}
});

$("#city_id").shollu_cg({ 
	onSelect: function(rowData){
		console.log(rowData);
		$("#district_id")
			.shollu_cg({ queryParams: { "city_id":rowData.id } })
			.shollu_cg('setValue', '');
	}
});


$("#district_id").shollu_cg({ 
	onSelect: function(rowData){
		console.log(rowData);
		$("#village_id")
			.shollu_cg({ queryParams: { "district_id":rowData.id } })
			.shollu_cg('setValue', '');
	}
});

$("#village_id").shollu_cg({ 
	onSelect: function(rowData){
		console.log(rowData);
	}
});

form.find('.btn').click(function(){
	var i = $('.btn').index(this),
	n = $('.btn:eq('+i+')').attr('id');
	switch(n){
		case 'btn-disable':
			form.find("#village_id").shollu_cg('disable', true);
			break;
		case 'btn-enable':
			form.find("#village_id").shollu_cg('disable', false);
			break;
		case 'btn-init':
			form.find("#village_id").shollu_cg('init');
			break;
		case 'btn-destroy':
			form.find("#village_id").shollu_cg('destroy');
			break;
		case 'btn-setParams':
			form.find("#village_id").shollu_cg({ 'queryParams':{"district_id":3276030} });
			break;
		case 'btn-setValue':
			form.find("#village_id").shollu_cg('setValue', '1101010012');
			break;
		case 'btn-setValue2':
			form.find("#village_id").shollu_cg('setValue', -1);
			break;
		case 'btn-getValue':
			console.log(form.find("#village_id").shollu_cg('getValue'));
			break;
		case 'btn-version':
			console.log(form.find("#village_id").shollu_cg('version'));
			break;
	}
});
</script>
</body>
</html>