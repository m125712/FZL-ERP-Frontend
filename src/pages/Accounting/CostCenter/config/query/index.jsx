import createGlobalState from '@/state';

import { accQK } from './QueryKeys';

//Count-length
export const useThreadCountLength = () =>
	createGlobalState({
		queryKey: accQK.countLength(),
		url: '/thread/count-length',
	});

export const useThreadCountLengthByUUID = (uuid) =>
	createGlobalState({
		queryKey: accQK.countLengthByUUID(uuid),
		url: `/thread/count-length/${uuid}`,
	});
