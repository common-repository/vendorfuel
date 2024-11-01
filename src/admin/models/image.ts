export class Image {
	wpImg?: unknown;
	deleted?: boolean;
	thumbnail:
		| string
		| {
				url: string;
		  };
	small_url?: string;
	thumb_url?: string;
	orig_url?: string;
	full?: {
		url: string;
		height: number;
		width: number;
	};
	orig_w?: number;
	orig_h?: number;
}
