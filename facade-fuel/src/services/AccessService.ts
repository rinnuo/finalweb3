import { User } from "../models/access/User";
import { Station } from "../models/access/Station";
import accessapi from "./Interceptors";

export const AccessService = {
	getUser: (userId: number): Promise<User> => {
		return new Promise<User>((resolve, reject) => {
			accessapi.get(`users/${userId}/`)
				.then(response => resolve(response.data))
				.catch(error => reject(error))
		});
	},
	listUsers: () => {
		return new Promise<User[]>((resolve, reject) => {
			accessapi.get('users/')
				.then(response => resolve(response.data))
				.catch(error => reject(error))
		});
	},
	createUser: (user: User) => {
		return new Promise<User>((resolve, reject) => {
			accessapi.post('users/', user)
				.then(response => resolve(response.data))
				.catch(error => reject(error))
		});
	},
	updateUser: (id: number, user: User) => {
		return new Promise<User>((resolve, reject) => {
			accessapi.put(`users/${id}/`, user)
				.then(response => resolve(response.data))
				.catch(error => reject(error))
		});
	},
	deleteUser: (id: number) => {
		return new Promise<void>((resolve, reject) => {
			accessapi.delete(`users/${id}/`)
				.then(() => resolve())
				.catch(error => reject(error))
		});
	},

	getStation: (stationId: number): Promise<Station> => {
		return new Promise<Station>((resolve, reject) => {
			accessapi.get(`stations/${stationId}/`)
				.then(response => resolve(response.data))
				.catch(error => reject(error))
		});
	},
	listStations: () => {
		return new Promise<Station[]>((resolve, reject) => {
			accessapi.get('stations/')
				.then(response => resolve(response.data))
				.catch(error => reject(error))
		});
	},
	createStation: (station: Station) => {
		return new Promise<Station>((resolve, reject) => {
			accessapi.post('stations/', station)
				.then(response => resolve(response.data))
				.catch(error => reject(error))
		});
	},
	updateStation: (id: number, station: Station) => {
		return new Promise<Station>((resolve, reject) => {
			accessapi.put(`stations/${id}/`, station)
				.then(response => resolve(response.data))
				.catch(error => reject(error))
		});
	},
	deleteStation: (id: number) => {
		return new Promise<void>((resolve, reject) => {
			accessapi.delete(`stations/${id}/`)
				.then(() => resolve())
				.catch(error => reject(error))
		});
	}
};