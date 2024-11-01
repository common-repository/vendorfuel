<?php
if (!defined('WP_UNINSTALL_PLUGIN')) {
    die;
}

/**
 * Delete VendorFuel options
 */
$options = array(
    'vendorfuel-analytics-settings',
    'vendorfuel-anguledit-settings',
    'vendorfuel-conversion-settings',
    'vendorfuel-general-settings',
    'vendorfuel-store-options',
);

foreach ($options as $option) {
    delete_option($option);
}

wp_cache_flush();
