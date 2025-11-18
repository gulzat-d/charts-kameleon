import type { RefObject } from 'react';
import {
	ComposedChart,
	Line,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from 'recharts';
import type { TooltipContentProps } from 'recharts';
import type {
	NameType,
	ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

import type { DataRow, Variation } from '../../types/abTest';
import { rateKey } from '../../utils/chartData';
import { ChartTooltip } from './ChartTooltip';
import styles from './chart.module.css';
import type { LineStyle } from './LineStyleSelector';
import type { Theme } from './ThemeToggle';

type RechartsTooltipProps = TooltipContentProps<ValueType, NameType>;

const PALETTE = ['#3366CC', '#DC3912', '#109618', '#FF9900', '#990099'];

interface ConversionChartProps {
	data: DataRow[];
	variations: Variation[];
	variationsById: Record<string, Variation>;
	selectedIds: string[];
	yDomain: [number, number];
	lineStyle: LineStyle;
	theme: Theme;
	chartRef: RefObject<HTMLDivElement | null>;
}

const ConversionChart = ({
	data,
	variations,
	variationsById,
	selectedIds,
	yDomain,
	lineStyle,
	theme,
	chartRef,
}: ConversionChartProps) => {
	const axisColor = theme === 'dark' ? '#e5e7eb' : '#4b5563';
	const gridColor = theme === 'dark' ? '#4b5563' : '#e5e7eb';
	const bgColor = theme === 'dark' ? '#111827' : '#ffffff';

	const renderSeries = () =>
		variations.map((variation, index) => {
			if (!selectedIds.includes(variation.id)) return null;
			const color = PALETTE[index % PALETTE.length];
			const key = rateKey(variation.id);

			if (lineStyle === 'area') {
				return (
					<Area
						key={variation.id}
						type="monotone"
						dataKey={key}
						name={variation.name}
						stroke={color}
						fill={color}
						fillOpacity={0.25}
						isAnimationActive={false}
						connectNulls
					/>
				);
			}

			const type = lineStyle === 'smooth' ? 'monotone' : 'linear';

			return (
				<Line
					key={variation.id}
					type={type}
					dataKey={key}
					name={variation.name}
					stroke={color}
					strokeWidth={2}
					dot={false}
					isAnimationActive={false}
					connectNulls
				/>
			);
		});

	return (
		<div
			className={styles.chart}
			ref={chartRef}
			style={{ backgroundColor: bgColor }}
		>
			<ResponsiveContainer>
				<ComposedChart
					data={data}
					margin={{ top: 16, right: 24, left: 8, bottom: 16 }}
				>
					<CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
					<XAxis
						dataKey="label"
						tick={{ fontSize: 12, fill: axisColor }}
						stroke={axisColor}
						interval="preserveStartEnd"
					/>
					<YAxis
						tick={{ fontSize: 12, fill: axisColor }}
						stroke={axisColor}
						tickFormatter={(value: number) => `${value.toFixed(1)}%`}
						domain={yDomain}
					/>
					<Tooltip
						cursor={{ stroke: '#888', strokeWidth: 1 }}
						content={(props: RechartsTooltipProps) => (
							<ChartTooltip
								{...props}
								selectedVariationIds={selectedIds}
								variationsById={variationsById}
							/>
						)}
					/>
					<Legend />

					{renderSeries()}
				</ComposedChart>
			</ResponsiveContainer>
		</div>
	);
};

export default ConversionChart;
