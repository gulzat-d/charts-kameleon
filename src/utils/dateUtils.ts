export const formatDateLabel = (dateStr: string): string => {
	const d = new Date(dateStr);
	if (Number.isNaN(d.getTime())) return dateStr;

	return d.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
	});
};

export const formatWeekLabel = (start: Date, end: Date): string => {
	const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
	const startStr = start.toLocaleDateString('en-US', opts);
	const endStr = end.toLocaleDateString('en-US', opts);
	return `${startStr} – ${endStr}`;
};

export const getIsoWeek = (date: Date): { year: number; week: number } => {
	const d = new Date(
		Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
	);
	const dayNum = d.getUTCDay() || 7;
	d.setUTCDate(d.getUTCDate() + 4 - dayNum);
	const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	const week = Math.ceil(((+d - +yearStart) / 86400000 + 1) / 7);
	return { year: d.getUTCFullYear(), week };
};
