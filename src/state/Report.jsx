import createGlobalState from '.';
import { reportQK } from './QueryKeys';

export const useZipperProduction = () =>
	createGlobalState({
		queryKey: reportQK.zipperProduction(),
		url: '/report/zipper-production-status-report',
	});

export const useDailyChallan = () =>
    createGlobalState({
        queryKey: reportQK.dailyChallan(),
        url: '/report/daily-challan-report',
    })

export const usePIRegister = () =>
    createGlobalState({
        queryKey: reportQK.piRegister(),
        url: '/report/pi-register-report',
    })