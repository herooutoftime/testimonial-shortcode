( function() {
	tinymce.PluginManager.add( 'testimonial', function( editor ) {
		editor.addButton( 'testimonial_button', {
			text: 'Testimonial',
			icon: false,
			onclick: function() {
				wp.mce.testimonial.popupwindow(editor);
			}
		});
	});
})();

(function($){
	var media = wp.media, shortcode_string = 'testimonial';
	wp.mce = wp.mce || {};
	wp.mce.testimonial = {
		shortcode_data: {},
		template: media.template( 'editor-testimonial' ),
		getContent: function() {
			var options = this.shortcode.attrs.named;
			options = $.extend(options, WP_TESTIMONIALS.filter(function(obj) {
					return obj.ID == options.id;
				})[0]
			);
			return this.template(options);
		},
		View: { // before WP 4.2:
			template: media.template( 'editor-testimonial' ),
			postID: $('#post_ID').val(),
			initialize: function( options ) {
				this.shortcode = options.shortcode;
				wp.mce.testimonial.shortcode_data = this.shortcode;
			},
			getHtml: function() {
				var options = this.shortcode.attrs.named;
				console.log(options);
				options = $.extend(options, WP_TESTIMONIALS.filter(function(obj) {
						return obj.ID == options.id;
					})[0]
				);
				return this.template(options);
			}
		},
		edit: function( data ) {
			var shortcode_data = wp.shortcode.next(shortcode_string, data);
			var values = shortcode_data.shortcode.attrs.named;
			//values.innercontent = shortcode_data.shortcode.content;
			wp.mce.testimonial.popupwindow(tinyMCE.activeEditor, values);
		},
		// this is called from our tinymce plugin, also can call from our "edit" function above
		// wp.mce.testimonial.popupwindow(tinyMCE.activeEditor, "bird");
		popupwindow: function(editor, values, onsubmit_callback){
			values = values || [];
			if(typeof onsubmit_callback !== 'function'){
				onsubmit_callback = function( e ) {
					// Insert content when the window form is submitted (this also replaces during edit, handy!)
					var args = {
						tag     : shortcode_string,
						type	: 'single',
						//content : e.data.innercontent,
						attrs : {
							id    : e.data.id
						}
					};
					editor.insertContent( wp.shortcode.string( args ) );
				};
			}
			editor.windowManager.open( {
				title: 'Testimonial',
				body: [
					{
						type: 'textbox',
						name: 'id',
						label: 'ID',
						value: values.id,
						id: 'testimonial-search'
					}
				],
				onsubmit: onsubmit_callback
			} );
			$input = $( '#testimonial-search' );
			$input.on( 'keydown', function() {
				$input.removeAttr( 'aria-activedescendant' );
			}).autocomplete({
				source: function (request, response) {
					$.post( window.ajaxurl, {
						action: 'get_testimonial',
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
		}
	};
	wp.mce.views.register( shortcode_string, wp.mce.testimonial );
}( jQuery ));
