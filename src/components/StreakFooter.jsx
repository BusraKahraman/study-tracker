export default function StreakFooter({ streaks }) {
	return (
		<footer
			style={{
				marginTop: 'auto',
				paddingTop: '12px',
				borderTop: '1px solid #ddd',
				display: 'flex',
				justifyContent: 'space-between',
				fontSize: '0.9rem',
				opacity: 0.85,
			}}
		>
			<div>
				🔥 Current streak: <strong>{streaks.current}</strong> days
			</div>
			<div>
				🏆 Longest streak: <strong>{streaks.longest}</strong> days
			</div>
		</footer>
	);
}
