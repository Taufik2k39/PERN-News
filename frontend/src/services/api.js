import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
const AUTH_TOKEN_KEY = "authToken"

const api = axios.create({
	baseURL: API_BASE_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
})

export const setAuthToken = (token) => {
	if (token) {
		localStorage.setItem(AUTH_TOKEN_KEY, token)
	}
}

export const clearAuthToken = () => {
	localStorage.removeItem(AUTH_TOKEN_KEY)
}

export const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY)

const requireAuthToken = () => {
	const token = getAuthToken()

	if (!token) {
		throw new Error("Silakan login terlebih dahulu.")
	}

	return token
}

api.interceptors.request.use((config) => {
	const token = getAuthToken()

	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}

	return config
})

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			clearAuthToken()
		}

		const message = error.response?.data?.message || error.message || "Unknown error"
		return Promise.reject(new Error(message))
	}
)

export const API_ENDPOINTS = {
	auth: {
		register: "/auth/register",
		login: "/auth/login",
		me: "/auth/me",
	},
	posts: {
		list: "/posts",
		detail: (id) => `/posts/${id}`,
	},
}

export const authApi = {
	register: async (payload) => {
		const { data } = await api.post(API_ENDPOINTS.auth.register, payload)
		return data
	},
	login: async (payload) => {
		const { data } = await api.post(API_ENDPOINTS.auth.login, payload)
		if (data?.token) {
			setAuthToken(data.token)
		}
		return data
	},
	me: async () => {
		requireAuthToken()
		const { data } = await api.get(API_ENDPOINTS.auth.me)
		return data
	},
	deleteMe: async () => {
		requireAuthToken()
		const { data } = await api.delete(API_ENDPOINTS.auth.me)
		return data
	},
	updateMe: async (payload) => {
		requireAuthToken()
		const { data } = await api.put(API_ENDPOINTS.auth.me, payload)
		return data
	},
}

export const postsApi = {
	getAll: async () => {
		const { data } = await api.get(API_ENDPOINTS.posts.list)
		return data
	},
	getById: async (id) => {
		const { data } = await api.get(API_ENDPOINTS.posts.detail(id))
		return data
	},
	create: async (payload) => {
		requireAuthToken()
		const { data } = await api.post(API_ENDPOINTS.posts.list, payload)
		return data
	},
	update: async (id, payload) => {
		requireAuthToken()
		const { data } = await api.put(API_ENDPOINTS.posts.detail(id), payload)
		return data
	},
	remove: async (id) => {
		requireAuthToken()
		const { data } = await api.delete(API_ENDPOINTS.posts.detail(id))
		return data
	},
}

export default api
