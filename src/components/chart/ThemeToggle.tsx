import styles from './chart.module.css';

export type Theme = 'light' | 'dark';

interface ThemeToggleProps {
	theme: Theme;
	onChange: (theme: Theme) => void;
}

export const ThemeToggle = ({ theme, onChange }: ThemeToggleProps) => {
	const makeClass = (value: Theme) =>
		`${styles.modeButton} ${theme === value ? styles.modeButtonActive : ''}`;

	return (
		<div className={styles.modeToggle}>
			<button
				type="button"
				className={makeClass('light')}
				onClick={() => onChange('light')}
			>
				Light
			</button>
			<button
				type="button"
				className={makeClass('dark')}
				onClick={() => onChange('dark')}
			>
				Dark
			</button>
		</div>
	);
};
