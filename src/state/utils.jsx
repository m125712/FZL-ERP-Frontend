export const updateItemByID = (itemId, data, updatedData) => {
	const index = data?.findIndex(({ id }) => id === itemId);
	console.log(index);

	if (index !== -1) {
		data[index] = {
			...data[index],
			...updatedData,
		};
		console.log('updateItemByID: ', data[index]);
	}

	return data;
};

export const updateItemByUUID = (itemUUID, data, updatedData) => {
	const index = data?.findIndex(({ uuid }) => uuid === itemUUID);
	console.log(index);

	if (index !== -1) {
		data[index] = {
			...data[index],
			...updatedData,
		};
		console.log('updateItemByUUID: ', data[index]);
	}

	return data;
};

export const deleteItemByID = (data, itemId) => {
	const index = data.findIndex(({ id }) => id === itemId);
	if (index !== -1) data.splice(index, 1);

	return [...data];
};

export const deleteItemByUUID = (data, itemUUID) => {
	const index = data.findIndex(({ uuid }) => uuid === itemUUID);
	if (index !== -1) data.splice(index, 1);

	return [...data];
};
