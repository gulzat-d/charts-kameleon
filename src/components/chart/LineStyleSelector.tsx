import type { ChangeEvent } from 'react';

import styles from './chart.module.css';

export type LineStyle = 'line' | 'smooth' | 'area';

interface LineStyleSelectorProps {
	lineStyle: LineStyle;
	onChange: (style: LineStyle) => void;
}

export const LineStyleSelector = ({
	lineStyle,
	onChange,
}: LineStyleSelectorProps) => {
	const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
		onChange(event.target.value as LineStyle);
	};

	return (
		<div className={styles.selectWrapper}>
			<select
				className={styles.select}
				value={lineStyle}
				onChange={handleChange}
			>
				<option value="line">Line style: line</option>
				<option value="smooth">Line style: smooth</option>
				<option value="area">Line style: area</option>
			</select>
			<span className={styles.selectCaret} />
		</div>
	);
};
