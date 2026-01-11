import { useState, useEffect } from 'react';

export default function useSessions() {
	const [sessions, setSessions] = useState(() => {
		const saved = localStorage.getItem('sessions');
		return saved ? JSON.parse(saved) : ['coding', 'reading', 'exercise'];
	});

	useEffect(() => {
		localStorage.setItem('sessions', JSON.stringify(sessions));
	}, [sessions]);

	const addSession = (name) => {
		if (!name || sessions.includes(name)) return;
		setSessions((prev) => [...prev, name]);
	};

	const deleteSession = (name) => {
		setSessions((prev) => prev.filter((s) => s !== name));
	};

	return { sessions, addSession, deleteSession };
}
