import type {
	RawDayEntry,
	RawVariation,
	Variation,
	DataRow,
	RateKey,
} from '../types/abTest';
import { formatDateLabel, formatWeekLabel, getIsoWeek } from './dateUtils';

export const rateKey = (id: string): RateKey => `rate_${id}` as RateKey;

export const normalizeVariations = (raw: RawVariation[]): Variation[] =>
	raw.map((v) =>
		typeof v.id === 'number'
			? { id: String(v.id), name: v.name }
			: { id: '0', name: v.name }
	);

export const buildDayRows = (
	entries: RawDayEntry[],
	variations: Variation[]
): DataRow[] => {
	const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));

	return sorted.map((entry) => {
		const visits: Record<string, number> = {};
		const conversions: Record<string, number> = {};

		const row: DataRow = {
			date: entry.date,
			label: formatDateLabel(entry.date),
			visits,
			conversions,
		};

		for (const variation of variations) {
			const id = variation.id;
			const v = entry.visits[id] ?? 0;
			const c = entry.conversions[id] ?? 0;

			visits[id] = v;
			conversions[id] = c;

			row[rateKey(id)] = v > 0 ? (c / v) * 100 : null;
		}

		return row;
	});
};

interface WeekAggregation {
	key: string;
	startDate: Date;
	endDate: Date;
	visits: Record<string, number>;
	conversions: Record<string, number>;
}

export const buildWeekRows = (
	dayRows: DataRow[],
	variations: Variation[]
): DataRow[] => {
	const weekMap = new Map<string, WeekAggregation>();

	for (const row of dayRows) {
		const d = new Date(row.date);
		if (Number.isNaN(d.getTime())) continue;

		const { year, week } = getIsoWeek(d);
		const key = `${year}-W${week}`;

		let agg = weekMap.get(key);
		if (!agg) {
			const visits: Record<string, number> = {};
			const conversions: Record<string, number> = {};
			for (const v of variations) {
				visits[v.id] = 0;
				conversions[v.id] = 0;
			}
			agg = {
				key,
				startDate: d,
				endDate: d,
				visits,
				conversions,
			};
			weekMap.set(key, agg);
		}

		if (d < agg.startDate) agg.startDate = d;
		if (d > agg.endDate) agg.endDate = d;

		for (const v of variations) {
			const id = v.id;
			const currentVisits = row.visits[id] ?? 0;
			const currentConversions = row.conversions[id] ?? 0;
			agg.visits[id] += currentVisits;
			agg.conversions[id] += currentConversions;
		}
	}

	const result: DataRow[] = [];

	for (const agg of weekMap.values()) {
		const row: DataRow = {
			date: agg.key,
			label: formatWeekLabel(agg.startDate, agg.endDate),
			visits: { ...agg.visits },
			conversions: { ...agg.conversions },
		};

		for (const v of variations) {
			const id = v.id;
			const vTotal = agg.visits[id] ?? 0;
			const cTotal = agg.conversions[id] ?? 0;
			row[rateKey(id)] = vTotal > 0 ? (cTotal / vTotal) * 100 : null;
		}

		result.push(row);
	}

	result.sort((a, b) => a.label.localeCompare(b.label));

	return result;
};

export const computeYDomain = (
	rows: DataRow[],
	selectedIds: string[]
): [number, number] => {
	const values: number[] = [];

	for (const row of rows) {
		for (const id of selectedIds) {
			const value = row[rateKey(id)];
			if (typeof value === 'number') values.push(value);
		}
	}

	if (values.length === 0) return [0, 100];

	let min = Math.min(...values);
	let max = Math.max(...values);

	if (min === max) {
		min = Math.max(0, min - 1);
		max = max + 1;
	} else {
		const padding = (max - min) * 0.1;
		min = Math.max(0, min - padding);
		max = max + padding;
	}

	return [Number(min.toFixed(2)), Number(max.toFixed(2))];
};
