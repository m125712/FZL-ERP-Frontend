import numeral from 'numeral';

export const categoryOptions = [
	{ label: 'Contra', value: 'contra' },
	{ label: 'Payment', value: 'payment' },
	{ label: 'Receipt', value: 'receipt' },
	{ label: 'Journal', value: 'journal' },
	{ label: 'Sales', value: 'sales' },
	{ label: 'Purchase', value: 'purchase' },
	{ label: 'Others', value: 'others' },
];

export const paymentTypeOption = [
	{ label: 'RTGS', value: 'rtgs' },
	{ label: 'NPSB', value: 'npsb' },
	{ label: 'Cheque', value: 'cheque' },
	{ label: 'Cash', value: 'cash' },
	{ label: 'MFS', value: 'mfs' },
];

export const typeOptions = [
	{ value: 'dr', label: 'Dr' },
	{ value: 'cr', label: 'Cr' },
];
export function normalizeVoucher(v, defaults_value) {
	if (!v) return defaults_value;
	const entries = Array.isArray(v.voucher_entry) ? v.voucher_entry : [];
	const normalizedEntries = entries.map((e, index) => ({
		...e,
		index: e?.index ?? index,
		voucher_entry_cost_center: Array.isArray(e?.voucher_entry_cost_center)
			? e.voucher_entry_cost_center
			: [],
		voucher_entry_payment: Array.isArray(e?.voucher_entry_payment)
			? e.voucher_entry_payment
			: [],
	}));
	return {
		...v,
		voucher_entry: normalizedEntries,
	};
}
const GROUPING_RULES = {
	'৳': 'lakh', // Bangladeshi Taka
	'₹': 'lakh', // Indian Rupee
};

export function formatAmountSmart(value, symbol, decimals = 2) {
	if (value === null || value === undefined || value === '') return '';

	const num = typeof value === 'number' ? value : Number(value);
	if (!Number.isFinite(num)) return '';

	const groupingType = GROUPING_RULES[symbol] || 'western';

	if (groupingType === 'lakh') {
		return formatWithLakhGrouping(num, symbol, decimals);
	} else {
		// Use numeral for western grouping
		const fmt = decimals > 0 ? `0,0.${'0'.repeat(decimals)}` : '0,0';
		const core = numeral(num).format(fmt);
		return core;
	}
}

function formatWithLakhGrouping(num, symbol, decimals) {
	const fixed = num.toFixed(decimals);
	const [integerPart, decimalPart] = fixed.split('.');

	// Apply lakh/crore grouping
	const reversed = integerPart.split('').reverse();
	const grouped = [];

	for (let i = 0; i < reversed.length; i++) {
		if (i === 3 || (i > 3 && (i - 3) % 2 === 0)) {
			grouped.push(',');
		}
		grouped.push(reversed[i]);
	}

	const formattedInteger = grouped.reverse().join('');
	const result = decimalPart
		? `${formattedInteger}.${decimalPart}`
		: formattedInteger;
	return result;
}
