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
