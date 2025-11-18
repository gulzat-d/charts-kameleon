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
	const makeClass = (style: LineStyle) =>
		`${styles.modeButton} ${
			lineStyle === style ? styles.modeButtonActive : ''
		}`;

	return (
		<div className={styles.modeToggle}>
			<button
				type="button"
				className={makeClass('line')}
				onClick={() => onChange('line')}
			>
				Line
			</button>
			<button
				type="button"
				className={makeClass('smooth')}
				onClick={() => onChange('smooth')}
			>
				Smooth
			</button>
			<button
				type="button"
				className={makeClass('area')}
				onClick={() => onChange('area')}
			>
				Area
			</button>
		</div>
	);
};
