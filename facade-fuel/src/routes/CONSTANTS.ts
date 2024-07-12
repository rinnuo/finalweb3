export const Routes = {
	LOGIN: '/login',
	HOME: '/',
	ACCESS: {
		USERS: {
			LIST: '/users',
			CREATE: '/users/create',
			EDIT: '/users/:id',
			EDIT_PARAM: (id?: number) => `/users/${id}`
		},
		STATIONS: {
			LIST: '/stations',
			CREATE: '/stations/create',
			EDIT: '/stations/:id',
			EDIT_PARAM: (id?: number) => `/stations/${id}`
		}
	}
}