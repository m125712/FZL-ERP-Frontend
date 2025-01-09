export const getRequiredTapeKg = ({
	row,
	type = 'raw',
	input_quantity = null,
}) => {
	const {
		top,
		bottom,
		size,
		raw_mtr_per_kg,
		dyed_mtr_per_kg,
		order_quantity,
		order_type,
		unit,
	} = row;

	const isInch = unit?.toLowerCase() === 'inch';
	const mtr_per_kg = type === 'raw' ? raw_mtr_per_kg : dyed_mtr_per_kg;

	let total_size_in_mtr = 0;

	if (order_type === 'tape') {
		const give = input_quantity !== null ? input_quantity : size;

		total_size_in_mtr = parseFloat(give); // * the size is given in MTR
	} else {
		const give = input_quantity !== null ? input_quantity : order_quantity;
		const top_bottom = parseFloat(top) + parseFloat(bottom);
		let total_size = 0;

		if (isInch) {
			total_size = top_bottom + parseFloat(size) * 2.54;
		} else {
			total_size = top_bottom + parseFloat(size);
		}

		total_size_in_mtr = (total_size * parseFloat(give)) / 100;
	}

	return total_size_in_mtr / parseFloat(mtr_per_kg);
};
