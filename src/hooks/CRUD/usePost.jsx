import { ShowToast } from '@/components/Toast';
import { api } from '@lib/api';

const postItem = (prev, data, id) => {
	return [
		{
			...data,
			id,
		},
		...prev,
	];
};

async function usePostFunc({
	uri,
	data,
	setItems = () => {},
	onClose = () => {},
}) {
	try {
		const response = await api.post(uri, data);
		const { id } = response?.data;

		setItems((prev) => postItem(prev, data, id));
		ShowToast(response);
	} catch (error) {
		ShowToast(error?.response);
	} finally {
		onClose();
	}
}

export { usePostFunc };
