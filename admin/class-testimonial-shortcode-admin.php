<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       http://www.herooutoftime.com
 * @since      1.0.0
 *
 * @package    Testimonial_Shortcode
 * @subpackage Testimonial_Shortcode/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Testimonial_Shortcode
 * @subpackage Testimonial_Shortcode/admin
 * @author     Andreas Bilz <anti@herooutoftime.com>
 */
class Testimonial_Shortcode_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Testimonial_Shortcode_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Testimonial_Shortcode_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/testimonial-shortcode-admin.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Testimonial_Shortcode_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Testimonial_Shortcode_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

//		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/testimonial-shortcode-admin.js', array( 'jquery' ), $this->version, false );

	}

	public function print_media_templates()
	{
		if ( ! isset( get_current_screen()->id ) || get_current_screen()->base != 'post' )
			return;
		include_once dirname(__FILE__).'/templates/tmpl-editor-testimonial.html';
	}

	public function admin_init()
	{
		add_editor_style(plugin_dir_url(__FILE__) . 'css/testimonials-mce-editor.css');
	}

	public function js_variables()
	{
		echo "<script type='text/javascript'>var WP_TESTIMONIALS = " . $this->get_testimonial(true) . ";</script>";
	}
	
	public function button_init()
	{

		//Abort early if the user will never see TinyMCE
		if ( ! current_user_can('edit_posts') && ! current_user_can('edit_pages') && get_user_option('rich_editing') == 'true')
			return;

		//Add a callback to regiser our tinymce plugin
		add_filter("mce_external_plugins", array($this, "register_tinymce_plugin"));

		// Add a callback to add our button to the TinyMCE toolbar
		add_filter('mce_buttons', array($this, 'add_tinymce_button'));
	}

	public function register_tinymce_plugin($plugin_array) {
		$plugin_array['testimonial'] = plugin_dir_url( __FILE__ ) . 'js/testimonial-shortcode-admin.js';
		return $plugin_array;
	}

	public function add_tinymce_button($buttons) {
		//Add the button ID to the $button array
		$buttons[] = "testimonial_button";
		return $buttons;
	}

	public function get_testimonial($return = false)
	{
		if($_POST['post_id']) {
			echo wp_json_encode(get_post($_POST['post_id']));
			wp_die();
		}

		$query = new WP_Query();
		$query->set('category_name', 'testimonials');
		if($_POST['search'])
			$query->set('s', $_POST['search']);
		$posts = $query->get_posts();
		foreach ($posts as &$post) {
			$post->thumbnail = get_the_post_thumbnail_url($post->ID, 'thumbnail');
//			$post->thumbnail = get_the_post_thumbnail($post->ID, 'thumbnail', array('class' => '', 'height' => 50, 'width' => 50));
		}

		if($return)
			return wp_json_encode($posts);

		echo wp_json_encode($posts);
		wp_die();
	}

	public function render_form()
	{
		echo 'test';
	}
}
