(function (root, factory) {

    "use strict";

    // CommonJS module is defined
    if (typeof module !== 'undefined' && module.exports) {
        var isNode = (typeof process !== "undefined");
        var isElectron = isNode && ('electron' in process.versions);
        if (isElectron) {
            root.BSHelper = factory(root.jQuery);
        } else {
            module.exports = factory(require('jquery'), require('bootstrap'));
        }
    }
    // AMD module is defined
    else if (typeof define === "function" && define.amd) {
        define("bootstrap-helper", ["jquery", "bootstrap"], function ($) {
            return factory($);
        });
    } else {
        // planted over the root!
        root.BSHelper = factory(root.jQuery);
    }

}(this, function ($) {

    "use strict";
	
	var BSHelper = {};
	
	BSHelper.version = '1.0.0';
	
	BSHelper.newGuid = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
	
	/* 
	*	BSHelper.Tabs({dataList:[ title:"", idname:"", content:"" ]}); 
	*	BSHelper.Tabs({dataList:[ title:"", idname:"", content:function(){ return ""; } ]}); 
	*					 
	*/
	BSHelper.Tabs = function(options){
		var o = $.extend( {}, BSHelper.defaults, options );
		var container = $('<div class="nav-tabs-custom"><ul class="nav nav-tabs"></ul><div class="tab-content"></div></div>');
		var header = container.find('ul.nav-tabs');
		var body = container.find('.tab-content');

		var n = 1;
		$.each(o.dataList, function(i) {
			var active = (n==1)?'active':'';
			var idname = o.dataList[i]['idname'];
			var title = o.dataList[i]['title'];
			var content = o.dataList[i]['content'];
			$('<li class="'+active+'"><a href="#'+idname+'" data-toggle="tab">'+title+'</a></li>').appendTo(header);
			$('<div class="'+active+' tab-pane" id="'+idname+'" />').html(content).appendTo(body);
			n++;
		});
		
		return container;
	};
	
	/* 
	*	BSHelper.Accordion({dataList:[ title:"", paneltype:"", content:"" ]}); 
	*	BSHelper.Accordion({dataList:[ title:"", paneltype:"", content:function(){ return ""; } ]}); 
	*	 
	*	options: dataList 
	*					 
	*/
	BSHelper.Accordion = function(options){
		var o = $.extend( {}, BSHelper.defaults, options );
		
		var id = 'accordion'+BSHelper.newGuid();
		var container = $('<div class="panel-group" id="'+id+'" />');

		$.each(o.dataList, function(i){
			var id2 = 'collapse'+BSHelper.newGuid();
			var title = o.dataList[i]['title'];
			var paneltype = o.dataList[i]['paneltype'];
			var content = o.dataList[i]['content'];
			var panel = $('<div class="panel panel-'+paneltype+'" />');
			
			panel.append( $('<div class="panel-heading" />')
				.append( $('<h4 class="panel-title" />')
					.append( $('<a style="display:table; table-layout:fixed; width:100%;" data-toggle="collapse" data-parent="#'+id+'" href="#'+id2+'" />')
						.append( $('<div style="display:table-cell; width:90%; overflow:hidden; text-overflow:ellipsis" />')
							.html(title) )
						.append( $('<span class="pull-right glyphicon glyphicon-triangle-bottom"></span>') ) ) ) );
			panel.append( $('<div id="'+id2+'" class="panel-collapse collapse" />')
				.append( $('<div class="panel-body" />')
					.html(content) ) );
					
			container.append(panel)
		});
		
		return container;
	};
	
	BSHelper.Label = function(options){
		var o = $.extend( {}, BSHelper.defaults, options );
		var lblname = o.required ? '&nbsp;<span style="color:red;">'+o.label+' *</span>' : o.label;
		var container = $('<div class="form-group"><label class="control-label" for="'+o.idname+'">'+lblname+'</label><div class="control-input"></div></div>');

		if (o.horz) { container.find('label').addClass(o.lblsize); container.find('.control-input').addClass(o.colsize); }
		container.find('.control-input').append(o.elcustom);
		return container;
	};
	
	BSHelper.Input = function(options){
		var o = $.extend( {}, BSHelper.defaults, options );
		var lblname = o.required ? '&nbsp;<span style="color:red;">'+o.label+' *</span>' : o.label;
		var container = $('<div class="form-group"><label class="control-label" for="'+o.idname+'">'+lblname+'</label><div class="control-input"></div></div>');
		var el = (o.type == 'textarea') ? 'textarea' : 'input';
		var input = $('<'+el+' />', {class: "form-control", id:o.idname, name:o.idname, value:o.value, autocomplete:"off"}); 
		var help = $('<small />', {class:"form-text text-muted help-block with-errors"}).html(o.help ? o.help : '');

		/* type=textarea => el=textarea,type='' */
		/* type=text,email,url,number,hidden => el=input,type=type */
		/* type=date => el=input,type=text */
		/* type=time => el=input,type=text */
		/* type=datetime => el=input,type=text */
		switch (o.type){
			case 'hidden':
				input.attr('type',o.type);
				return input;
				break;
			case 'text':
				input.attr('placeholder',(o.placeholder) ? o.placeholder : 'string(60)');
				input.attr('type',o.type);
				break;
			case 'number':
				input.attr('placeholder',(o.placeholder) ? o.placeholder : 'number');
				input.attr('type',o.type);
				break;
			case 'email':
			case 'password':
			case 'url':
			case 'color':
			case 'month':
			case 'datetime-local': 
				input.attr('type',o.type);
				break;
			case 'date':
				input.attr('type','text');
				if (o.min) input.attr('min',o.min);		// format yyyy-mm-dd
				if (o.max) input.attr('max',o.max);		// format yyyy-mm-dd
				if (o.inputmask) input.attr('data-inputmask',o.inputmask);
				input.attr('data-mask','');
				break;
			case 'textarea':
				input.attr('placeholder',(o.placeholder) ? o.placeholder : 'string(2000)');
				break;
			case 'time':
			case 'datetime':
			default:
				break;
		}
		if (o.hidden) { input.attr('style','display:none;'); return input; }
		if (o.horz) { container.find('label').addClass(o.lblsize); container.find('.control-input').addClass(o.colsize); }
		if (!o.label) { container.find('label').remove(); container.removeClass('form-group'); }
		if (o.required) input.attr('required',''); 
		if (o.disabled) input.attr('disabled','');
		if (o.readonly) input.attr('readonly','');
		if (o.onfocus) input.attr('onfocus',o.onfocus);
		if (o.minlength) input.attr('data-minlength',o.minlength);
		if (o.idmatch) input.attr('data-match','#'+o.idmatch);
		if (o.errormatch) input.attr('data-match-error',o.errormatch);
		container.find('.control-input').append(input).append(help);
		return container;
	};
	
	BSHelper.Button = function(options){
		var o = $.extend( {}, BSHelper.defaults, options );
		var button = $('<button />', {class: "btn", id: o.idname, name: o.idname, type: o.type }).html(o.label); 
		button.addClass(o.cls?o.cls:'btn-primary');

		if (o.disabled) button.attr('disabled','');
		if (o.onclick) button.attr('onclick',o.onclick);
		return button;
	};
	
	BSHelper.Checkbox = function(options){
		var o = $.extend( {}, BSHelper.defaults, options );
		var lblname = o.required ? '&nbsp;<span style="color:red;">'+o.label+' *</span>' : o.label;
		var container = $('<div class="form-group"><label class="control-label" for="'+o.idname+'">'+lblname+'</label><div class="control-input checkbox"></div></div>');
		var input = $('<input>', {id:o.idname, name:o.idname, type:"checkbox"}); 
		var input2 = $('<input>', {id:o.idname, name:o.idname, type:"hidden", class:"checkbox", value:0}); 
		var help = $('<small />', {class:"form-text text-muted help-block with-errors"}).html(o.help ? o.help : '');

		if (o.horz) { container.find('label').addClass(o.lblsize); container.find('.control-input').addClass(o.colsize); }
		if (o.required) input.attr('required','');
		if (o.disabled) input.attr('disabled','');
		if (o.readonly) input.attr('readonly','');
		if (parseInt(o.value)) input.prop("checked", true);
		
		container.find('.control-input').append( input.append(input2) ).append(help);
		input.iCheck({ checkboxClass: 'icheckbox_flat-orange', radioClass: 'iradio_flat-orange'	});
		return container;
	};

	/* 
	*		Sample: 
	*		BSHelper.Combogrid({ horz:false, label:"Role", idname:"role_id", textField:"code_name", url:"{$.php.base_url('systems/a_user_role')}", isLoad:true });
	*/
	BSHelper.Combogrid = function(options){
		var o = $.extend( {}, BSHelper.defaults, options );
		var lblname = o.required ? '&nbsp;<span style="color:red;">'+o.label+' *</span>' : o.label;
		var placeholder = o.placeholder ? o.placeholder : "typed or choose";
		var container = $('<div class="form-group"><label class="control-label" for="'+o.idname+'">'+lblname+'</label><div class="control-input"></div></div>');
		var input = $('<input />', { class: "form-control", id: o.idname, name: o.idname, type: 'text', placeholder: placeholder, value: o.value,	autocomplete: "off", "data-url": o.url }); 
		var help = $('<small />', {class:"form-text text-muted help-block with-errors"}).html(o.help ? o.help : '');

		if (o.horz) { container.find('label').addClass(o.lblsize); container.find('.control-input').addClass(o.colsize); }
		if (o.required) input.attr('required','');
		if (o.disabled) input.attr('disabled','');
		if (o.readonly) input.attr('readonly','');
		container.find('.control-input').append(input).append(help);
		
		input.shollu_cg({ 
			url: o.url,
			idField: o.idField ? o.idField : 'id',
			textField: o.textField ? o.textField : 'name',
			emptyMessage: o.emptyMessage ? o.emptyMessage : '<center><b>No results were found</b></center>',
			remote: o.remote,
			addition: o.addition,
			list: o.list,
		});
		
		return container;
	};
	
	/* 
	*		Sample: 
	*		BSHelper.Combobox({ horz:false, label:"Role", idname:"role_id", list:{ "1":"One", "2":"Two" } });
	*		BSHelper.Combobox({ horz:false, label:"Role", idname:"role_id", 
	*			list:[ 
	*				{ value:"1", title:"One", default:true },
	*				{ value:"2", title:"Two" },
	*			] 
	*		});
	*/
	BSHelper.Combobox = function(options){
		var o = $.extend( {}, BSHelper.defaults, options );
		var lblname = o.required ? '&nbsp;<span style="color:red;">'+o.label+' *</span>' : o.label;
		var placeholder = o.placeholder ? o.placeholder : "typed or choose";
		var container = $('<div class="form-group"><label class="control-label" for="'+o.idname+'">'+lblname+'</label><div class="control-input"></div></div>');
		var input = $('<input />', { class: "form-control", id: o.idname, name: o.idname, type: 'text', placeholder: placeholder, value: o.value,	autocomplete: "off" }); 
		var help = $('<small />', {class:"form-text text-muted help-block with-errors"}).html(o.help ? o.help : '');

		if (o.horz) { container.find('label').addClass(o.lblsize); container.find('.control-input').addClass(o.colsize); }
		if (o.required) input.attr('required','');
		if (o.disabled) input.attr('disabled','');
		if (o.readonly) input.attr('readonly','');
		container.find('.control-input').append(input).append(help);
		
		/* $.each(o.list, function(i) {
			var v = o.list[i]['value'];
			var t = o.list[i]['title']
			input.append( $('<option />', {value: v}).html(t) );
		}); */
		
		input.shollu_cb({
			idField: o.idField ? o.idField : 'id',
			textField: o.textField ? o.textField : 'name',
			emptyMessage: o.emptyMessage ? o.emptyMessage : '<center><b>No results were found</b></center>',
			remote: o.remote ? true : false,
			addition: o.addition,
			list: o.list,
		});
		
		return container;
	};
	
	BSHelper.LineDesc = function(options){
		var o = $.extend( {}, BSHelper.defaults, options );
		
		if(typeof(o.reference)==='undefined') {
			if ($.isNumeric(o.value)) {
				var val = parseInt(o.value);
				if (val <= 1){
					o.value = parseInt(o.value)?'Yes':'No';
				}
			} else {
				if(typeof(o.value)==='undefined')
					o.value = '';
				else
					o.value = o.value?o.value:'N/A';
			}
		} else {
			if ($.isNumeric(o.value)) {
				var val = parseInt(o.value);
				if (val <= 1){
					o.value = o.reference[val];
				} else {
					$.each(o.reference, function(k, v) {
						if (k == val)
							o.value = v;
					});
				}
			} else {
				if(typeof(o.value)==='undefined')
					o.value = '';
				else
					o.value = o.value?o.value:'N/A';
			}
		}
		return $('<dt />').html(o.title).add($('<dd />').html(o.value));
	};
	
	BSHelper.Table = function(options){
		var o = $.extend( {}, BSHelper.Table.defaults, options );
		
		var container = $('<div>'+o.title+'<br><table class="table"><thead></thead><tbody></tbody></table></div>'),
				table = container.find('table'),
				thead = container.find('thead'),
				tbody = container.find('tbody'),
				l = 1,
				c = 1,
				confirm_text = o.confirm_text.replace(/({rows_count})/gi, o.data.length);
		
		if (o.isConfirm){
			if (o.data.length > o.maxrows){
				table.remove();
				return container.append($('<p />').html(confirm_text));
			}
		}
		
		if (Object.keys(o.columns).length == 0) {
			table.remove();
			return container.append($('<p />').html(confirm_text));
		}
					
		// TABLE HEADER
		if (o.showheader){
			var tr = $('<tr />');
			$.each(o.columns, function(j){
				if (c==1){ if (o.rowno){ tr.append( $('<th />').html('#') ); } }
				tr.append( $('<th />').html(o.columns[j]['title']) );
				c++;
			});
			tr.appendTo(thead);
		}
		
		// TABLE DETAIL
		$.each(o.data, function(i){
			var tr = $('<tr />'),
					c  = 1;
			$.each(o.columns, function(j){
				var col = o.columns[j]['data'];
				if (c==1){ if (o.rowno){ tr.append( $('<th />').html(i+1) ); } }
				tr.append( $('<td />').html(o.data[i][col]) );
				c++;
			});
			tr.appendTo(tbody);
		});
		return container;
	};
	
	BSHelper.Table.defaults = { 
		columns: [],
		rowno: false,
		showtitle: true,
		maxrows: 3,
		title: '<h4>Are you sure want to delete ?</h4>',
		confirm_text: '<strong>{rows_count}</strong> rows selected.',
	};
	
	BSHelper.defaults = {
		style: "bs3",
		type: "text",
		label: "",
		idname: BSHelper.newGuid(),
		placeholder: "",
		help: "",
		rows: 1,
		required: false,
		disabled: false,
		readonly: false,
		horz: false, 					// for horizontal-form
		lblsize: "col-sm-3",	
		colsize: "col-sm-9",
		isCombogrid: false
	};
	
	return BSHelper;
	
}));