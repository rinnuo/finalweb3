export interface User {
	id: number,
	username: string,
	first_name: string,
	last_name: string,
	email: string;
	role: string;
	station: number | null;
}