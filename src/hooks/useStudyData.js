import useLocalStorage from './useLocalStorage';

export default function useStudyData() {
	const [studyData, setStudyData] = useLocalStorage('studyData', {});
	const [sessions, setSessions] = useLocalStorage('sessions', ['general']);

	const addSession = (session) => {
		setSessions((prev) => (prev.includes(session) ? prev : [...prev, session]));
	};

	const addDay = (date, seconds, session) => {
		if (!session || typeof seconds !== 'number') return;

		addSession(session);

		setStudyData((prev) => {
			const day = prev[date] || {};
			return {
				...prev,
				[date]: {
					...day,
					[session]: (day[session] || 0) + seconds,
				},
			};
		});
	};

	const deleteDay = (date) => {
		setStudyData((prev) => {
			const copy = { ...prev };
			delete copy[date];
			return copy;
		});
	};

	return {
		studyData,
		sessions,
		addSession,
		addDay,
		deleteDay,
	};
}
