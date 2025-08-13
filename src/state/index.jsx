import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { defaultFetch } from '@/hooks';

import { ShowToast } from '@/components/Toast';

import { api, image_api } from '@/lib/api';

export default function createGlobalState({
	queryKey,
	url,
	refetchOnWindowFocus = true,
	enabled = true,
}) {
	const queryClient = useQueryClient();

	const { data, isError, isLoading, isPending, refetch, isFetching, status } =
		useQuery({
			queryKey: [...queryKey, { url }],
			queryFn: () => defaultFetch(url),
			refetchInterval: false,
			refetchOnMount: false,
			refetchOnReconnect: false,
			refetchIntervalInBackground: false,
			refetchOnWindowFocus,
			enabled,
		});

	const postData = useMutation({
		mutationFn: async ({ url, newData }) => {
			const response = await api.post(url, newData);
			return response.data;
		},
		onMutate: async ({ newData }) => {
			await queryClient.cancelQueries({ queryKey });

			return { newData };
		},
		onSuccess: (data) => {
			ShowToast(data?.toast);
		},
		onError: (error, newUser, context) => {
			queryClient.setQueryData(queryKey, ({ data }) =>
				data?.filter((val) => val.id !== context.newData.uuid)
			);

			console.error(error);

			ShowToast(error?.response?.data?.toast);
		},
		onSettled: (data, error, variables) => {
			queryClient.invalidateQueries({ queryKey });
			if (variables?.isOnCloseNeeded !== false) {
				variables?.onClose();
			}
		},
	});

	const imagePostData = useMutation({
		mutationFn: async ({ url, newData }) => {
			const response = await image_api.post(url, newData);
			return response?.data;
		},
		onMutate: async ({ newData }) => {
			await queryClient.cancelQueries({ queryKey });
			return { newData };
		},

		onSuccess: (data) => {
			ShowToast(data?.toast);
		},

		onError: (error, context) => {
			queryClient.setQueryData(queryKey, ({ data }) =>
				data?.filter((item) => item.id !== context?.newData?.uuid)
			);
			console.error(error);
			ShowToast(error?.response?.data?.toast);
		},

		onSettled: (data, error, variables) => {
			queryClient.invalidateQueries({ queryKey });

			if (variables?.isOnCloseNeeded !== false) {
				variables?.onClose?.();
			}
		},
	});

	const updateData = useMutation({
		mutationFn: async ({ url, updatedData }) => {
			const response = await api.put(url, updatedData);

			return response.data;
		},
		onMutate: async () => {
			await queryClient.cancelQueries(queryKey);
			const previousData = queryClient.getQueryData(queryKey);

			return { previousData: previousData };
		},
		onSuccess: (data) => {
			ShowToast(data?.toast);
		},
		onError: (error, variables, context) => {
			queryClient.setQueryData(queryKey, context.previousData);

			console.log(error);

			ShowToast(error?.response?.data?.toast);
		},
		onSettled: (data, error, variables) => {
			queryClient.invalidateQueries(queryKey);

			if (variables?.isOnCloseNeeded !== false) {
				variables?.onClose();
			}
		},
	});

	const imageUpdateData = useMutation({
		mutationFn: async ({ url, updatedData }) => {
			const response = await image_api.patch(url, updatedData);
			return response.data;
		},
		onMutate: async () => {
			await queryClient.cancelQueries({
				queryKey,
			});
			const previousData = queryClient.getQueryData(queryKey);
			return { previousData: previousData };
		},
		onSuccess: (data) => {
			ShowToast(data?.toast);
		},
		onError: (error, variables, context) => {
			queryClient.setQueryData(queryKey, context.previousData);
			console.log(error);
			ShowToast(error?.response?.data?.toast);
		},

		onSettled: (data, error, variables) => {
			queryClient.invalidateQueries({ queryKey });
			if (variables?.isOnCloseNeeded !== false) {
				variables?.onClose?.();
			}
		},
	});

	const deleteData = useMutation({
		mutationFn: async ({ url }) => {
			const response = await api.delete(url);
			return response.data;
		},
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey });
		},
		onSuccess: (data) => {
			ShowToast(data?.toast);
		},
		onError: (error) => {
			console.log(error);
			ShowToast(error?.response?.data?.toast);
		},
		onSettled: (data, error, variables) => {
			queryClient.invalidateQueries({ queryKey });
			if (variables?.isOnCloseNeeded !== false) {
				variables?.onClose();
			}
		},
	});

	return {
		url,
		// * Data
		data: data?.data,
		originalData: data,
		toast: data?.toast,
		// * States
		isLoading,
		isError,
		isPending,
		isFetching,
		status,
		// * Mutations
		updateData,
		postData,
		imagePostData,
		imageUpdateData,
		deleteData,
		// * Refetch
		refetch,
		invalidateQuery: () => queryClient.invalidateQueries({ queryKey }),
	};
}
