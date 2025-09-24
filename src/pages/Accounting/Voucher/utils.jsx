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

	const normalizedEntries = entries.map((e, index) => {
		// Normalize nested cost centers
		const costCenters = Array.isArray(e?.voucher_entry_cost_center)
			? e.voucher_entry_cost_center.map((cc, ccIndex) => ({
					...cc,
					index: cc?.index ?? ccIndex,
					// Ensure required fields have defaults
					cost_center_uuid: cc?.cost_center_uuid || '',
					invoice_no: cc?.invoice_no || '',
					amount: Number(cc?.amount) || 0,
				}))
			: [];

		// Normalize nested payments
		const payments = Array.isArray(e?.voucher_entry_payment)
			? e.voucher_entry_payment.map((payment, paymentIndex) => ({
					...payment,
					index: payment?.index ?? paymentIndex,
					// Ensure required fields have defaults
					payment_type: payment?.payment_type || '',
					trx_no: payment?.trx_no || '',
					date: payment?.date || null,
					amount: Number(payment?.amount) || 0,
				}))
			: [];

		// Create entry_order if it doesn't exist
		let entryOrder = [];
		if (Array.isArray(e?.entry_order)) {
			entryOrder = e.entry_order;
		} else {
			// Generate entry_order based on existing data
			costCenters.forEach((item, ccIndex) => {
				entryOrder.push({
					type: 'costCenter',
					index: ccIndex,
					uuid: item.uuid,
					cost_center_name: item.cost_center_name,
				});
			});
			payments.forEach((item, paymentIndex) => {
				entryOrder.push({
					type: 'payment',
					index: paymentIndex,
					uuid: item.uuid,
					payment_type: item?.payment_type,
					trx_no: item?.trx_no,
				});
			});
		}

		return {
			...e,
			index: e?.index ?? index,
			// Ensure required fields have defaults
			ledger_uuid: e?.ledger_uuid || '',
			amount: Number(e?.amount) || 0,
			type: e?.type || 'dr',
			// Normalized nested arrays
			voucher_entry_cost_center: costCenters,
			voucher_entry_payment: payments,
			entry_order: entryOrder,
		};
	});

	return {
		...v,
		// Ensure top-level required fields have defaults
		date: v?.date || new Date().toISOString().split('T')[0],
		category: v?.category || '',
		vat_deduction: Number(v?.vat_deduction) || 0,
		tax_deduction: Number(v?.tax_deduction) || 0,
		currency_uuid: v?.currency_uuid || '',
		conversion_rate: Number(v?.conversion_rate) || 1,
		remarks: v?.remarks || '',
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

export const transformApiDataToFormData = (apiData) => {
	return {
		...apiData,
		voucher_entry:
			apiData.voucher_entry?.map((entry) => ({
				...entry,
				// Ensure nested arrays are always arrays, never null
				voucher_entry_cost_center:
					entry.voucher_entry_cost_center || [],
				voucher_entry_payment: entry.voucher_entry_payment || [],
				// Add entry_order if it doesn't exist
				entry_order: entry.entry_order || [],
			})) || [],
	};
};
