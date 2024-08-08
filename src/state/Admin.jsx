import { api } from '@/lib/api';
import createGlobalState from '@/state';
import { useEffect } from 'react';
import { adminQK } from './QueryKeys';

export const useAdminUsers = () =>
	createGlobalState({
		queryKey: adminQK.users(),
		url: '/hr/user',
	});

export const useOrderBuyerByUUID = (uuid) =>
	createGlobalState({
		queryKey: orderQK.buyer(uuid),
		url: `/public/buyer/${uuid}`,
	});

// * Department
export const useAdminDepartments = () =>
	createGlobalState({
		queryKey: adminQK.departments(),
		url: '/hr/department',
	});
