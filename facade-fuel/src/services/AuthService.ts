import { User } from "../models/access/User";
import { LoginRequest } from "../models/requests/LoginRequest";
import { AuthResponse } from "../models/responses/AuthResponse";
import accessapi from "./Interceptors";

export const AuthService = {
	login: (request: LoginRequest) => {
		return new Promise<AuthResponse>((resolve, reject) => {
			accessapi.post('token/', request)
				.then(response => resolve(response.data))
				.catch(error => reject(error))
		});
	},
	logout: () => {
		return new Promise<void>((resolve) => {
			localStorage.removeItem('access_token');
			localStorage.removeItem('refresh_token');
			resolve();
		});
	},
	getUserInfo: () => {
		return new Promise<User>((resolve, reject) => {
			accessapi.get('http://localhost:8000/accessapi/users/me')
				.then(response => resolve(response.data))
				.catch(error => reject(error))
		});
	}
}