import { type ChangeEvent } from 'react';
import styles from './chart.module.css';

export type Mode = 'day' | 'week';

interface ModeToggleProps {
	mode: Mode;
	onChange: (mode: Mode) => void;
}

export const ModeToggle = ({ mode, onChange }: ModeToggleProps) => {
	const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
		onChange(event.target.value as Mode);
	};

	return (
		<div className={styles.selectWrapper}>
			<select className={styles.select} value={mode} onChange={handleChange}>
				<option value="day">Day</option>
				<option value="week">Week</option>
			</select>
			<span className={styles.selectCaret} />
		</div>
	);
};
