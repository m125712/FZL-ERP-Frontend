import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useRHF } from '@/hooks';

import { normalizeVoucher } from '../../utils';

export function useVoucherForm({
	schema,
	nullableDefaults,
	currencyOptions,
	isCurrencyLoading,
	data,
	isDataLoading,
}) {
	const defaultValue = useMemo(() => {
		return {
			...nullableDefaults,
			currency_uuid: isCurrencyLoading
				? undefined
				: currencyOptions?.find((c) => c.default).value,
			conversion_rate: isCurrencyLoading
				? undefined
				: currencyOptions?.find((c) => c.default)?.conversion_rate,
		};
	}, [isCurrencyLoading, currencyOptions, nullableDefaults]);

	const form = useRHF(schema, defaultValue);
	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		Controller,
		useFieldArray,
		getValues,
		watch,
		setValue,
		setError,
		context: formContext,
	} = form;

	const {
		fields: voucherFields,
		append,
		remove,
		replace,
	} = useFieldArray({ control, name: 'voucher_entry', keyName: 'id' });

	const prevRef = useRef({});

	useEffect(() => {
		if (!isCurrencyLoading && currencyOptions) {
			const updatedDefaults = {
				...nullableDefaults,
				currency_uuid: isCurrencyLoading
					? undefined
					: currencyOptions?.find((c) => c.default).value,
				conversion_rate: currencyOptions.find((c) => c.default)
					?.conversion_rate,
			};
			reset(updatedDefaults);
		}
	}, [isCurrencyLoading, currencyOptions, reset, nullableDefaults]);

	useEffect(() => {
		if (!isDataLoading && data) {
			const normalized = normalizeVoucher(data, nullableDefaults);
			reset(normalized, { keepDefaultValues: false });
			replace(normalized.voucher_entry || []);

			// Initialize prevRef
			normalized.voucher_entry.forEach((entry, idx) => {
				prevRef.current[idx] = {
					ledger_uuid: entry.ledger_uuid,
					type: entry.type,
				};
			});
		}
	}, [data, isDataLoading, reset, replace, nullableDefaults]);

	const resetWithArraySync = useCallback(
		(val) => {
			const normalized = normalizeVoucher(val);
			reset(normalized, { keepDefaultValues: false });
			replace(normalized?.voucher_entry || []);
		},
		[reset, replace]
	);

	return {
		// Form methods
		register,
		handleSubmit,
		errors,
		reset: resetWithArraySync,
		control,
		Controller,
		getValues,
		watch,
		setValue,
		setError,
		context: formContext,

		// Field array
		voucherFields,
		append,
		remove,
		replace,

		// Refs
		prevRef,
	};
}
