import { ShowToast } from '@/components/Toast';
import { api } from '@lib/api';

const deleteItem = (prev, itemId) => {
	const index = prev.findIndex(({ id }) => id === itemId);
	if (index !== -1) prev.splice(index, 1);

	return [...prev];
};

async function useDeleteFunc({ uri, itemId, setItems, onClose }) {
	try {
		const response = await api.delete(uri);
		setItems((prev) => deleteItem(prev, itemId));
		ShowToast(response);
	} catch (error) {
		ShowToast(error?.response);
	} finally {
		onClose();
	}
}

export { useDeleteFunc };
