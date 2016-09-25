<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              http://www.herooutoftime.com
 * @since             1.0.0
 * @package           Testimonial_Shortcode
 *
 * @wordpress-plugin
 * Plugin Name:       Testimonial-Shortcode
 * Plugin URI:        http://www.herooutoftime.com
 * Description:       This is a short description of what the plugin does. It's displayed in the WordPress admin area.
 * Version:           1.0.0
 * Author:            Andreas Bilz
 * Author URI:        http://www.herooutoftime.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       testimonial-shortcode
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-testimonial-shortcode-activator.php
 */
function activate_testimonial_shortcode() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-testimonial-shortcode-activator.php';
	Testimonial_Shortcode_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-testimonial-shortcode-deactivator.php
 */
function deactivate_testimonial_shortcode() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-testimonial-shortcode-deactivator.php';
	Testimonial_Shortcode_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_testimonial_shortcode' );
register_deactivation_hook( __FILE__, 'deactivate_testimonial_shortcode' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-testimonial-shortcode.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_testimonial_shortcode() {

	$plugin = new Testimonial_Shortcode();
	$plugin->run();

}
run_testimonial_shortcode();
