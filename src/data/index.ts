import raw from './data.json';
import type { RawVariation, RawDayEntry } from '../types/abTest';

interface DataFile {
	variations: RawVariation[];
	data: RawDayEntry[];
}

const typed = raw as DataFile;

export const variations = typed.variations;
export const data = typed.data;
