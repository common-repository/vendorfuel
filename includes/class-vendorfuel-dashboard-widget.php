<?php

/**
 * Compose a WordPress dashboard widget.
 *
 * @since 8.18.0
 */
class Vendorfuel_Dashboard_Widget {
	public function init() {
		wp_add_dashboard_widget(
			'vendorfuel_widget',
			esc_html__('VendorFuel Store'),
			array($this, 'compose_widget')
		);
	}

	public function compose_widget() {
		$domain = 'vendorfuel';
		$settings = get_option('vendorfuel-general-settings');
		$api_key = $settings ? $settings->api_key : null;
?>
		<dl>
			<dt><?php esc_html_e('API key: ', $domain) ?></dt>
			<dd>
				<?php if (isset($api_key)) {
					echo esc_html__($api_key, $domain);
				} else {
					esc_html_e('None', $domain);
				} ?>
			</dd>
		</dl>
<?php
	}
}
