import { createContext, use, useCallback, useMemo } from 'react';
import { useCookie, useLocalStorage } from '@/hooks';

import { ShowToast } from '@/components/Toast';

import { api } from '@/lib/api';

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
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

			const { token, user: loginUser, can_access } = res.data;

			await updateAuthCookie(`Bearer ` + token || '');
			await updateUserCookie(JSON.stringify(loginUser) || '');
			await updateUserCanAccess(can_access || '');

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
	}, [removeAuthCookie, removeUserCanAccess, removeUserCookie]);

	const value = useMemo(
		() => ({
			signed: !!userCookie,
			user: userCookie ? JSON?.parse(userCookie) : null,
			can_access: userCanAccess,
			Login,
			Logout,
		}),
		[userCanAccess, userCookie]
	);

	return <AuthContext value={value}>{children}</AuthContext>;
};

export const useAuth = () => use(AuthContext);

export default AuthProvider;
