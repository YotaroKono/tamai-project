const DEFAULT_TIMEOUT_MS = 20 * 60 * 1000; // 20分

export const fetchWithTimeout = (
	input: RequestInfo | URL,
	init?: RequestInit,
): Promise<Response> => {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

	return fetch(input, {
		...init,
		signal: controller.signal,
	}).finally(() => clearTimeout(timeoutId));
};
