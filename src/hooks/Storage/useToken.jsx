import { useState } from 'react';
import Cookies from 'js-cookie';

const useToken = () => {
	const getToken = (id) => Cookies?.get(id);

	const [token, setToken] = useState({
		auth: getToken('auth') || null,
		id: getToken('id') || null,
		name: getToken('name') || null,
		department: getToken('department') || null,
	});

	const saveToken = (id, token) => {
		Cookies.set(id, token);
		setToken((prev) => ({
			...prev,
			[id]: token,
		}));
	};

	return {
		setToken: saveToken,
		// removeToken,
		token,
	};
};

export { useToken };
