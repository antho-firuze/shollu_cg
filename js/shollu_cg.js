;(function($, window, document, undefined) {

  "use strict";
	
	var PLUGIN_NAME = 'shollu_cg',
      PLUGIN_VERSION = '1.0.1',
      PLUGIN_OPTIONS = {
				source: function(term, response){},
				onSelect: function(rowData){},
				onChange: function(rowData){},
				style: 'bs3',
				menu_type: 'normal', // iscroll (infinite scroll), normal
				emptyMessage: '<center><b>No results were found</b></center>',
				page: 1,
				rows: 50,
				idField: 'id',
				textField: 'name',
				queryParams: {},
				item_cls: '',
				addition: {},
				list: {},
				remote: false,
      };	
			
  var Shollu_CG = function ( elem, options ) {
		/* Private variables */
		var 
		o = options,
		$element     = $(elem),
		$container   = template(),
		$target      = $container.find('input[type=hidden]'),
		$button      = $container.find('span.shollu_cg.dropdown-toggle'),
		$menu  		   = template_result(),
		focused      = false,
		mousedover   = false,
		suppressKeyPressRepeat = {},
		loading			= false,
		rowData			= {},
		tot_page		 	= 1;
		
		//Expose public methods
		this.name 		= PLUGIN_NAME;
		this.version 	= PLUGIN_VERSION;
		this.o				= o;
		this.destroy 	= function(){ destroy(); };
		this.getValue = function(field){ return getValue(field); };
		this.setValue = function(val){ setValue(val); };
		this.disable  = function(state){ disabled(state); };
		this.init  		= function(){ init(); };
		
		init();
		
		function template(){
			if (o.style == 'bs3')
				return $('<div class="shollu_cg-container">'+
						'<div class="input-group">'+
							'<input type="hidden">'+
							'<div class="input-group-btn">'+
								'<span class="btn btn-default shollu_cg dropdown-toggle" data-dropdown="dropdown">'+
								'<span class="caret" /></span>'+
							'</div>'+
						'</div>'+
					'</div>');
		}
		
		function template_result(){
			return $('<ul class="typeahead-long shollu_cg dropdown-menu dropdown-menu-right" />');
		}
			
		function init(){
			// console.log('debug: init');
			if (!$element.data('init-shollu_cg')){
				$element.data('init-shollu_cg', true);
				$element.before($container);
				$target.before($element);
				
				$target.attr('name', $element.attr('name'));
				$element.removeAttr('name')
				
				o.disable = ($element.attr('disabled') === undefined) ? false : ($element.attr('disabled')) ? true : false;
				disabled(o.disable); 
				
				if (!o.remote) {
					if (Object.keys(o.list).length > 0) {
						$.each(o.list, function(i) {
							var v = o.list[i][o.idField];
							var t = o.list[i][o.textField];
							rowData[v] = o.list[i]; /* 1:{value:1, text:"One"}, 2:{value:2, text:"Two"} */
						});
						o.rowData = rowData;
					}
				}
				
				var val = $element.val();
				setValue(val);
			}
			return this;
		}
		
		function destroy(){
			// console.log('debug: destroy');
			if ($element.data('init-shollu_cg')){
				$element.data('init-shollu_cg', false);
				$element.insertBefore($container);
				$element.attr('name', $target.attr('name'));
				$element.val($target.val());
				$container.remove();
				
				listen(false);
			}
		}
		
		function disabled(state){
			// console.log('disabled:'+state);
			$element.prop('disabled', state);
			$button.attr('disabled', state);
			// $container.find('span.shollu_cg.dropdown-toggle').each(function(){
				// $(this).attr('disabled', state);
			// });
			o.disable = state;
			listen(state ? false : true);
		}
		
		function show(){
			var pos = $.extend({}, $element.position(), {height: $element[0].offsetHeight});

			$menu
				.insertAfter($element)
				.css({top: pos.top + pos.height, left: pos.left})
				.show();
			
			o.shown = true;
		}
		
		function hide(){
			// console.log('debug: hide');
			$menu.hide();
			$('.dropdown-menu').off('mousedown', function(e){
				if (e.target.tagName == 'UL') {
					// $element.off('blur');
				}
			});
			o.shown = false;
			return;
		}

		function blur(){
			focused = false;
			if (o.escape) {return;}
			select();
			if (!o.selected) {select();}
			if (!mousedover && o.shown) {setTimeout(function () { hide(); o.page = 1; }, 200);}
		}
		
		function toggle(){
			// console.log('debug: toggle');
			if (o.shown) hide();
			if (!o.disable){
				if (o.shown){
					hide();
					$element.focus();
				} else {
					queries();
				}
			}
		}
		
		function queries(){
			// console.log('debug: queries');
			var id = $element.attr('data-'+o.idField);
			var name = $element.attr('data-'+o.textField);
			var text = $element.val();
			
			if (text != name){ 
				$element
					.attr('value', '')
					.attr('data-'+o.idField, '')
					.attr('data-'+o.textField, '');
				$target.val('').trigger('change');
				o.onChange.call(this, {});
				id = '';
			}
			
			if (o.remote){
				var term = { page:o.page, rows:o.rows };
				if (id) { term[o.idField] = id; }
				if (text) { term['q'] = text; }
				$.each(o.queryParams, function(k, v){ term[k] = v; });
				setTimeout(function(){ 
					$.getJSON( o.url, term, function(result){ 
						var data = result.data;
						if (Object.keys(data).length > 0){ lookup(data) } 
					});
				}, 100);
			} else {
				lookup(o.list);
			}
		}
	
		function select() {
			// console.log('debug: select up');
			var id = $element.attr('data-'+o.idField);
			var name = $element.attr('data-'+o.textField);
			var text = $element.val();
			
			if (text != name){ 
				$element
					.attr('value', '')
					.attr('data-'+o.idField, '')
					.attr('data-'+o.textField, '')
					.val('').trigger('change');
				$target.val('').trigger('change');
				o.onSelect.call(this, {});
			}

			var id_old = $element.attr('value'),
					id_new = $menu.find('.active').data(o.idField),
					name_new = $menu.find('.active').data(o.textField);
			
			if (id_new === undefined) { return hide(); }
			
			if (id_new !== id_old) {
				$element
					.attr('value', id_new)
					.attr('data-'+o.idField, id_new)
					.attr('data-'+o.textField, name_new)
					.val(name_new).trigger('change');
				$target.val(id_new).trigger('change');
				o.onSelect.call(this, o.rowData[id_new]);
			}
			o.selected = true;
			return hide();
		}

		/* format data = {total:999, rows:{field1:value1, field2:value2}} */
		function lookup(data){
			var list = [];
			var rows = data;
			var id = $element.attr('data-'+o.idField);
			
			if (o.page == 1)
				$menu.empty();
			
			// console.log('addition:'+Object.keys(o.addition).length);
			if (Object.keys(o.addition).length > 0){
				var v = o.addition[o.idField];
				var t = o.addition[o.textField];
				var cls = (o.item_cls) ? 'class="'+o.item_cls+'" ' : '';
				list.push($('<li '+cls+'data-'+o.idField+'="'+v+'" data-'+o.textField+'="'+t+'"><a>'+t+'</a></li>'));
				rowData[v] = o.addition;
			}
			
			if (o.remote) {
				rows = data.rows;
				tot_page = Math.ceil(data.total/o.rows);
			} 
			
			if (Object.keys(rows).length > 0) {
				$.each(rows, function(i) {
					var v = rows[i][o.idField];
					var t = rows[i][o.textField];
					var cls = (o.item_cls) ? 'class="'+o.item_cls+'" ' : '';

					if (id && (id == v)){
						var active = 'active ';
						cls = cls ? cls+active : 'class="'+active+'"';
					}
					list.push( $('<li '+cls+'data-'+o.idField+'="'+v+'" data-'+o.textField+'="'+t+'"><a>'+t+'</a></li>') );
					rowData[v] = rows[i]; /* 1:{value:1, text:"One"}, 2:{value:2, text:"Two"} */
				});
				$menu.append(list);
			} else {
				$menu.append('<span style="color:#999;">'+o.emptyMessage+'</span>');
			}
			
			/* insert to object o, for permanent storage & can be accessed on other function */
			o.rowData = rowData;
			show();
			$element.focus();
		}
		
		function fixMenuScroll(){
			// console.log('debug: fixMenuScroll');
			var active = $menu.find('.active');
			if(active.length){
				var top = active.position().top;
				var bottom = top + active.height();
				var scrollTop = $menu.scrollTop();
				var menuHeight = $menu.height();
				if(bottom > menuHeight){
						$menu.scrollTop(scrollTop + bottom - menuHeight);
				} else if(top < 0){
						$menu.scrollTop(scrollTop + top);
				}
			}
		}
		
		function getValue(field){
			// console.log('debug: getValue');
			var val;
			field = (field === undefined) ? o.idField : field;
			
			/* For anticipate custom additional row */
			val = $element.attr('value')===undefined ? '' : $element.attr('value')=='' ? '' : $element.attr('value');
			if (!val)
				return;
			
			if ($element.attr('value'))
				return ((val = o.rowData[$element.attr('value')][field]) === undefined) ? false : val;
		}
		
		function setValue(val){
			if ($element.data('init-shollu_cg')===false){ return; }
					
			if (!val || val < 0) {
				$element
					.attr('value', '')
					.attr('data-'+o.idField, '')
					.attr('data-'+o.textField, '')
					.val('').trigger('change');
				$target.val('').trigger('change');
				o.onChange.call(this, {});
				return;
			}
			
			if (o.remote) {
				setTimeout(function(){ 
					$.getJSON( o.url, {id: val}, function(data){ 
						var row = data.data.rows[0];
						if (typeof row !== 'undefined'){
							var id = row[o.idField],
									text = row[o.textField];
							$element
								.attr('value', id)
								.attr('data-'+o.idField, id)
								.attr('data-'+o.textField, text)
								.val(text).trigger('change');
							$target.val(id).trigger('change');
							o.selected = true;
							rowData[id] = row;
							o.rowData = rowData;
							o.onChange.call(this, o.rowData[id]);
						} 
					});
				}, 100);
			} else {
				if (Object.keys(o.list).length > 0) {
					if (o.rowData[val] !== undefined) {
						var id = o.rowData[val][o.idField];
						var text = o.rowData[val][o.textField];
						$element
							.attr('value', id)
							.attr('data-'+o.idField, id)
							.attr('data-'+o.textField, text)
							.val(text).trigger('change');
						$target.val(id).trigger('change');
						o.selected = true;
						o.onChange.call(this, o.rowData[id]);
					}
				}
			}
		}
		
		function scroll(e){
			// console.log('debug: scroll');
			$element.focus();
			e.stopPropagation();
			e.preventDefault();

			var scrollPercent = (e.currentTarget.scrollTop + $(e.currentTarget).height())/e.currentTarget.scrollHeight*100;
			if ( scrollPercent > 90) {
				if (!loading){
					if (o.page < tot_page){
						// console.log('debug: loading: true');
						loading = true;
						o.page++;
						
						if (o.remote) {
							var val = $element.val();
							var params = {q:val, page:o.page, rows:o.rows};
						
							$.each(o.queryParams, function(k, v){ params[k] = v; });
							setTimeout(function(){ 
								$.getJSON( o.url, params, function(result){ 
									var data = result.data;
									if (Object.keys(data).length > 0){ lookup(data) } 
									loading = false;
								});
							}, 100);
						}
					}
				} 
			}
		}
		
		function next() {
			var active = $menu.find('.active').removeClass('active'), 
					$next = active.next();

			if (!$next.length) {
				$next = $($menu.find('li')[0]);
			}

			$next.addClass('active');
		}
		
		function prev() {
			var active = $menu.find('.active').removeClass('active'), 
					$prev = active.prev();

			if (!$prev.length) {
				$prev = $menu.find('li').last();
			}

			$prev.addClass('active');
		}
		
		function move(e){
			if (!o.shown) {return;}

			switch(e.keyCode) {
				case 9: // tab
				case 13: // enter
				case 27: // escape
					e.preventDefault();
					break;

				case 38: // up arrow
					e.preventDefault();
					prev();
					fixMenuScroll();
					break;

				case 40: // down arrow
					e.preventDefault();
					next();
					fixMenuScroll();
					break;
			}

			e.stopPropagation();
		}
		
		function keyup(e){
			switch(e.keyCode) {
				case 40: // down arrow
					if (!o.shown) {toggle();}
					break;
				case 39: // right arrow
				case 38: // up arrow
				case 37: // left arrow
				case 36: // home
				case 35: // end
				case 16: // shift
				case 17: // ctrl
				case 18: // alt
					break;

				case 9: // tab
				case 13: // enter
					if (!o.shown) {return;}
					select();
					break;

				case 27: // escape
					if (!o.shown) {return;}
					o.escape = true;
					hide();
					break;

				default:
					queries();
			}

			e.stopPropagation();
			e.preventDefault();
		}
		
		function listen(state){
			// console.log('debug: listen-'+state);
			if (state){
				$element
					.on('focus',    function(){ focused = true; })
					.on('blur',     blur)
					// .focusout(blur)
					.on('keypress', function(e){
						if (suppressKeyPressRepeat) {return;}
						move(e);
					})
					.on('keydown',  function(e){
						suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27]);
						move(e);
					})
					.on('keyup',    keyup)
					.on('dblclick', toggle);
			
				$menu
					.on('click', function(e){
						$element.focus();
						e.stopPropagation();
						e.preventDefault();
						select();
					})
					.on('mouseenter', 'li', function(e){
						mousedover = true;
						$menu.find('.active').removeClass('active');
						$(e.currentTarget).addClass('active');
					})
					.on('mouseleave', function(){ 
						mousedover = false; 
					})
					.scroll( scroll );

				$button
					.on('click', toggle);
					
			} else {
				$element.off('blur focusout focus keydown keyup keypress dblclick');
				$menu.off('click mouseenter mouseleave scroll');
				$button.off('click');
			}
		}
		
	};
	
  $.fn.shollu_cg = function(option) {
		var $this = $(this), 
				instl = $this.data('shollu_cg');
			
		if (typeof option === 'string') {
			if (!instl) { return this; }
			
			if (instl[option]) {
				if ($.isFunction(instl[option]))
					return instl[option].apply(instl, Array.prototype.slice.call(arguments, 1));
				else
					return instl[option];
			} else {
				$.error( 'Method ' +  option + ' does not exist on jQuery.shollu_cg' );
			}
		}
		
		return this.each(function() {
			if (!instl) {
				$this.data('shollu_cg', new Shollu_CG(this, $.extend({}, PLUGIN_OPTIONS, option)) );
				// console.log($this.data('shollu_cg'));
			} else {
				// $this.data('shollu_cg', new Shollu_CG(this, $.extend(instl.o, option)) );
				instl.o = $.extend(instl.o, option);
				$this.data('shollu_cg', instl);
				// console.log($this.data('shollu_cg'));
			}
		});
  };
	
}(jQuery));