import createGlobalState from '.';
import { maintenanceQK } from './QueryKeys';

// * Info
export const useMaintenanceMachine = () =>
	createGlobalState({
		queryKey: maintenanceQK.machine(),
		url: `/maintain/section-machine`,
	});

export const useMaintenanceMachineByUUID = (uuid) =>
	createGlobalState({
		queryKey: maintenanceQK.machineByUUID(uuid),
		url: `/maintain/section-machine/${uuid}`,
	});
