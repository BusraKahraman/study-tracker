import useLocalStorage from './useLocalStorage';
import { SYSTEM_SESSION, HIDDEN_SESSIONS } from '../constants/sessions';

export default function useStudyData() {
	const [studyData, setStudyData] = useLocalStorage('studyData', {});
	const [sessions, setSessions] = useLocalStorage('sessions', ['general']);

	const addSession = (session) => {
		setSessions((prev) => (prev.includes(session) ? prev : [...prev, session]));
	};

	const addDay = (date, seconds, session) => {
		if (!session || typeof seconds !== 'number') return;

		if (!HIDDEN_SESSIONS.includes(session)) {
			addSession(session);
		}

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

	const deleteSessionAndMigrate = (sessionToDelete) => {
		if (!sessionToDelete || sessionToDelete === SYSTEM_SESSION) return;

		setStudyData((prev) => {
			const updated = {};

			for (const [date, daySessions] of Object.entries(prev)) {
				const { [sessionToDelete]: removed, ...rest } = daySessions;

				if (removed) {
					rest[SYSTEM_SESSION] = (rest[SYSTEM_SESSION] || 0) + removed;
				}

				updated[date] = rest;
			}

			return updated;
		});

		setSessions((prev) => prev.filter((s) => s !== sessionToDelete));
	};

	return {
		studyData,
		sessions,
		addSession,
		addDay,
		deleteDay,
		deleteSessionAndMigrate,
	};
}
