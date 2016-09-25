(function( $ ) {
	'use strict';

	/**
	 * All of the code for your admin-facing JavaScript source
	 * should reside in this file.
	 *
	 * Note: It has been assumed you will write jQuery code here, so the
	 * $ function reference has been prepared for usage within the scope
	 * of this function.
	 *
	 * This enables you to define handlers, for when the DOM is ready:
	 *
	 * $(function() {
	 *
	 * });
	 *
	 * When the window is loaded:
	 *
	 * $( window ).load(function() {
	 *
	 * });
	 *
	 * ...and/or other possibilities.
	 *
	 * Ideally, it is not considered best practise to attach more than a
	 * single DOM-ready or window-load handler for a particular page.
	 * Although scripts in the WordPress core, Plugins and Themes may be
	 * practising this, we should strive to set a better example in our own work.
	 */
	$(function() {
		console.log(tinymce.PluginManager);
		tinymce.PluginManager.add('testimonial', function(ed, url) {
			console.log('Testimonial Plugin init');
			//init : function(ed, url) {

				function replaceTestimonialShortcodes( content ) {
					return content.replace( /\[testimonial([^\]]*)\]/g, function( match ) {
						return html( 'testimonial', match );
					});
				}

				function html( cls, data ) {
					data = window.encodeURIComponent( data );
					return '<img src="' + tinymce.Env.transparentSrc + '" class="wp-media mceItem ' + cls + '" ' +
						'data-wp-media="' + data + '" data-mce-resize="false" data-mce-placeholder="1" alt="" />';
				}

				function restoreTestimonialShortcodes( content ) {
					function getAttr( str, name ) {
						name = new RegExp( name + '=\"([^\"]+)\"' ).exec( str );
						return name ? window.decodeURIComponent( name[1] ) : '';
					}

					return content.replace( /(?:<p(?: [^>]+)?>)*(<img [^>]+>)(?:<\/p>)*/g, function( match, image ) {
						var data = getAttr( image, 'data-wp-media' );

						if ( data ) {
							return '<p>' + data + '</p>';
						}

						return match;
					});
				}

				// Register command for when button is clicked
				ed.addCommand('testimonial_open_window', function() {
					var html = '', $input, cache, content;

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
								id: 'testimonial-search'
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
							select: function( event, ui ) {
								$input.val( ui.item.ID );
								content = '[testimonial id="' + ui.item.ID + '"]';
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
							console.log(item);
							return $( '<li role="option" id="mce-wp-autocomplete-' + item.ID + '">' )
								.append( '<span>' + item.post_title + '</span>' )
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
				});

				// Register buttons - trigger above command when clicked
				ed.addButton('testimonial', {
					title : 'Insert testimonial'
					,cmd : 'testimonial_open_window'
					,icon: 'user'
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
			//},
		});

		// Register our TinyMCE plugin
		// first parameter is the button ID1
		// second parameter must match the first parameter of the tinymce.create() function above
		//tinymce.PluginManager.add('testimonial_button', tinymce.plugins.testimonial_plugin);
		//tinymce.PluginManager.add('testimonial_btn', tinymce.plugins.testimonial_plugin);
	});
})( jQuery );
