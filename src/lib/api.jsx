import axios from 'axios';
import Cookies from 'js-cookie';

import { ShowToast } from '@/components/Toast';

import { BASE_API } from './secret';

export const createApi = ({ contentType }) => {
	const api = axios.create({
		baseURL: BASE_API,
		headers: { 'Content-Type': contentType },
	});

	api.interceptors.request.use(
		async (config) => {
			const token = Cookies?.get('auth');

			if (token) {
				config.headers = {
					...config.headers,
					Authorization: token,
				};
			}
			return config;
		},
		(error) => {
			ShowToast(error?.response);
			return Promise.reject(error);
		}
	);

	return api;
};

export const api = createApi({ contentType: 'application/json' });
export const image_api = createApi({ contentType: 'multipart/form-data' });
