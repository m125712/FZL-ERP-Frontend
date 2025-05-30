import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
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

	const Login = async (data) => {
		try {
			const res = await api.post('/hr/user/login', data);
			if (res?.data?.status === 400) {
				ShowToast(res?.data);
				return false;
			}

			const { token, user: loginUser, can_access } = res?.data;

			updateAuthCookie(`Bearer ` + token || '');

			const userData = JSON.stringify(loginUser);

			setUser(userData);
			setCanAccess(can_access);

			updateUserCookie(userData || '');
			updateUserCanAccess(can_access || '');

			const path = '/profile';
			// window.location.href = path;
			return true;
		} catch (error) {
			console.log(error);
			ShowToast({
				type: 'error',
				message: error?.code,
			});
		}
		return false;
	};

	const Logout = useCallback(async () => {
		await removeAuthCookie();
		await removeUserCookie();
		await removeUserCanAccess();
		setUser(null);
		setCanAccess(null);
	}, [removeAuthCookie, removeUserCanAccess, removeUserCookie]);

	useEffect(() => {
		async function loadCookieData() {
			try {
				let parsedUser = null;
				let parsedCanAccess = null;

				if (userCookie) {
					parsedUser = JSON.parse(userCookie);
				}
				if (userCanAccess) {
					parsedCanAccess = JSON.parse(userCanAccess);
				}

				setUser(parsedUser);
				setCanAccess(parsedCanAccess);
			} catch (error) {
				console.error('Error parsing stored data:', error);
				// Clear invalid credentials
				await removeAuthCookie();
				await removeUserCookie();
				await removeUserCanAccess();
				setUser(null);
				setCanAccess(null);
			} finally {
				setLoading(false);
			}
		}

		loadCookieData();
	}, [userCookie, userCanAccess]);

	const value = {
		signed: !!authCookie,
		user,
		userCanAccess,
		userCookie,
		can_access: canAccess,
		loading,
		Login,
		Logout,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};

export default AuthProvider;
