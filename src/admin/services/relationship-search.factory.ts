relationshipSearchFactory.$inject = ['Utils'];

export function relationshipSearchFactory(Utils: any) {
	const service = {
		Init(req: any) {
			return Utils.getHttpPromise(req).then((resp: any) => resp);
		},
		Search(req: any) {
			return Utils.getHttpPromise(req).then((resp: any) => resp);
		},
		ProcessResults(tab: number, pageConfig: any, item: any) {
			const fields = {} as any;
			let level;
			let levelItem;
			let duplicate;
			let returnField = '';

			fields[pageConfig.tabs[tab].id] = item[pageConfig.tabs[tab].id];
			for (let i = 0; i < pageConfig.tabs[tab].fields.length; i++) {
				levelItem = item;
				level = tab ? 1 : 0;
				duplicate = false;
				returnField = pageConfig.tabs[tab].fields[i];
				if (pageConfig.tabs[tab].fields[i].indexOf('.') > -1) {
					if (
						levelItem[pageConfig.tabs[tab].relationships[level + 1]]
					) {
						levelItem =
							levelItem[
								pageConfig.tabs[tab].relationships[++level]
							];
					} else {
						levelItem =
							levelItem[
								pageConfig.tabs[tab].relationships[level]
							];
					}
					pageConfig.tabs[tab].fields[i] = pageConfig.tabs[
						tab
					].fields[i].replace('.', '');
					duplicate = true;
				}

				if (
					pageConfig.tabs[tab].fields[i] === 'image' &&
					levelItem.image
				) {
					fields[returnField] = levelItem.image.thumb_url;
				} else if (levelItem) {
					fields[returnField] = levelItem[
						pageConfig.tabs[tab].fields[i]
					]
						? pageConfig.tabs[tab].fieldPrefixes[i] +
						  levelItem[pageConfig.tabs[tab].fields[i]]
						: levelItem[pageConfig.tabs[tab].fields[i]];
				} else {
					fields[returnField] =
						pageConfig.tabs[tab].fieldPrefixes[i] + 'N/A';
				}
				if (duplicate) {
					pageConfig.tabs[tab].fields[i] =
						'.' + pageConfig.tabs[tab].fields[i];
				}
			}
			return fields;
		},
	};

	return service;
}
