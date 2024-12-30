import createGlobalState from '.';
import { planningQK } from './QueryKeys';

export const usePlanningDateWiseBatchReport = (date = '', item = '') =>
	createGlobalState({
		queryKey: planningQK.dateWiseBatchReport(date, item),
		url: `/zipper/daily-production-plan?date=${date}&item=${item}`,
		enabled: !!date,
	});
