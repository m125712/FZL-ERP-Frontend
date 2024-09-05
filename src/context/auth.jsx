import { ShowToast } from '@/components/Toast';
import { useCookie, useLocalStorage } from '@/hooks';
import { api } from '@lib/api';
import { createContext, useContext, useEffect, useState } from 'react';

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
			if (authCookie && userCookie) {
				setUser(JSON.parse(userCookie));
				setCanAccess(JSON.parse(userCanAccess));
			}
			setLoading(false);
		}

		loadCookieData();
	}, []);

	const Login = async (data) => {
		try {
			const res = await api.post('/hr/user/login', data);
			const { token, user: loginUser, can_access: hasAccess } = res?.data;

			updateAuthCookie(`Bearer ` + token || '');

			const userData = JSON.stringify(loginUser);
			const can_access = hasAccess;

			updateUserCanAccess(can_access || '');
			updateUserCookie(userData || '');

			setUser(userData);
			setCanAccess(can_access);

			console.log(res);

			// ShowToast(res);

			if (token && userData) return (window.location.href = '/dashboard');

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
