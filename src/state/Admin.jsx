import createGlobalState from '@/state';

import { adminQK } from './QueryKeys';

// * User
export const useAdminUsers = () =>
	createGlobalState({
		queryKey: adminQK.users(),
		url: '/hr/user',
	});
export const useAdminUsersByUUID = (uuid) =>
	createGlobalState({
		queryKey: adminQK.userByUUID(uuid),
		url: `/hr/user/${uuid}`,
	});

export const useGetUserAccessByUUID = (uuid) =>
	createGlobalState({
		queryKey: adminQK.userAccessByUUID(uuid),
		url: `/hr/user/can-access/${uuid}`,
	});
// * Department
export const useAdminDepartments = () =>
	createGlobalState({
		queryKey: adminQK.departments(),
		url: '/hr/department',
	});

export const useAdminDesignationByUUID = (uuid) =>
	createGlobalState({
		queryKey: adminQK.designation(uuid),
		url: `/hr/designation/${uuid}`,
	});

// * Designation
export const useAdminDesignations = () =>
	createGlobalState({
		queryKey: adminQK.designations(),
		url: '/hr/designation',
	});

export const useAdminDepartmentsByUUID = (uuid) =>
	createGlobalState({
		queryKey: adminQK.department(uuid),
		url: `/hr/department/${uuid}`,
	});

//* Permission
export const useAdminPermissions = () =>
	createGlobalState({
		queryKey: adminQK.permissions(),
		url: '/hr/user-all-can-access',
	});

//* Global Log
export const useAdminGlobalLog = (schema, table, operation, from, to) =>
	createGlobalState({
		queryKey: adminQK.globalLog(schema, table, operation, from, to),
		url: `/audit/global-audit-log?schema_name=${schema}&table_name=${table}&operation=${operation}&from_date=${from}&to_date=${to}`,
	});
