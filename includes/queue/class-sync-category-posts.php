<?php

class Sync_Category_Posts extends WP_Background_Process {


	/**
	 * @var string
	 */
	protected $action = 'sync_categories';

	/**
	 * Task
	 *
	 * Override this method to perform any actions required on each
	 * queue item. Return the modified item for further processing
	 * in the next pass through. Or, return false to remove the
	 * item from the queue.
	 *
	 * @param mixed $item Queue item to iterate over
	 *
	 * @return mixed
	 */
	private $tokena   = null;
	private $tokenb   = null;
	private $endpoint = VENDORFUEL_API_URL
		. '/admin/category/seo'
		. '?apikey=' . VENDORFUEL_API_KEY;

	private $total_pages = 1;

	private $page = null;

	protected function task($item) {
		// Actions to perform
		$this->page    = $item['page'];
		$this->tokena  = $item['tokena'];
		$this->tokenb  = $item['tokenb'];
		$this->id      = ($item['id']) ? $item['id'] : '';
		$this->started = $item['started'];

		if (is_null($this->tokena) && is_null($this->tokenb)) {
			return false;
		}

		$this->retrieveProducts($this->page, $this->id);
		return false;
	}

	/**
	 * Complete
	 *
	 * Override if applicable, but ensure that the below actions are
	 * performed, or, call parent::complete().
	 */
	protected function complete() {
		parent::complete();
		$this->log('completing item : ' . $this->page);
		$this->unlock_process();

		if ($this->page < $this->total_pages) {
			$item['page']    = $this->page + 1;
			$item['tokena']  = $this->tokena;
			$item['tokenb']  = $this->tokenb;
			$item['started'] = $this->started;

			$this->push_to_queue($item);
			$this->save()->dispatch();
		} else {
			$this->log('completed syncing category posts');
			if ('' === $this->id || null === $this->id) {
				$this->clearCategoryPosts();
			}
		}
	}

	protected function clearCategoryPosts() {
		global $wpdb;
		$posts_table = $wpdb->posts;
		$result = $wpdb->get_results($wpdb->prepare("SELECT * FROM {$posts_table} WHERE post_type = 'vf-category' AND post_modified < %s", array($this->started)), OBJECT); //phpcs:ignore
		while ($result) {
			$this->log('clearing out dated posts');

			foreach ($result as $post) {
				$post_id = $post->ID;
				wp_delete_post($post_id, true);
			}
			$result = $wpdb->get_results($wpdb->prepare("SELECT * FROM {$posts_table} WHERE post_type = 'vf-category' AND post_modified < %s", array($this->started)), OBJECT); //phpcs:ignore
		}
	}

	protected function retrieveProducts($page, $id) {
		$this->endpoint .= '&tokena='
			. $this->tokena
			. '&tokenb=' . $this->tokenb
			. '&rpp=500'
			. '&status=active'
			. '&id=' . $this->id
			. '&page=' . $page;

		$response = wp_remote_get(
			$this->endpoint,
			array(
				'sslverify' => false,
				'timeout'   => 120,
			)
		);

		if (is_wp_error($response)) {
			$this->log($response->get_error_message());
		}

		$body = wp_remote_retrieve_body($response);
		if (is_wp_error($body)) {
			$this->log($body->get_error_message());
			return;
		}

		$response = json_decode($body);
		if (!isset($response->categories)) {
			return $this->retrieveProducts($page, $id);
		}
		$categories        = $response->categories;
		$this->total_pages = $categories->last_page;

		foreach ($categories->data as $category) {
			$slug        = sanitize_text_field($category->slug);
			$category_id = $category->cat_id;
			$content     = '
				<!-- wp:shortcode -->
				[vf-template name="catalog" cat_id="' . $category_id . '"]
				<!-- /wp:shortcode -->';
			$meta_title       = null;
			$meta_description = null;

			if ($category->meta && null !== $category->meta->description) {
				$meta_description = sanitize_text_field($category->meta->description);
			} elseif ($category->description && null !== $category->description) {
				$meta_description = sanitize_text_field($category->description);
			}

			if ($category->meta && null !== $category->meta->title) {
				$meta_title = sanitize_text_field($category->meta->title);
			} else {
				$meta_title = sanitize_text_field($category->title);
			}

			$post        = array(
				'post_type'    => 'vf-category',
				'post_title'   => sanitize_text_field($category->title),
				'post_name'    => sanitize_text_field($slug),
				'post_status'  => 'publish',
				'post_content' => $content,
			);

			global $wpdb;
			$post_table = $wpdb->posts;
			$result = $wpdb->get_results($wpdb->prepare("SELECT * FROM {$post_table} WHERE post_type = 'vf-category' AND post_content LIKE %s", array("%cat_id='{$category_id}'%")), OBJECT); //phpcs:ignore
			if ($result) {
				$this->log('found existings posts for category id: ' . $category->cat_id);
				$post_id    = $result[0]->ID;
				$post['ID'] = $post_id;
				$post['post_content'] = $result[0]->post_content;
				wp_update_post($post);
				$this->log('Updating post for cat id: ' . $post_id . ' ' . $category->cat_id);
				if ($meta_description) {
					update_post_meta($post_id, 'vfmetadesc', substr(sanitize_text_field($meta_description), 0, 155));
				}

				if ($meta_title) {
					update_post_meta($post_id, '_yoast_wpseo_title', substr($meta_title, 0, 160));
				}

				$count = count($result);
				if ($count > 1) {
					$this->log('found duplicate posts for category id: ' . $category->cat_id);
					for ($i = 1; $i < $count; $i++) {
						$this->log('delete duplicate post for category id: ' . $category->cat_id);
						$post_id = $result[$i]->ID;
						wp_delete_post($post_id);
					}
				}
			} else {
				$post_id = wp_insert_post($post);
				$this->log('Inserting post for cat id: ' . $post_id . ' ' . $category->cat_id);
				if ($meta_description) {
					add_post_meta($post_id, 'vfmetadesc', substr(sanitize_text_field($meta_description), 0, 155), true);
					add_post_meta($post_id, '_yoast_wpseo_metadesc', '%%cf_vfmetadesc%%', true);
				}

				if ($meta_title) {
					update_post_meta($post_id, '_yoast_wpseo_title', substr($meta_title, 0, 160));
				}
			}
		}

		$this->total_pages = $categories->last_page;
	}
}
