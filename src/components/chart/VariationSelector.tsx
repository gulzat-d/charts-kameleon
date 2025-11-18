import { useState } from 'react';
import type { Variation } from '../../types/abTest';
import styles from './chart.module.css';

interface VariationSelectorProps {
	variations: Variation[];
	selectedIds: string[];
	onToggle: (id: string) => void;
}

export const VariationSelector = ({
	variations,
	selectedIds,
	onToggle,
}: VariationSelectorProps) => {
	const [open, setOpen] = useState<boolean>(false);

	const allSelected = selectedIds.length === variations.length;

	const label = (() => {
		if (allSelected) return 'All variations selected';
		if (selectedIds.length === 0) return 'No variations selected';
		if (selectedIds.length === 1) {
			const variation = variations.find((item) => item.id === selectedIds[0]);
			return variation?.name ?? '1 variation selected';
		}
		return `${selectedIds.length} variations selected`;
	})();

	const handleToggleOpen = () => {
		setOpen((prev) => !prev);
	};

	const handleItemChange = (id: string) => {
		onToggle(id);
	};

	return (
		<div className={styles.dropdown}>
			<button
				type="button"
				className={styles.dropdownButton}
				onClick={handleToggleOpen}
			>
				<span>{label}</span>
				<span className={styles.selectCaret} />
			</button>

			{open && (
				<div className={styles.dropdownMenu}>
					{variations.map((variation) => {
						const checked = selectedIds.includes(variation.id);

						return (
							<label key={variation.id} className={styles.dropdownItem}>
								<input
									type="checkbox"
									checked={checked}
									onChange={() => handleItemChange(variation.id)}
								/>
								<span>{variation.name}</span>
							</label>
						);
					})}
				</div>
			)}
		</div>
	);
};
