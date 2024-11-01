=== VendorFuel ===
Contributors: vendorfuel
Tags: ecommerce, e-commerce, shopping cart, store, punchout, sell, stripe, storefront, sell online, online store, paypal, credit cards
Requires at least: 4.7
Tested up to: 6.2
Stable tag: 8.22.2
Requires PHP: 7.4
License: GPLv3 or later
License URI: https://www.gnu.org/licenses/gpl-3.0.html

Enterprise-Level eCommerce, Small-Business Price

== Description ==

VendorFuel is a next-generation shopping cart that includes everything you need to add a modern, mobile responsive online store to your WordPress website in one complete solution.

With essential built-in features like Free Shipping and Dropship Support, SEO Friendly URLs, Promo Codes, Fully-Customizable Email Templates, Unlimited Autoresponders and more, you’ll be selling products at your WordPress website like a pro right away. And you can easily accept payments via Authorize.Net, PayPal, PayFabric, Qualpay, Square and Stripe with VendorFuel.

Powerful Reporting, Automatic Tax Calculation, Shipping & Label Creation, Punchout capabilities are all included in VendorFuel’s advanced Enterprise features. And with VendorFuel you own and control your data. VendorFuel respects your data. It’s yours, you own it, so you should be able to control it.

Don’t just build an online store, build an online business — with VendorFuel!

### VendorFuel's eCommerce features

- Mobile-first, responsive-designed shopping cart
- Manage customers and orders
- Supports flat, percentage and free shipping rates, pluss Shippo rate calculation
- Discount/coupon/promo codes
- Full drop-ship support
- Automatic tax calculation (AvaTax certified)
- SEO friendly URLs
- Google Analytics ready
- Built-in custom email editor powered by BeeFree
- Accept payments via Authorize.Net, PayPal, PayFabric, Qualpay, Square and/or Stripe (hosted within VendorFuel by the payment processor for the highest standard in PCI compliance)
- Single-Page checkout experience
- Product and category index
- Advanced customization tools
- Sales reporting and business intelligence analysis
- Custom report creator and editor
- Supports multiple price sheets
- Lock shipping and billing address
- Punchout capabilities
- Create and manage user groups
- Order approval hierarchy
- Fully PCI compliant solution

== Installation ==

To install the VendorFuel plugin for WordPress,

1. Go to your WordPress Dashboard and navigate to ‘Plugins’ by clicking Plugins > Add New, then search for VendorFuel. Then click on install.
2. Or download the VendorFuel plugin then upload the .zip file at the ‘Plugins’ page in WordPress by clicking Plugins > Add New > Upload Plugin -or- install manually by extracting all files contained in the downloaded .zip file, then upload them to the /wp-content/plugins/vendorfuel directory on your web server.
3. After installation, activate the VendorFuel plugin at the ‘Plugins’ page in WordPress.
4. Select VendorFuel in the Dashboard menu.
5. Enter your VendorFuel API Key on the Settings page in the VendorFuel plugin.
6. Login to VendorFuel using your new VendorFuel username and password.

== Frequently Asked Questions ==

= What makes VendorFuel different from other shopping carts? =

VendorFuel is different because it's a modern web application built using a RESTful API to deliver a lighting fast user experience. VendorFuel includes a number of unique enterprise-level features not typically found in other shopping carts.

= Where can I find Vendorful documentation? =

