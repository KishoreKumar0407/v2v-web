const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

const API_BASE_URL = configuredApiUrl || (import.meta.env.DEV ? 'http://localhost:3001' : '');

const getAuthHeaders = (): Record<string, string> => {
	if (typeof localStorage === 'undefined') return {};
	try {
		const user = JSON.parse(localStorage.getItem('admin_user') || 'null');
		return user?.session_token ? { Authorization: `Bearer ${user.session_token}` } : {};
	} catch {
		return {};
	}
};

const parseApiResponse = async <T>(response: Response): Promise<T> => {
	const body = await response.text();
	const contentType = response.headers.get('content-type') || '';

	if (!contentType.includes('application/json')) {
		throw new Error(
			API_BASE_URL
				? `Authentication API returned a non-JSON response (${response.status}). Check the API URL and backend deployment.`
				: 'VITE_API_URL is not configured for this production deployment.'
		);
	}

	try {
		return JSON.parse(body) as T;
	} catch {
		throw new Error(`Authentication API returned invalid JSON (${response.status}).`);
	}
};

export { API_BASE_URL, getAuthHeaders, parseApiResponse };
