import Cookies from "js-cookie";
import { useState } from "react";

const useToken = () => {
	const getToken = (id) => Cookies?.get(id);

	const [token, setToken] = useState({
		auth: getToken("auth") || null,
		id: getToken("id") || null,
		name: getToken("name") || null,
		department: getToken("department") || null,
	});

	// useEffect(() => {
	// 	const getToken = (id) => Cookies.get(id);

	// 	const auth = getToken("auth");
	// 	const id = getToken("id");
	// 	const name = getToken("name");
	// 	const department = getToken("department");

	// 	if (auth || id || name || department) {
	// 		setToken((prev) => ({
	// 			...prev,
	// 			auth,
	// 			id,
	// 			name,
	// 			department,
	// 		}));
	// 	}
	// }, [token]);

	const saveToken = (id, token) => {
		Cookies.set(id, token);
		setToken((prev) => ({
			...prev,
			[id]: token,
		}));
	};

	// const removeToken = () => {
	// 	const removeCookie = (id) => Cookies.remove(id);
	// 	removeCookie("auth");
	// 	removeCookie("id");
	// 	removeCookie("name");
	// 	removeCookie("department");
	// 	setToken((prev) => ({
	// 		...prev,
	// 		auth: null,
	// 		id: null,
	// 		name: null,
	// 		department: null,
	// 	}));
	// };

	return {
		setToken: saveToken,
		// removeToken,
		token,
	};
};

export { useToken };
