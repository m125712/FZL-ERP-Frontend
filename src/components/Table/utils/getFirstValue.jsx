const getFirstValue = ({ getPreFilteredRowModel, id }) => {
	const res = getPreFilteredRowModel()
		.flatRows.find((row) => {
			const value = row.getValue(id);

			if (value !== null) {
				const type = typeof value;
				// console.log({
				// 	id,
				// 	value,
				// 	length: value?.length,
				// 	type: typeof value,
				// });

				switch (type) {
					case 'string':
						return value?.length > 0;
					case 'number':
						return true;
					default:
						return false;
				}
			}
		})
		?.getValue(id);

	return res;
};

export default getFirstValue;
