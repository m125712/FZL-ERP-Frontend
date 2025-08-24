import { useCallback } from 'react';
import { useFieldArray } from 'react-hook-form';

export const useVoucherEntries = (control) => {
	const { fields, append, remove, replace } = useFieldArray({
		control,
		name: 'voucher_entry',
		keyName: 'id',
	});

	const appendDrEntry = useCallback(() => {
		append({
			type: 'dr',
			description: '',
			amount: 0,
			voucher_entry_cost_center: [],
			voucher_entry_payment: [],
		});
	}, [append]);

	const appendCrEntry = useCallback(() => {
		append({
			type: 'cr',
			description: '',
			amount: 0,
			voucher_entry_cost_center: [],
			voucher_entry_payment: [],
		});
	}, [append]);

	return {
		fields,
		append,
		remove,
		replace,
		appendDrEntry,
		appendCrEntry,
	};
};
