import useAsync from './CRUD/useAsync';
import { useDeleteFunc } from './CRUD/useDelete';
import {
	defaultFetch,
	useFetch,
	useFetchForRhfReset,
	useFetchForRhfResetForOrder,
	useFetchForRhfResetForPlanning,
	useFetchForRhfResetForUserAccess,
	useFetchFunc,
	useFetchFuncForReport,
} from './CRUD/useFetch';
import { usePostFunc } from './CRUD/usePost';
import { usePostImage } from './CRUD/usePostImage';
import { useUpdateFunc } from './CRUD/useUpdate';
import useAccess from './Storage/useAccess';
import useCookie from './Storage/useCookie';
import { useHaveAccess } from './Storage/useHaveAccess';
import { useLocalStorage, useSessionStorage } from './Storage/useStorage';
import { useToken } from './Storage/useToken';
import useRHF from './useRHF';

export {
	defaultFetch,
	useAccess,
	useAsync,
	useCookie,
	useDeleteFunc,
	useFetch,
	useFetchForRhfReset,
	useFetchForRhfResetForOrder,
	useFetchForRhfResetForPlanning,
	useFetchForRhfResetForUserAccess,
	useFetchFunc,
	useFetchFuncForReport,
	useHaveAccess,
	useLocalStorage,
	usePostFunc,
	usePostImage,
	useRHF,
	useSessionStorage,
	useToken,
	useUpdateFunc,
};
