export const updateItem = (itemId, data, updatedData) => {
	const index = data?.findIndex(({ id }) => id === itemId);

	if (index !== -1) {
		data[index] = {
			...data[index],
			...updatedData,
		};
		return [...data];
	}

	return data;
};

export const deleteItem = (data, itemId) => {
	const index = data.findIndex(({ id }) => id === itemId);
	if (index !== -1) data.splice(index, 1);

	return [...data];
};
