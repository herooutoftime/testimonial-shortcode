(function( $ ) {
	'use strict';

	$(function() {
		console.log(tinymce.PluginManager);
		tinymce.PluginManager.add('testimonial', function(ed, url) {
			var toolbar;
			console.log('Testimonial Plugin init');
			//init : function(ed, url) {

			function isPlaceholder( node ) {
				return !! ( ed.dom.getAttrib( node, 'data-mce-placeholder' ) || ed.dom.getAttrib( node, 'data-mce-object' ) );
			}

			function replaceTestimonialShortcodes( content ) {
				return content.replace( /\[testimonial([^\]]*)\]/g, function( match ) {
					return html( 'testimonial', match );
				});
			}

			function html( cls, data ) {
				data = window.encodeURIComponent( data );
				console.log(data);
				return '<img src="' + tinymce.Env.transparentSrc + '" class="wp-media wp-' + cls + ' mceItem ' + cls + '" ' +
					'data-wp-' + cls + '="' + data + '" data-mce-resize="false" data-mce-placeholder="1" alt="" />';
			}

			function restoreTestimonialShortcodes( content ) {
				function getAttr( str, name ) {
					name = new RegExp( name + '=\"([^\"]+)\"' ).exec( str );
					return name ? window.decodeURIComponent( name[1] ) : '';
				}

				return content.replace( /(?:<p(?: [^>]+)?>)*(<img [^>]+>)(?:<\/p>)*/g, function( match, image ) {
					var data = getAttr( image, 'data-wp-testimonial' );

					if ( data ) {
						return '<p>' + data + '</p>';
					}

					return match;
				});
			}

			// Register command for when button is clicked
			//ed.addCommand('testimonial_open_window', function() {
			var edit_testimonial = function( node ) {
				var html = '', $input, cache, content,
					dom = ed.dom,
					shortcode, shortcodeObj;

				shortcode = window.decodeURIComponent(dom.getAttrib(node, 'data-wp-testimonial'));
				shortcodeObj = wp.shortcode.next('testimonial', shortcode);

				var updateTestimonialPanel = function(value) {
					var items = [{
						type: 'panel',
						html: 'text',
					},{
						type: 'panel',
						html: 'text',
					},{
						type: 'panel',
						html: 'text',
					},{
						type: 'panel',
						html: 'text',
					}];

				};

				ed.windowManager.open({
					title: 'Testimonial Shortcode',
					width : 450 + parseInt(ed.getLang('button.delta_width', 0)), // size of our window
					height : 150 + parseInt(ed.getLang('button.delta_height', 0)), // size of our window
					inline : 1,
					items: {
						type: 'form',
						layout: 'flex',
						classes: 'wp-help',
						items: [{
							type: 'label',
							text: 'Search'
						},{
							type: 'textbox',
							name: 'search',
							id: 'testimonial-search',
							value: shortcodeObj ? shortcodeObj.shortcode.attrs.named.id : ''
						},{
							type: 'panel',
							name: 'testimonial-panel',
							id: 'testimonial-panel',
							layout: 'grid',
							columns: 4,
							//items: function() {
							//	return updateTestimonialPanel(shortcodeObj ? shortcodeObj.shortcode.attrs.named.id : '')
							//}
							//items: [{
							//	type: 'panel',
							//	html: 'text',
							//},{
							//	type: 'panel',
							//	html: 'text',
							//},{
							//	type: 'panel',
							//	html: 'text',
							//},{
							//	type: 'panel',
							//	html: 'text',
							//}]
							//,html: function() {
							//	return updateTestimonialPanel(shortcodeObj ? shortcodeObj.shortcode.attrs.named.id : '');
							//}
						}]
					},
					onSubmit: function() {
						tinymce.execCommand('mceInsertContent', false, content);
					}
				},{
					plugin_url : url
				});

				$input = $( '#testimonial-search' );
				$input.on( 'keydown', function() {
					$input.removeAttr( 'aria-activedescendant' );
				})
					.autocomplete({
						source: function (request, response) {
							$.post( window.ajaxurl, {
								action: 'get_testimonial',
								page: 1,
								search: request.term
							}, function( data ) {
								cache = data;
								response( data );
							}, 'json' );
						},
						focus: function(event, ui) {
							$input.attr( 'aria-activedescendant', 'mce-wp-autocomplete-' + ui.item.ID );
						},
						select: function( event, ui ) {
							$input.val( ui.item.ID );
							content = '[testimonial id="' + ui.item.ID + '"]';
							updateTestimonialPanel(ui.item);
							return false;
						},
						open: function() {
							$input.attr( 'aria-expanded', 'true' );
							//editToolbar.blockHide = true;
						},
						close: function() {
							$input.attr( 'aria-expanded', 'false' );
							//editToolbar.blockHide = false;
						},
						minLength: 2,
						position: {
							my: 'left top+2'
						},
						messages: {
							noResults: ( typeof window.uiAutocompleteL10n !== 'undefined' ) ? window.uiAutocompleteL10n.noResults : '',
							results: function( number ) {
								if ( typeof window.uiAutocompleteL10n !== 'undefined' ) {
									if ( number > 1 ) {
										return window.uiAutocompleteL10n.manyResults.replace( '%d', number );
									}

									return window.uiAutocompleteL10n.oneResult;
								}
							}
						}
					}).autocomplete( 'instance' )._renderItem = function( ul, item ) {
						return $( '<li role="option" id="mce-wp-autocomplete-' + item.ID + '">' )
							.append( '<span>' + item.thumbnail + ' ' + item.post_title + '</span>' )
							.appendTo( ul );
					};

					$input.attr( {
						'role': 'combobox',
						'aria-autocomplete': 'list',
						'aria-expanded': 'false',
						'aria-owns': $input.autocomplete( 'widget' ).attr( 'id' )
					})
					.autocomplete( 'widget' )
					.addClass( 'wplink-autocomplete' )
					.attr( 'role', 'listbox' )
					.removeAttr( 'tabindex' ) // Remove the `tabindex=0` attribute added by jQuery UI.
					/*
					 * Looks like Safari and VoiceOver need an `aria-selected` attribute. See ticket #33301.
					 * The `menufocus` and `menublur` events are the same events used to add and remove
					 * the `ui-state-focus` CSS class on the menu items. See jQuery UI Menu Widget.
					 */
					.on( 'menufocus', function( event, ui ) {
						ui.item.attr( 'aria-selected', 'true' );
					})
					.on( 'menublur', function() {
						/*
						 * The `menublur` event returns an object where the item is `null`
						 * so we need to find the active item with other means.
						 */
						$( this ).find( '[aria-selected="true"]' ).removeAttr( 'aria-selected' );
					});
			};

			// Register buttons - trigger above command when clicked
			ed.addButton('testimonial', {
				title : 'Insert testimonial'
				//,cmd : 'testimonial_open_window'
				,onclick: function() {
					edit_testimonial();
				}
				,text: 'Testimonial'
				,icon: false
			});

			ed.on( 'BeforeSetContent', function( event ) {
				// 'wpview' handles the gallery shortcode when present
				//if ( ! ed.plugins.wpview || typeof wp === 'undefined' || ! wp.mce ) {
					event.content = replaceTestimonialShortcodes( event.content );
				//}
			});

			ed.on( 'PostProcess', function( event ) {
				if ( event.get ) {
					event.content = restoreTestimonialShortcodes( event.content );
				}
			});

			//var edit_testimonial = function(value) {
			//	console.log(value);
			//};

			ed.addButton( 'wp_testimonial_edit', {
				tooltip: 'Edit '
				,icon: 'dashicon dashicons-edit'
				,onclick: function() {
					edit_testimonial(ed.selection.getNode());
				}
				//,cmd: 'testimonial_open_window'
				//,value: {
				//	node: ed.selection.getNode()
				//}
			} );
			ed.addButton( 'wp_testimonial_remove', {
				tooltip: 'Remove',
				icon: 'dashicon dashicons-no',
				onclick: function() {
					console.log('remove testimonial');
					//removeImage( editor.selection.getNode() );
				}
			} );

			ed.once( 'preinit', function() {
				if ( ed.wp && ed.wp._createToolbar ) {
					toolbar = ed.wp._createToolbar( [
						//'wp_img_alignleft',
						//'wp_img_aligncenter',
						//'wp_img_alignright',
						//'wp_img_alignnone',
						'wp_testimonial_edit',
						'wp_testimonial_remove'
					] );
				}
			} );

			ed.on( 'wptoolbar', function( event ) {
				if ( event.element.nodeName === 'IMG' && event.element.className.indexOf('testimonial')) {
					console.log('toolbar for testimonial!');
					event.toolbar = toolbar;
				}
			} );
			//},

			// Add to editor.wp
			ed.wp = ed.wp || {};
			ed.wp.isPlaceholder = isPlaceholder;

		});

		// Register our TinyMCE plugin
		// first parameter is the button ID1
		// second parameter must match the first parameter of the tinymce.create() function above
		//tinymce.PluginManager.add('testimonial_button', tinymce.plugins.testimonial_plugin);
		//tinymce.PluginManager.add('testimonial_btn', tinymce.plugins.testimonial_plugin);
	});
})( jQuery );
