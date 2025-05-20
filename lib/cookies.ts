// Use plain browser APIs for client-side cookie management

export function setUserCookie(user: {
	id: string;
	email: string;
	role: string;
}) {
	document.cookie = `user=${encodeURIComponent(
		JSON.stringify(user)
	)}; path=/; max-age=${60 * 60 * 24 * 7}`;
}

export function getUserCookie() {
	const match = document.cookie.match(/(?:^|; )user=([^;]*)/);
	if (!match) return null;
	try {
		return JSON.parse(decodeURIComponent(match[1]));
	} catch {
		return null;
	}
}

export function clearUserCookie() {
	document.cookie = "user=; path=/; max-age=0";
}
