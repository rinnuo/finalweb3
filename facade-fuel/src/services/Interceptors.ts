import axios from "axios";

const accessapi = axios.create({
	baseURL: 'http://127.0.0.1:8000/accessapi/',
	timeout: 5000,
	headers: {
		'Content-Type': 'application/json',
	}
});
accessapi.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('access_token');
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);
accessapi.interceptors.response.use(
	(response) => response,
	async (error) => {
		console.log('error', error);
		if (error.response?.status === 401) {
			let response;
			try {
				if (!localStorage.getItem('refresh_token')) {
					console.log("refresh token vacĂ­o")
					if (window.location.pathname !== '/login') {
						window.location.href = '/login';
					}
					return Promise.reject(error)
				}
				response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
					refresh: localStorage.getItem('refresh_token')
				})
			} catch (authError) {
				if (window.location.pathname !== '/login') {
					window.location.href = '/login';
				}
				console.log("auth error", authError)
				return Promise.reject(authError)
			}

			localStorage.setItem('access_token', response?.data.access)
			return accessapi.request(error.config)
		}

		return Promise.reject(error)
	});

export default accessapi;