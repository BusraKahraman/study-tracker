import { useEffect, useState } from 'react';

export default function useStudyData() {
	const [studyData, setStudyData] = useState({});

	useEffect(() => {
		const stored = localStorage.getItem('studyData');
		if (stored) setStudyData(JSON.parse(stored));
	}, []);

	const persist = (data) => {
		localStorage.setItem('studyData', JSON.stringify(data));
		setStudyData(data);
	};

	const addDay = (date, seconds) => {
		persist({
			...studyData,
			[date]: (studyData[date] || 0) + seconds,
		});
	};

	const editDay = (date, seconds) => {
		persist({ ...studyData, [date]: seconds });
	};

	const deleteDay = (date) => {
		const updated = { ...studyData };
		delete updated[date];
		persist(updated);
	};

	return { studyData, addDay, editDay, deleteDay };
}
