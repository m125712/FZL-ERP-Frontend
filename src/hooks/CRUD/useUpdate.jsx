import { ShowToast } from '@/components/Toast';
import { api } from '@lib/api';

const updateItem = ({ prev, itemId, data, updatedData }) => {
	const index = prev.findIndex((item) => item.id === itemId);
	if (index !== -1) {
		prev[index] = {
			...data,
			...updatedData,
		};
	}
	return [...prev];
};

async function useUpdateFunc({
	uri,
	data,
	itemId,
	updatedData,
	setItems = () => {},
	onClose = () => {},
}) {
	try {
		const response = await api.post(uri, updatedData);
		setItems((prev) => updateItem({ prev, itemId, data, updatedData }));
		ShowToast(response);
	} catch (error) {
		ShowToast(error?.response);
	} finally {
		onClose();
	}
}

export { useUpdateFunc };
