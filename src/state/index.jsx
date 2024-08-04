// import { ShowToast } from "@/components/Toast";
// import { defaultFetch } from "@/hooks";
// import { api } from "@/lib/api";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { deleteItem, updateItem } from "./utils";

// export default function createGlobalState({ queryKey, url }) {
// 	const queryClient = useQueryClient();

// 	const { data, isError, isLoading } = useQuery({
// 		queryKey: queryKey,
// 		queryFn: () => defaultFetch(url),
// 		refetchInterval: false,
// 		refetchOnMount: false,
// 		refetchOnWindowFocus: false,
// 		refetchOnReconnect: false,
// 		refetchIntervalInBackground: false,
// 	});

// 	async function postData({ url, newData, onClose }) {
// 		return useMutation({
// 			mutationFn: async () => {
// 				const response = await api.post(url, newData);
// 				return response.data;
// 			},
// 			onMutate: async () => {
// 				await queryClient.cancelQueries({ queryKey });
// 			},
// 			onSuccess: (response) => ShowToast(response),
// 			onError: (err, newUser, context) => {
// 				queryClient.setQueryData(queryKey, context.previousUsers);
// 			},
// 			onSettled: () => {
// 				queryClient.invalidateQueries({ queryKey });
// 				onClose();
// 			},
// 		});
// 	}

// 	async function updateData({ url, id, updatedData, onClose }) {
// 		// * https://react-query.tanstack.com/guides/optimistic-updates#updating-a-single-todo
// 		return useMutation({
// 			mutationFn: async () => {
// 				const response = await api.put(url, updatedData);
// 				return response;
// 			},
// 			onMutate: async (updatedData) => {
// 				await queryClient.cancelQueries(queryKey);
// 				const previousUser = queryClient.getQueryData(queryKey);

// 				queryClient.setQueryData(
// 					queryKey,
// 					updateItem(id, data, updatedData)
// 				);

// 				return { previousUser: previousUser, updatedData: updatedData };
// 			},
// 			onSuccess: (response) => ShowToast(response),
// 			onError: (err, updatedData, context) => {
// 				queryClient.setQueryData(queryKey, context.previousUser);
// 				ShowToast(err?.response);
// 			},
// 			onSettled: () => {
// 				queryClient.invalidateQueries(queryKey); // userQueryKeys.all
// 				onClose();
// 			},
// 		});
// 	}

// 	async function deleteData(url, onClose) {
// 		return useMutation({
// 			mutationFn: async () => {
// 				const response = await api.delete(url);
// 				return response;
// 			},
// 			onMutate: async () => {
// 				await queryClient.cancelQueries({
// 					queryKey,
// 				});
// 			},
// 			onSuccess: (response) => ShowToast(response),
// 			onError: (error) => {
// 				queryClient.invalidateQueries({ queryKey });
// 				ShowToast(error?.response);
// 			},
// 			onSettled: () => {
// 				queryClient.invalidateQueries({ queryKey });
// 				onClose();
// 			},
// 		});
// 	}

// 	return { data, isLoading, isError, updateData, postData, deleteData };
// }

import { ShowToast } from '@/components/Toast';
import { defaultFetch } from '@/hooks';
import { api } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteItemByUUID, updateItemByID, updateItemByUUID } from './utils';

export async function postData({ queryKey, url, newData, onClose }) {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async () => {
			const response = await api.post(url, newData);
			return response.data;
		},
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey });
		},
		onSuccess: (response) => ShowToast(response),
		onError: (error, variables, context) => {
			queryClient.setQueryData(queryKey, context.previousUsers);
		},
		onSettled: (data, error, variables, context) => {
			queryClient.invalidateQueries({ queryKey });
			onClose();
		},
	});

	return mutation;
}

export function usePostData(queryKey) {
	const queryClient = useQueryClient();

	const postData = useMutation({
		mutationFn: async ({ url, newData }) => {
			const response = await api.post(url, newData);
			return response.data;
		},
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey });
		},
		onSuccess: (data, variables, context) => {
			ShowToast(data);
		},
		onError: (err, newUser, context) => {
			queryClient.setQueryData(queryKey, context.previousUsers);
		},
		onSettled: (data, error, variables, context) => {
			queryClient.invalidateQueries({ queryKey });
			variables.onClose();
		},
	});

	return postData;
}

export default function useGlobalState({ queryKey, url }) {
	const queryClient = useQueryClient();

	const { data, isError, isLoading } = useQuery({
		queryKey: queryKey,
		queryFn: () => defaultFetch(url),
		refetchInterval: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchIntervalInBackground: false,
	});

	const postData = useMutation({
		mutationFn: async ({ url, newData }) => {
			console.log('postData -> newData', newData);
			
			const response = await api.post(url, newData);
			return response.data;
		},
		onMutate: async ({ newData }) => {
			await queryClient.cancelQueries({ queryKey });

			queryClient.setQueryData(queryKey, (old) => [...old, newData]);

			return { newData };
		},
		onSuccess: (data, variables, context) => {
			queryClient.setQueryData(queryKey, (old) =>
				old.map((val) =>
					val.uuid === context.newData.uuid ? data : val
				)
			);
			ShowToast(data?.toast);
		},
		onError: (error, newUser, context) => {
			queryClient.setQueryData(queryKey, (old) =>
				old.filter((val) => val.id !== context.newData.uuid)
			);
		},
		onSettled: (data, error, variables, context) => {
			// queryClient.invalidateQueries({ queryKey });
			variables.onClose();
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
		onSuccess: (data, variables, context) => {
			queryClient.setQueryData(
				queryKey,
				updateItemByUUID(variables.uuid, data, variables.updatedData)
			);

			ShowToast(data?.toast);
		},
		onError: (error, variables, context) => {
			queryClient.setQueryData(queryKey, context.previousData);
			ShowToast(error?.response);
		},
		onSettled: (data, error, variables, context) => {
			queryClient.invalidateQueries(queryKey);
			variables.onClose();
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
		onSuccess: (data, variables, context) => {
			ShowToast(data?.toast);
		},
		onError: (error, variables, context) => {
			queryClient.invalidateQueries({ queryKey });
			ShowToast(error?.response);
		},
		onSettled: (data, error, variables, context) => {
			queryClient.invalidateQueries({ queryKey });
			variables.onClose();
		},
	});

	return {
		data: data?.data,
		toast: data?.toast,
		isLoading,
		isError,
		updateData,
		postData,
		deleteData,
	};
}
