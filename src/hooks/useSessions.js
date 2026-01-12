import { useState, useEffect } from 'react';
import { SYSTEM_SESSION, HIDDEN_SESSIONS } from '../constants/sessions';

const normalize = (name) => name.trim().toLowerCase();

export default function useSessions() {
	const [sessions, setSessions] = useState(() => {
		const saved = localStorage.getItem('sessions');
		const parsed = saved
			? JSON.parse(saved)
			: ['coding', 'reading', 'exercise'];

		return parsed.includes(SYSTEM_SESSION)
			? parsed
			: [...parsed, SYSTEM_SESSION];
	});

	useEffect(() => {
		if (!sessions.includes(SYSTEM_SESSION)) {
			setSessions((prev) => [...prev, SYSTEM_SESSION]);
			return;
		}
		localStorage.setItem('sessions', JSON.stringify(sessions));
	}, [sessions]);

	const addSession = (name) => {
		const normalized = normalize(name);
		if (!normalized || sessions.includes(normalized)) return;
		setSessions([...sessions, normalized]);
	};

	const deleteSession = (name) => {
		if (name === SYSTEM_SESSION) return;
		setSessions(sessions.filter((s) => s !== name));
	};

	const visibleSessions = sessions.filter((s) => !HIDDEN_SESSIONS.includes(s));

	return {
		sessions,
		visibleSessions,
		addSession,
		deleteSession,
	};
}
