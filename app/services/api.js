import 'isomorphic-fetch';

const headers = {
	'Accept': 'application/json',
	'Content-Type': 'application/json'
};

const handleBadResponse = function (response) {
	if (response.status >= 400) {
		throw new Error('Bad response from server');
	}
	return response.json();
}

export const fetchCancellation = () =>
	fetch('/cancellation', { method: 'GET', headers })
		.then(handleBadResponse)
		.then(({ data }) => data);
