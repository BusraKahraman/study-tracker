import Timer from './components/Timer';
import Stats from './components/Stats';
import History from './components/History';
import useStudyData from './hooks/useStudyData';

export default function App() {
	const { studyData, addDay, editDay, deleteDay } = useStudyData();

	return (
		<>
			<Timer onSave={addDay} />
			<Stats data={studyData} />
			<History
				data={studyData}
				onAddDay={addDay}
				onEditDay={editDay}
				onDeleteDay={deleteDay}
			/>
		</>
	);
}
