import { ShowToast } from '@/components/Toast';
import { defaultFetch } from '@/hooks';
import { api } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export default function createGlobalState({ queryKey, url }) {
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
			const response = await api.post(url, newData);
			return response.data;
		},
		onMutate: async ({ newData }) => {
			await queryClient.cancelQueries({ queryKey });

			queryClient.setQueryData(queryKey, ({ data }) => [
				newData,
				...data,
			]);

			return { newData };
		},
		onSuccess: (data, variables, context) => {
			queryClient.setQueryData(queryKey, ({ data }) =>
				data?.map((val) =>
					val.uuid === context.newData.uuid ? data : val
				)
			);

			ShowToast(data?.toast);
		},
		onError: (error, newUser, context) => {
			queryClient.setQueryData(queryKey, ({ data }) =>
			data?.filter((val) => val.id !== context.newData.uuid)
			);

			ShowToast(error?.response?.data?.toast);
		},
		onSettled: (data, error, variables, context) => {
			queryClient.invalidateQueries({ queryKey });
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
			ShowToast(data?.toast);
		},
		onError: (error, variables, context) => {
			queryClient.setQueryData(queryKey, context.previousData);
			console.log(error);

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
			ShowToast(error?.response?.data?.toast);
		},
		onSettled: (data, error, variables, context) => {
			queryClient.invalidateQueries({ queryKey });
			variables.onClose();
		},
	});

	return {
		url,
		data: data?.data,
		toast: data?.toast,
		isLoading,
		isError,
		updateData,
		postData,
		deleteData,
	};
}
