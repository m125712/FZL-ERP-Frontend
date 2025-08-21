// VoucherEntryRow.jsx - Updated to include narration logic
import React from 'react';

import { FormField, Input, ReactSelect, RemoveButton, Textarea } from '@/ui';

import { CostCentersField } from './CostCentersField';
import PaymentField from './PaymentField';

const VoucherEntryRow = React.memo(function VoucherEntryRow(props) {
	const {
		index,
		Controller,
		control,
		register,
		errors,
		watch,
		setValue,
		ledgerOptions,
		typeOptions,
		rowClass,
		onRemove,
		onTypeChange,
		isNarrationRow,
		totalDebit,
		totalCredit,
	} = props;

	const type = watch(`voucher_entry[${index}].type`);
	const selectedLedgerUuid = watch(`voucher_entry[${index}].ledger_uuid`);
	const selectedLedger = ledgerOptions?.find(
		(l) => l.value === selectedLedgerUuid
	);

	// If this is narration row, render totals
	if (isNarrationRow) {
		return (
			<tr className='border-t-2 border-gray-300 bg-gray-100'>
				<td className={`${rowClass} font-bold`}>
					<span className='font-bold text-gray-700'>Narration</span>
				</td>
				<td className={`${rowClass}`}></td>
				<td className={`${rowClass}`}></td>
				<td className={`${rowClass} text-right font-bold`}>
					{totalDebit.toFixed(2)}
				</td>
				<td className={`${rowClass} text-right font-bold`}>
					{totalCredit.toFixed(2)}
				</td>
				<td className={`${rowClass}`}></td>
			</tr>
		);
	}

	return (
		<>
			<tr>
				<td className={`w-6 ${rowClass}`}>{index + 1}</td>
				<td className={`w-24 ${rowClass}`}>
					<FormField
						label={`voucher_entry[${index}].type`}
						title='Type'
						is_title_needed='false'
						dynamicerror={errors?.voucher_entry?.[index]?.type}
					>
						<Controller
							name={`voucher_entry[${index}].type`}
							control={control}
							render={({ field: { onChange, value } }) => (
								<ReactSelect
									placeholder='Select Type'
									options={typeOptions}
									value={
										typeOptions.find(
											(inItem) => inItem.value === value
										) ?? null
									}
									onChange={(e) =>
										onTypeChange(index, e?.value, onChange)
									}
									menuPortalTarget={document.body}
								/>
							)}
						/>
					</FormField>
				</td>

				<td className={`w-64 ${rowClass}`}>
					<FormField
						label={`voucher_entry[${index}].ledger_uuid`}
						title='Ledger'
						is_title_needed='false'
						dynamicerror={
							errors?.voucher_entry?.[index]?.ledger_uuid
						}
					>
						<Controller
							name={`voucher_entry[${index}].ledger_uuid`}
							control={control}
							render={({ field: { onChange, value } }) => (
								<ReactSelect
									placeholder='Select Ledger'
									options={ledgerOptions}
									value={
										ledgerOptions.find(
											(o) => o.value === value
										) ?? null
									}
									onChange={(e) => onChange(e?.value)}
									menuPortalTarget={document.body}
								/>
							)}
						/>
					</FormField>
				</td>

				<td className={`w-48 ${rowClass}`}>
					<Textarea
						title='Description'
						label={`voucher_entry[${index}].description`}
						is_title_needed='false'
						dynamicerror={
							errors?.voucher_entry?.[index]?.description
						}
						register={register}
					/>
				</td>

				<td className={`w-48 ${rowClass} pl-`}>
					{type === 'dr' && (
						<Input
							title='Debit'
							label={`voucher_entry[${index}].amount`}
							is_title_needed='false'
							dynamicerror={
								errors?.voucher_entry?.[index]?.amount
							}
							register={register}
						/>
					)}
				</td>

				<td className={`w-48 ${rowClass}`}>
					{type === 'cr' && (
						<Input
							title='Credit'
							label={`voucher_entry[${index}].amount`}
							is_title_needed='false'
							dynamicerror={
								errors?.voucher_entry?.[index]?.amount
							}
							register={register}
						/>
					)}
				</td>

				<td className={`w-12 ${rowClass} pl-6`}>
					<RemoveButton
						className={'justify-center'}
						onClick={onRemove}
						showButton
					/>
				</td>
			</tr>

			{type === 'dr' && selectedLedger?.has_cost_center && (
				<tr key={`cc-${index}`}>
					<td colSpan={6} className='p-0'>
						<CostCentersField
							voucherIndex={index}
							control={control}
							register={register}
							errors={errors}
							Controller={Controller}
							setValue={setValue}
							watch={watch}
						/>
					</td>
				</tr>
			)}

			{type === 'cr' && watch(`category`) === 'payment' && (
				<tr key={`payment-${index}`}>
					<td colSpan={6} className='p-0'>
						<PaymentField
							voucherIndex={index}
							control={control}
							register={register}
							errors={errors}
							Controller={Controller}
							watch={watch}
						/>
					</td>
				</tr>
			)}
		</>
	);
});

export default VoucherEntryRow;
