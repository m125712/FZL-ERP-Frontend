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
