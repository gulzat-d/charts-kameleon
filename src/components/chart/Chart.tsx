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

export interface ZoomRange {
	startIndex: number;
	endIndex: number;
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
	const [xRange, setXRange] = useState<ZoomRange | null>(null);

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

	const rowsForDomain = useMemo(() => {
		if (!xRange) {
			return rows;
		}
		const start = Math.max(0, xRange.startIndex);
		const end = Math.min(rows.length - 1, xRange.endIndex);
		return rows.slice(start, end + 1);
	}, [rows, xRange]);

	const yDomain = computeYDomain(rowsForDomain, selectedIds);

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
		setXRange(null);
	};

	const handleResetZoom = () => {
		setXRange(null);
	};

	const pageClass =
		theme === 'dark'
			? `${styles.page} ${styles.pageDark}`
			: `${styles.page} ${styles.pageLight}`;

	return (
		<div className={pageClass}>
			<div className={styles.controls}>
				<ModeToggle mode={mode} onChange={handleModeChange} />
				<LineStyleSelector lineStyle={lineStyle} onChange={setLineStyle} />
				<ThemeToggle theme={theme} onChange={setTheme} />
				<VariationSelector
					variations={variations}
					selectedIds={selectedIds}
					onToggle={handleToggleVariation}
				/>
				<div className={styles.actions}>
					<button
						type="button"
						className={styles.actionButton}
						onClick={handleResetZoom}
					>
						Reset zoom
					</button>
				</div>
			</div>

			<ConversionChart
				data={rows}
				variations={variations}
				variationsById={variationsById}
				selectedIds={selectedIds}
				yDomain={yDomain}
				lineStyle={lineStyle}
				theme={theme}
				xRange={xRange}
				onZoomChange={setXRange}
				chartRef={chartRef}
			/>
		</div>
	);
};

export default Chart;
