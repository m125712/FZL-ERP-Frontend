import { ShowToast } from "@/components/Toast";
import { defaultFetch } from "@/hooks";
import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteItem, updateItem } from "./utils";

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

	async function postData(newData) {
		await api
			.post(url, newData)
			.then((response) => {
				queryClient.setQueryData(queryKey, [response?.data, ...data]);
				ShowToast(response);
			})
			.catch((error) => ShowToast(error?.response))
			.finally(() => onClose());
	}

	async function updateData(id, updatedData) {
		await api
			.post(uri, updatedData)
			.then((response) => {
				queryClient.setQueryData(
					queryKey,
					updateItem(id, data, updatedData)
				);
				ShowToast(response);
			})
			.catch((error) => ShowToast(error?.response))
			.finally(() => onClose());
	}

	async function deleteData(url) {
		return useMutation({
			mutationFn: async () => {
				const response = await api.delete(url);
				return response;
			},
			onMutate: async () => {
				await queryClient.cancelQueries({
					queryKey,
				});
			},
			onSuccess: (response) => ShowToast(response),
			onError: (error) => {
				queryClient.invalidateQueries({ queryKey });
				ShowToast(error?.response);
			},
			onSettled: () => {
				queryClient.invalidateQueries({ queryKey });
				onClose();
			},
		});
	}
}
