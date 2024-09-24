import { createContext, useContext, useEffect, useState } from 'react';
import { firstRoute } from '@/routes';
import { useCookie, useLocalStorage } from '@/hooks';

import { ShowToast } from '@/components/Toast';

import { api } from '@/lib/api';

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [canAccess, setCanAccess] = useState(null);
	const [loading, setLoading] = useState(true);

	const [authCookie, updateAuthCookie, removeAuthCookie] = useCookie('auth');
	const [userCookie, updateUserCookie, removeUserCookie] = useCookie('user');
	const [userCanAccess, updateUserCanAccess, removeUserCanAccess] =
		useLocalStorage('can_access', '');

	useEffect(() => {
		async function loadCookieData() {
			if (
				authCookie !== null &&
				userCookie !== null &&
				userCanAccess !== null
			) {
				setUser(() => JSON.parse(userCookie || user));
				setCanAccess(() => JSON.parse(userCanAccess || canAccess));
			}
			setLoading(false);
		}

		loadCookieData();
	}, [authCookie, userCookie, userCanAccess]);

	const Login = async (data) => {
		try {
			const res = await api.post('/hr/user/login', data);
			const { token, user: loginUser, can_access: hasAccess } = res?.data;

			updateAuthCookie(`Bearer ` + token || '');

			const userData = JSON.stringify(loginUser);
			const can_access = hasAccess;

			setUser(() => userData);
			setCanAccess(() => can_access);

			updateUserCookie(userData || '');
			updateUserCanAccess(can_access || '');

			if (token && userData)
				return (window.location.href = firstRoute?.path);

			ShowToast({
				type: res?.data?.type,
				message: res?.data?.message,
			});
		} catch (error) {
			ShowToast(error.response);
		}
	};

	const Logout = () => {
		removeAuthCookie();
		removeUserCookie();
		removeUserCanAccess();
		setUser(null);
	};

	const value = {
		signed: !!user,
		user,
		can_access: canAccess,
		loading,
		Login,
		Logout,
	};
	// const value = { signed: true, user, canAccess, loading, Login, Logout };

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};

export default AuthProvider;
