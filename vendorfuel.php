<?php

/**
 * Plugin Name:			VendorFuel
 * Plugin URI:			https://vendorfuel.com/
 * Description:			VendorFuel is a next-generation shopping cart that includes everything you need to start selling online.
 * Version:				8.22.2
 * Requires at least:	6.1
 * Requires PHP:		7.4
 * Author:				VendorFuel
 * Author URI:			https://vendorfuel.com/
 * License:				GPL v3 or later
 * License URI:			https://www.gnu.org/licenses/gpl-3.0.html
 */

if (is_readable(__DIR__ . '/vendor/autoload.php')) {
	include __DIR__ . '/vendor/autoload.php';
}

$general_settings = get_option('vendorfuel-general-settings');
$api_url          = ($general_settings && isset($general_settings->api_url)) ? $general_settings->api_url : 'https://api.vendorfuel.com/production';
$api_key          = ($general_settings && isset($general_settings->api_key)) ? $general_settings->api_key : null;
$api_version	  = 'v1.0.0';

if (!defined('VENDORFUEL_API_URL')) {
	define('VENDORFUEL_API_URL', "{$api_url}/{$api_version}");
}
if (!defined('VENDORFUEL_API_KEY')) {
	define('VENDORFUEL_API_KEY', $api_key);
}
if (!defined('VENDORFUEL_DIR_PATH')) {
	define('VENDORFUEL_DIR_PATH', plugin_dir_path(__FILE__));
}
if (!defined('VENDORFUEL_BASENAME')) {
	define('VENDORFUEL_BASENAME', plugin_basename(__FILE__));
}

require_once 'includes/class-vendorfuel.php';
require_once 'includes/dashboard-widget.php';

/**
 * Begins execution of plugin.
 *
 * @since 8.9.0
 */
function run_vendorfuel() {
	$plugin = new VendorFuel(__FILE__);
}
run_vendorfuel();
