import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from 'recharts';
import type { DataRow, Variation } from '../../types/abTest';
import { rateKey } from '../../utils/chartData';
import { ChartTooltip } from './ChartTooltip';
import type { TooltipContentProps } from 'recharts';
import type {
	NameType,
	ValueType,
} from 'recharts/types/component/DefaultTooltipContent';
import styles from './chart.module.css';

type RechartsTooltipProps = TooltipContentProps<ValueType, NameType>;

const PALETTE = ['#3366CC', '#DC3912', '#109618', '#FF9900', '#990099'];

interface ConversionChartProps {
	data: DataRow[];
	variations: Variation[];
	variationsById: Record<string, Variation>;
	selectedIds: string[];
	yDomain: [number, number];
}

export const ConversionChart = ({
	data,
	variations,
	variationsById,
	selectedIds,
	yDomain,
}: ConversionChartProps) => (
	<div className={styles.chart}>
		<ResponsiveContainer>
			<LineChart
				data={data}
				margin={{ top: 16, right: 24, left: 8, bottom: 16 }}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis
					dataKey="label"
					tick={{ fontSize: 12 }}
					interval="preserveStartEnd"
				/>
				<YAxis
					tick={{ fontSize: 12 }}
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
				{variations.map((variation, index) => {
					if (!selectedIds.includes(variation.id)) return null;
					const color = PALETTE[index % PALETTE.length];
					return (
						<Line
							key={variation.id}
							type="monotone"
							dataKey={rateKey(variation.id)}
							name={variation.name}
							stroke={color}
							strokeWidth={2}
							dot={false}
							isAnimationActive={false}
							connectNulls
						/>
					);
				})}
			</LineChart>
		</ResponsiveContainer>
	</div>
);
