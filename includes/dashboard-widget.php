<?php
function vendorfuel_add_dashboard_widgets() {
	wp_add_dashboard_widget(
		'vendorfuel_widget',
		esc_html__('VendorFuel store'),
		'vendorfuel_dashboard_widget_render'
	);
}
add_action('wp_dashboard_setup', 'vendorfuel_add_dashboard_widgets');

function vendorfuel_dashboard_widget_render() {
	$domain = (string)'vendorfuel';
	$settings = (array)get_option('vendorfuel-general-settings');
?>
	<dl>
		<dt><?php esc_html_e('API key: ', $domain) ?></dt>
		<dd>
			<?php if (isset($settings['api_key'])) {
				echo esc_html__($settings['api_key'], $domain);
			} else {
				esc_html_e('None', $domain);
			} ?>
		</dd>
	</dl>
<?php
}
