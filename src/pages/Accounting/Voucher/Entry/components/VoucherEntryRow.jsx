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
		selectedLedgers,
	} = props;

	const type = watch(`voucher_entry[${index}].type`);
	const selectedLedgerUuid = watch(`voucher_entry[${index}].ledger_uuid`);
	const selectedLedger = ledgerOptions?.find(
		(l) => l.value === selectedLedgerUuid
	);
	const filteredLedgerOptions = React.useMemo(() => {
		return ledgerOptions?.filter(
			(opt) =>
				!selectedLedgers.includes(opt.value) ||
				opt.value === selectedLedgerUuid
		);
	}, [ledgerOptions, selectedLedgers, selectedLedgerUuid]);

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
									onChange={(e) => {
										onTypeChange(index, e?.value, onChange);
									}}
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
									options={filteredLedgerOptions}
									value={
										filteredLedgerOptions.find(
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

				<td className={`w-48 ${rowClass} `}>
					{type === 'dr' && (
						<Input
							title='Debit'
							label={`voucher_entry[${index}].amount`}
							is_title_needed='false'
							type='number'
							onChange={(e) => {
								setValue(
									`voucher_entry.${index}.amount`,
									e.target.value
								);
							}}
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
							onChange={(e) => {
								setValue(
									`voucher_entry.${index}.amount`,
									e.target.value
								);
							}}
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
