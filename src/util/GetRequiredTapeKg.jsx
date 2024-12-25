export const getRequiredTapeKg = ({ row, type = 'raw' }) => {
	const {
		top,
		bottom,
		size,
		raw_mtr_per_kg,
		dyed_mtr_per_kg,
		order_quantity,
	} = row;

	const mtr_per_kg = type === 'raw' ? raw_mtr_per_kg : dyed_mtr_per_kg;

	const top_bottom_size =
		parseFloat(top) + parseFloat(bottom) + parseFloat(size);

	const total_size_in_mtr =
		(top_bottom_size * parseFloat(order_quantity)) / 100;

	return total_size_in_mtr / parseFloat(mtr_per_kg);
};
