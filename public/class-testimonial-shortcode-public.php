<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       http://www.herooutoftime.com
 * @since      1.0.0
 *
 * @package    Testimonial_Shortcode
 * @subpackage Testimonial_Shortcode/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Testimonial_Shortcode
 * @subpackage Testimonial_Shortcode/public
 * @author     Andreas Bilz <anti@herooutoftime.com>
 */
class Testimonial_Shortcode_Public {

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
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
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

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/testimonial-shortcode-public.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
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

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/testimonial-shortcode-public.js', array( 'jquery' ), $this->version, false );

	}

	public function render_shortcode($atts = array())
	{
		$atts = shortcode_atts([
			'template' => 'default',
			'id' => null,
		], $atts, $tag);
		if(empty($atts['id']))
			return;

		$post = get_post($atts['id']);
		if($post instanceof WP_POST) {
			setup_postdata($post);
			ob_start();
			include('partials/default.php');
			return ob_get_clean();
		} else {
			echo 'No testimonials found!';
			return;
		}
	}

}
