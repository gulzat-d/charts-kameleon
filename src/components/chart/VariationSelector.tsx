import type { Variation } from '../../types/abTest';
import styles from './chart.module.css';

const PALETTE = ['#3366CC', '#DC3912', '#109618', '#FF9900', '#990099'];

interface VariationSelectorProps {
	variations: Variation[];
	selectedIds: string[];
	onToggle: (id: string) => void;
}

export const VariationSelector = ({
	variations,
	selectedIds,
	onToggle,
}: VariationSelectorProps) => (
	<div className={styles.variationSelector}>
		{variations.map((variation, index) => {
			const isSelected = selectedIds.includes(variation.id);
			const color = PALETTE[index % PALETTE.length];

			return (
				<button
					key={variation.id}
					type="button"
					onClick={() => onToggle(variation.id)}
					className={`${styles.variationButton} ${
						isSelected ? styles.variationButtonActive : ''
					}`}
					style={
						isSelected
							? { backgroundColor: color, borderColor: color }
							: { color, borderColor: color }
					}
				>
					{variation.name}
				</button>
			);
		})}
	</div>
);
