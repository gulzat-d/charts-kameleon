import './App.css';
import Chart from './components/chart/Chart';
import { variations, data } from './data';

function App() {
	return (
		<>
			<div>
				<Chart variations={variations} data={data} />
			</div>
		</>
	);
}

export default App;
