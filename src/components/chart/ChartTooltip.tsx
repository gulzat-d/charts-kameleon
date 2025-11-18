import type { TooltipContentProps } from 'recharts';
import type {
	NameType,
	ValueType,
} from 'recharts/types/component/DefaultTooltipContent';
import type { DataRow, Variation } from '../../types/abTest';
import { rateKey } from '../../utils/chartData';
import styles from './chart.module.css';

type RechartsTooltipProps = TooltipContentProps<ValueType, NameType>;

interface ExtraProps {
	selectedVariationIds: string[];
	variationsById: Record<string, Variation>;
}

type ChartTooltipProps = RechartsTooltipProps & ExtraProps;

export const ChartTooltip = ({
	active,
	payload,
	label,
	selectedVariationIds,
	variationsById,
}: ChartTooltipProps) => {
	if (!active || !payload || payload.length === 0) return null;

	const row = payload[0].payload as DataRow;

	return (
		<div className={styles.tooltip}>
			<div className={styles.tooltipTitle}>{label}</div>
			{selectedVariationIds.map((id) => {
				const variation = variationsById[id];
				const visits = row.visits[id] ?? 0;
				const conv = row.conversions[id] ?? 0;
				const rate = row[rateKey(id)];
				return (
					<div key={id} className={styles.tooltipRow}>
						<div className={styles.tooltipName}>{variation?.name ?? id}</div>
						<div className={styles.tooltipValues}>
							Visits: {visits}, Conversions: {conv}, Conversion:{' '}
							{typeof rate === 'number' ? `${rate.toFixed(2)}%` : '—'}
						</div>
					</div>
				);
			})}
		</div>
	);
};
