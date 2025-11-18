import { useMemo, useState, useRef } from 'react';

import type { RawVariation, RawDayEntry, Variation } from '../../types/abTest';
import {
	buildDayRows,
	buildWeekRows,
	computeYDomain,
	normalizeVariations,
} from '../../utils/chartData';
import ConversionChart from './ConversionChart';
import { ModeToggle, type Mode } from './ModeToggle';
import { LineStyleSelector, type LineStyle } from './LineStyleSelector';
import { ThemeToggle, type Theme } from './ThemeToggle';
import { VariationSelector } from './VariationSelector';
import styles from './chart.module.css';

export interface ChartProps {
	variations: RawVariation[];
	data: RawDayEntry[];
}

const Chart = ({ variations: rawVariations, data }: ChartProps) => {
	const variations: Variation[] = useMemo(
		() => normalizeVariations(rawVariations),
		[rawVariations]
	);

	const variationsById = useMemo(
		() =>
			variations.reduce<Record<string, Variation>>((acc, v) => {
				acc[v.id] = v;
				return acc;
			}, {}),
		[variations]
	);

	const [mode, setMode] = useState<Mode>('day');
	const [selectedIds, setSelectedIds] = useState<string[]>(() =>
		variations.map((v) => v.id)
	);
	const [lineStyle, setLineStyle] = useState<LineStyle>('line');
	const [theme, setTheme] = useState<Theme>('light');

	const chartRef = useRef<HTMLDivElement | null>(null);

	const dayRows = useMemo(
		() => buildDayRows(data, variations),
		[data, variations]
	);
	const weekRows = useMemo(
		() => buildWeekRows(dayRows, variations),
		[dayRows, variations]
	);
	const rows = mode === 'day' ? dayRows : weekRows;

	const yDomain = computeYDomain(rows, selectedIds);

	const handleToggleVariation = (id: string) => {
		setSelectedIds((prev) => {
			const isSelected = prev.includes(id);
			if (isSelected) {
				if (prev.length === 1) {
					return prev;
				}
				return prev.filter((vId) => vId !== id);
			}
			return [...prev, id];
		});
	};

	const handleModeChange = (nextMode: Mode) => {
		setMode(nextMode);
	};

	const pageClass =
		theme === 'dark'
			? `${styles.page} ${styles.pageDark}`
			: `${styles.page} ${styles.pageLight}`;

	return (
		<div className={pageClass}>
			<div className={styles.controls}>
				<VariationSelector
					variations={variations}
					selectedIds={selectedIds}
					onToggle={handleToggleVariation}
				/>
				<ModeToggle mode={mode} onChange={handleModeChange} />
				<ThemeToggle theme={theme} onChange={setTheme} />
				<LineStyleSelector lineStyle={lineStyle} onChange={setLineStyle} />
			</div>

			<ConversionChart
				data={rows}
				variations={variations}
				variationsById={variationsById}
				selectedIds={selectedIds}
				yDomain={yDomain}
				lineStyle={lineStyle}
				theme={theme}
				chartRef={chartRef}
			/>
		</div>
	);
};

export default Chart;
