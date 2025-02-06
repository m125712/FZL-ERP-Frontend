//* Model 1: Linear + sqrt : a *x + b * sqrt(x)
function calculateExtraModel1({ item_name, quantity }) {
	const item = item_name?.toLowerCase();
	const params = {
		nylon: { a: 0.01, b: 1.2 },
		vislon: { a: 0.02, b: 2.0 },
		metal: { a: 0.008, b: 1.2 },
	};

	return Math.ceil(
		params[item]?.a * quantity + params[item]?.b * Math.sqrt(quantity) || 0
	);
}

//* Model 2: Power-law: k * x^m
function calculateExtraModel2({ item_name, quantity }) {
	const item = item_name?.toLowerCase();
	const params = {
		nylon: { k: 0.5, m: 0.65 },
		vislon: { k: 0.58, m: 0.65 },
		metal: { k: 0.5, m: 0.65 },
	};

	return Math.ceil(
		params[item]?.k * Math.pow(quantity, params[item]?.m) || 0
	);
}

export const getRequiredTapeKg = ({
	row,
	type = 'raw',
	input_quantity = null,
}) => {
	const {
		item_name,
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
		const quantity = input_quantity !== null ? input_quantity : size;

		total_size_in_mtr = parseFloat(quantity); // * the size is given in MTR
	} else {
		const quantity =
			input_quantity !== null ? input_quantity : order_quantity;
		const extra =
			quantity < 1000
				? calculateExtraModel1({ item_name, quantity })
				: calculateExtraModel2({ item_name, quantity });

		const top_bottom = parseFloat(top) + parseFloat(bottom);

		let total_size = 0;

		if (isInch) {
			total_size = top_bottom + parseFloat(size) * 2.54;
		} else {
			total_size = top_bottom + parseFloat(size);
		}

		total_size_in_mtr = (total_size * parseFloat(quantity + extra)) / 100;
	}

	return total_size_in_mtr / parseFloat(mtr_per_kg);
};
