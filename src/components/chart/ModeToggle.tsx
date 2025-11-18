import styles from './chart.module.css';

export type Mode = 'day' | 'week';

interface ModeToggleProps {
	mode: Mode;
	onChange: (mode: Mode) => void;
}

export const ModeToggle = ({ mode, onChange }: ModeToggleProps) => (
	<div className={styles.modeToggle}>
		<button
			type="button"
			onClick={() => onChange('day')}
			className={`${styles.modeButton} ${
				mode === 'day' ? styles.modeButtonActive : ''
			}`}
		>
			Day
		</button>
		<button
			type="button"
			onClick={() => onChange('week')}
			className={`${styles.modeButton} ${
				mode === 'week' ? styles.modeButtonActive : ''
			}`}
		>
			Week
		</button>
	</div>
);
