export function isValidTime(value) {
	const match = value.match(/^(\d+):([0-5]\d):([0-5]\d)$/);
	return Boolean(match);
}
