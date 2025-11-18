export interface RawVariation {
	id?: number;
	name: string;
}

export interface RawDayEntry {
	date: string;
	visits: Record<string, number>;
	conversions: Record<string, number>;
}

export interface Variation {
	id: string;
	name: string;
}

export type RateKey = `rate_${string}`;

export interface BaseDataRow {
	date: string;
	label: string;
	visits: Record<string, number>;
	conversions: Record<string, number>;
}

export type DataRow = BaseDataRow & {
	[key in RateKey]?: number | null;
};
