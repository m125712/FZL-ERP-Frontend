import { useCallback, useEffect } from 'react';
import { useWatch } from 'react-hook-form';

export function useVoucherEntries({
	watch,
	setValue,
	getValues,
	append,
	remove,
	voucherFields,
	setDeleteItem,
	control,
}) {
	// Calculate totals
	const totalCr = (watch('voucher_entry') || []).reduce((acc, curr) => {
		if (curr.type === 'cr') return acc + Number(curr.amount);
		return acc;
	}, 0);

	const totalDr = (watch('voucher_entry') || []).reduce((acc, curr) => {
		if (curr.type === 'dr') return acc + Number(curr.amount);
		return acc;
	}, 0);

	// Watch voucher entries for changes
	const entries = useWatch({
		control,
		name: 'voucher_entry',
		defaultValue: [],
	});

	// Auto-set credit amount when debit amount changes
	useEffect(() => {
		if (!entries || entries.length < 2) return;

		// Find the first debit and first credit entry
		const debitEntry = entries.find((entry) => entry.type === 'dr');
		const creditEntry = entries.find((entry) => entry.type === 'cr');

		if (debitEntry && creditEntry) {
			const debitAmount = Number(debitEntry.amount) || 0;
			const creditAmount = Number(creditEntry.amount) || 0;

			// If debit amount is different from credit amount, auto-set credit amount
			if (debitAmount !== creditAmount && debitAmount > 0) {
				const debitIndex = entries.findIndex(
					(entry) => entry.type === 'dr'
				);
				const creditIndex = entries.findIndex(
					(entry) => entry.type === 'cr'
				);

				// Only update if this is the first time or if debit amount changed
				if (debitIndex !== -1 && creditIndex !== -1) {
					setValue(
						`voucher_entry[${creditIndex}].amount`,
						debitAmount
					);
				}
			}
		}
	}, [entries, setValue]);

	// Seeds the opposite entry amount
	const getSeedAmount = useCallback(
		(newType) => {
			const entries = watch('voucher_entry') || [];
			if (entries.length === 0) return 0;

			const crTotal = entries.reduce((acc, entry) => {
				if (entry.type === 'cr') return acc + Number(entry.amount);
				return acc;
			}, 0);

			const drTotal = entries.reduce((acc, entry) => {
				if (entry.type === 'dr') return acc + Number(entry.amount);
				return acc;
			}, 0);

			if (newType === 'cr' && drTotal > crTotal) return drTotal - crTotal;
			if (newType === 'dr' && crTotal > drTotal) return crTotal - drTotal;
			return 0;
		},
		[watch]
	);

	// Append handlers
	const appendDrEntry = useCallback(() => {
		append({
			uuid: undefined,
			index: voucherFields.length,
			type: 'dr',
			ledger_uuid: '',
			description: '',
			amount: getSeedAmount('dr'),
			voucher_entry_cost_center: [],
			voucher_entry_payment: [],
		});
	}, [append, getSeedAmount, voucherFields.length]);

	const appendCrEntry = useCallback(() => {
		append({
			uuid: undefined,
			index: voucherFields.length,
			type: 'cr',
			ledger_uuid: '',
			description: '',
			amount: getSeedAmount('cr'),
			voucher_entry_cost_center: [],
			voucher_entry_payment: [],
		});
	}, [append, getSeedAmount, voucherFields.length]);

	// Remove handler
	const handleVoucherRemove = useCallback(
		(index) => {
			const entryUuid = getValues(`voucher_entry[${index}].uuid`);
			if (entryUuid !== undefined) {
				setDeleteItem({
					itemId: entryUuid,
					itemName: getValues(`voucher_entry[${index}].description`),
				});
				window['voucher_entry_delete'].showModal();
			}
			remove(index);
		},
		[getValues, remove, setDeleteItem]
	);

	// Type change handler
	const handleTypeChange = useCallback(
		(index, newType, onChange) => {
			onChange(newType);
			if (newType === 'cr') {
				setValue(
					`voucher_entry[${index}].voucher_entry_cost_center`,
					[]
				);
			} else if (newType === 'dr') {
				setValue(`voucher_entry[${index}].voucher_entry_payment`, []);
			}
			setValue(`voucher_entry[${index}].amount`, 0);
		},
		[setValue]
	);

	return {
		totalCr,
		totalDr,
		getSeedAmount,
		appendDrEntry,
		appendCrEntry,
		handleVoucherRemove,
		handleTypeChange,
	};
}
