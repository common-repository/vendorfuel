<?php

/**
 * @since 8.18.0
 */

$tokena = $_COOKIE['vendorfuel-admin-tokena'];
$tokenb = $_COOKIE['vendorfuel-admin-tokenb'];

?>
<header class="vendorfuel-header">
	<a class="vendorfuel-brand" href="?page=vf-admin">
		<img src="<?php echo esc_attr(plugins_url() . '/vendorfuel/assets/img/vf-logo.svg') ?>" alt="" width="24" height="24">
		<span>Vendor<span class="vf-orange">Fuel</span></span>
	</a>
	<?php if (isset($tokena) && isset($tokenb)) { ?>
		<nav>
			<a href="?page=vf-catalog" class="components-button is-tertiary">Catalog</a>
			<a href="?page=vf-customers" class="components-button is-tertiary">Customers</a>
			<a href="?page=vendorfuel#!/orders" class="components-button is-tertiary">Orders</a>
			<a href="?page=vendorfuel#!/reports" class="components-button is-tertiary">Reports</a>
		</nav>
	<?php } ?>
</header>