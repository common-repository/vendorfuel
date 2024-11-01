import template from './product-documents.component.html';

export const ProductDocumentsComponent: ng.IComponentOptions = {
	bindings: {
		documents: '<',
	},
	template,
	controller: class ProductDocumentsController {
		documents: {
			extension: string;
			name: string;
			url: string | URL;
		}[];

		$onInit() {
			this.documents = this.documents.map((document) => {
				return {
					name: document.name,
					url: new URL(document.url),
					extension: document.extension.toLowerCase(),
					extIconClass: this.getExtIconClass(
						document.extension.toLowerCase()
					),
				};
			});
		}

		getExtIconClass(extension: string) {
			switch (extension) {
				case 'png':
				case 'jpg':
				case 'gif':
				case 'webp':
					return 'bi-file-earmark-image-fill';
				case 'doc':
				case 'docx':
				case 'rtf':
				case 'txt':
					return 'bi-file-earmark-text-fill';
				case 'ppt':
				case 'pptx':
					return 'bi-file-earmark-slides-fill';
				case 'pdf':
					return 'bi-file-earmark-pdf-fill';
				case 'csv':
				case 'xls':
				case 'xlsx':
					return 'bi-file-earmark-spreadsheet-fill';
				case 'zip':
					return 'bi-file-earmark-zip-fill';
				default:
					break;
			}
		}
	},
};
