import { ShowToast } from '@/components/Toast';
import { image_api } from '@/lib/api';

const postItem = (prev, data, id) => {
	return [
		{
			...data,
			id,
		},
		...prev,
	];
};

async function usePostImage({
	uri,
	data,
	setItems = () => {},
	onClose = () => {},
}) {
	try {
		const response = await image_api.post(uri, data);
		const { id } = response?.data;

		setItems((prev) => postItem(prev, data, id));
		ShowToast(response);
	} finally {
		onClose();
	}
}

export { usePostImage };
