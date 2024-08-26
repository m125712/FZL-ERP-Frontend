import createGlobalState from '.';
import { threadQK } from './QueryKeys';

//Count-length
export const useThreadCountLength = () =>
	createGlobalState({
		queryKey: threadQK.countLength(),
		url: '/thread/count-length',
	});

export const useThreadCountLengthByUUID = (uuid) =>
	createGlobalState({
		queryKey: threadQK.countLengthByUUID(uuid),
		url: `/thread/count-length/${uuid}`,
	});
//Machine
export const useThreadMachine = () =>
	createGlobalState({
		queryKey: threadQK.machine(),
		url: '/thread/machine',
	});

export const useThreadMachineByUUID = (uuid) =>
	createGlobalState({
		queryKey: threadQK.machineByUUID(uuid),
		url: `/thread/machine/${uuid}`,
	});

//Order-info
export const useThreadOrderInfo = () =>
	createGlobalState({
		queryKey: threadQK.orderInfo(),
		url: '/thread/order-info',
	});
export const useThreadOrderInfoByUUID = (uuid) =>
	createGlobalState({
		queryKey: threadQK.orderInfoByUUID(uuid),
		url: `/thread/order-info/${uuid}`,
	});
//Order-info-entry
export const useThreadOrderInfoEntry = () =>
	createGlobalState({
		queryKey: threadQK.orderInfoEntry(),
		url: '/thread/order-entry',
	});
export const useThreadOrderInfoEntryByUUID = (uuid) =>
	createGlobalState({
		queryKey: threadQK.orderInfoEntryByUUID(uuid),
		url: `/thread/order-entry/${uuid}`,
	});