VendorFuel documentation is located at: [docs.vendorfuel.com](https://docs.vendorfuel.com)

= Will VendorFuel work with my theme? =

VendorFuel works with any theme compatible with Bootstrap 5.

= How do I add an account or cart menu to my theme? =
If you want to have an Account or Cart link to your Navigation or Menu, you can just add links to the Account or Cart pages.
If you want to add a dropdown menu, create an empty div or span element that has a .vendorfuel-account-menu or .vendorfuel-cart-menu class added to it. This will display a button for a dropdown menu that is responsive for mobile devices.

= How can I report a bug? =

Please email us at: <bughunt@vendorfuel.com>

= What third parties services does VendorFuel connect to? =
The VendorFuel plugin may connect to one or more of the following third-party APIs, in addition to VendorFuel's, depending upon your setup:

- [Algolia](https://www.algolia.com/) (search engine)
- [Avalara](https://www.avalara.com/us/en/index.html) (tax processing)
- [AuthorizeNet](https://www.authorize.net/) (payment gateway)
- [BeeFree](https://beefree.io/) (email)
- [Google Analytics](https://marketingplatform.google.com/about/analytics/) (analytics)
- [PayFabric](https://www.payfabric.com/) (payment gateway)
- [PayPal](https://www.paypal.com/us/home) (payment gateway)
- [QualPay](https://www.qualpay.com/) (payment gateway)
- [Square](https://squareup.com/us/en) (payment gateway)
- [Stripe](https://stripe.com/) (payment gateway)

= How are payments handled =
The VendorFuel plugin offers integration with the following payment gateways:

- [AuthorizeNet](https://www.authorize.net/)
- [PayFabric](https://www.payfabric.com/)
- [PayPal](https://www.paypal.com/us/home)
- [QualPay](https://www.qualpay.com/)
- [Square](https://squareup.com/us/en)
- [Stripe](https://stripe.com/)

Encrypted data is sent using the gateway's secure service. No credit card data is stored on VendorFuel's servers.

= What is your privacy policy? =
Read our [Privacy Policy](https://vendorfuel.com/privacy-policy/) for more details.

== Changelog ==

= 8.22.2 =
* Fixed: Adding items to cart from an orders page now displays correct messaging if there is an error.

= 8.22.1 =
* Fixed issue with adding items to cart from a previous order.

= 8.22.0 =
* Added help text to admin customer accounts to better clarify that group approvers should have credit line enabled in order to approve pending orders that were originally submitted using a credit line.
* Added product images to ordered items on checkout review page.
* Added warning messaging to admin product page that alerts user if a product is missing parcels whenever shipping mode is set to parcel.
* Added uninstall method to clean up VendorFuel options in WordPress.
* Changed admin orders page to disable return merchandise authorization (RMA) if the option is disabled under store settings.
* Changed admin settings store options so labels better describe what each option does.
* Changed customize checkout fields dialog to improve clarity and warn user of duplicate custom checkout field options.
* Changed saved carts to display list in a table format.
* Fixed admin customer form so that so that users can't set multiple custom checkout fields to replace the same default field.
* Fixed admin order tracking page so that order logs are easier to scroll through.
* Fixed admin settings so that certain WordPress operations aren't repeated whenever the user saves changes.
* Fixed orders and group orders (when confirmed) pages so they only show additional fields that have been set, instead of listing empty fields.

= 8.21.0 =
* Added description field for shipping rates.
* Added dialog to appear when adding an item to cart from a previous order, which will run a price availability check.
* Added help text to clarify what happens if a user adds a previously ordered item to their cart, specifically that it adds the item at the current price, not the previously purchased price.
* Added link to VendorFuel settings from WordPress admin plugins page.
* Added links to jump between products and filters on mobile devices while viewing catalog pages.
* Added results number to catalog subcategory cards.
* Changed 'Sign in as Customer' button on admin customer page to show external link icon.
* Changed catalog so filters appear below products on mobile devices.
* Fixed issue where certain users could see inconsistent number of subcategories on top and in sidebar.
* Fixed issue with shipping gateway form.
* Fixed issue where Payfabric return page wasn't created upon plugin installation.

= 8.20.0 =
* Added yesterday's sales and order totals to admin dashboard.
* Added order total to admin order index page.
* Added product manufacturer part number and more specific statuses to metadata.
* Changed admin payments page to display better warning message if user doesn't have correct roles.
* Changed admin payments PayFabric page to only accept five-digit zip code.
* Changed cart page so it's easier for users to clear and save carts.
* Changed order pages so that promo code details are hidden on pending orders.
* Fixed inconsistent modifier/condition usage on admin shipping rates page.
* Fixed issue where admin users could accidently remove their manager role, thus preventing them from accessing certain features.
* Fixed issue where catalog and some indexes weren't sorting as expected.
* Fixed issue where catalog page displayed the results count from the API, rather than what appeared on the page.
* Fixed issue where favorites list wouldn't update correctly after removing a favorite.
* Fixed issue where users could add discontinued items to their cart from the favorites page.
* Fixed issue where users couldn't update account name without reentering their password.
* Fixed issue where user could enter negative quantity numbers during partial checkout.
* Removed deprecated admin billing and tenant login pages.

= 8.19.0 =
* Added "All [Items]" link to section cards so it's clearer how the user can access all of a particular item.
* Added billing and shipping profile names to admin orders shipping and billing tab.
* Added link to customer group on admin orders additional info tab.
* Changed admin orders page so shipping tab is at end, tables use WordPress table styles.
* Changed notification types on admin orders page so they're easier to understand.

= 8.17.1 =
* Changed admin pricesheets UI to make editing products easier and align more with WordPress admin form UI.
* Fixed issue where admin pricesheets couldn't be updated.

= 8.17.0 =
* Added more help text to admin customer account upload template.
* Added ability to combine percentage/flat rate modifiers on one shipping rate. This is ideal for users who want to start with a base flat rate up to a certain cart amount, followed by a percentage rate.
* Added character counter to admin product meta fields.
* Added better error handling for missing template or include files.
* Changed admin label and buttons to title case to better align with WordPress case convention.
* Changed all password fields to explictly not be spellchecked to prevent browsers from sending passwords to spellchecking services.
* Fixed minor issue on product detail page.
* Fixed issue on admin user page with password validation.
* Fixed issues with forms on admin purchasing cost sheet page.
* Fixed issue on admin shipping rate page where conditions couldn't be removed.

= 8.16.2 =
* Fixed issue where customers couldn't be updated due to shipping rate data.

= 8.16.1 =
* Changed admin settings store tab to include store options, fixing issue where saving from either tab would remove the other's values.

= 8.16.0 =
* Added support for percentage-based shipping rates.
* Changed frontend checkout delivery method screen to be easier to read.
* Fixed issues in admin shipping rates where it was difficult to add or remove customers, groups, price sheets or restricted items.
