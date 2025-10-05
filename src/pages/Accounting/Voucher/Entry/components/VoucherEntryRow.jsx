import React, { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useWatch } from 'react-hook-form';

import { DateInput } from '@/ui/Core';
import { FormField, Input, ReactSelect, RemoveButton } from '@/ui';

import { useOtherCostCenter } from '../../config/query';
import { paymentTypeOption, typeOptions } from '../../utils';
import CostCenter from './CostCenter';
import EmptyState from './EmptyState';
import TableHead from './TableHead';
import VoucherEntryHeader from './VoucherEntryHeader';

function VoucherEntryRow({
	control,
	register,
	errors,
	Controller,
	watch,
	currencyOptions,
	setValue,
	ledgerOptions,
	voucherFields,
	appendDrEntry,
	appendCrEntry,
	handleVoucherRemove,
	handleTypeChange,
	handlePaymentAppend,
	handlePaymentRemove,
	handleCostCenterAppend,
	handleCostCenterRemove,
	invalidateLedger,
	setUpdateItem,
	children,
}) {
	const [renderKey, setRenderKey] = useState(0);

	const allFormData = watch();
	const voucherEntries = useWatch({
		control,
		name: 'voucher_entry',
		defaultValue: [],
	});
	const category = watch('category');
	console.log(category);
	const [index, setIndex] = useState(0);

	const { invalidateQuery: invalidQueryCostCenter } = useOtherCostCenter(
		`ledger_uuid=${watch(`voucher_entry.${index}.ledger_uuid`)}`
	);
	const selectedLedgers =
		watch('voucher_entry')?.map((e) => e?.ledger_uuid) || [];

	const filteredLedgerOptions = React.useMemo(() => {
		return ledgerOptions?.filter(
			(opt) =>
				!selectedLedgers.includes(opt.value) ||
				opt.value === selectedLedgers
		);
	}, [ledgerOptions, selectedLedgers, selectedLedgers]);

	const allRows = useMemo(() => {
		const rows = [];

		voucherFields.forEach((fieldEntry, idx) => {
			const voucherEntry = voucherEntries[idx];
			if (!voucherEntry) return;

			const type = voucherEntry.type;
			const payments = voucherEntry.voucher_entry_payment || [];
			const costCenters = voucherEntry.voucher_entry_cost_center || [];
			const entryOrder = voucherEntry.entry_order || []; // Track creation order
			const ledgerUuid = voucherEntry.ledger_uuid;
			const selectedLedger = ledgerOptions.find(
				(l) => l.value === ledgerUuid
			);

			// Calculate sub-rows based on entry order
			let subRows = [];

			entryOrder.forEach((orderEntry, displayIndex) => {
				if (
					(orderEntry.type === 'payment' &&
						type === 'cr' &&
						category === 'payment') ||
					category === 'contra'
				) {
					const paymentIndex = orderEntry.index;
					if (payments[paymentIndex]) {
						subRows.push({
							type: 'payment',
							parent: idx,
							subIdx: paymentIndex,
							displayIndex: displayIndex,
							id: `payment-${idx}-${paymentIndex}-${renderKey}`,
						});
					}
				} else if (
					orderEntry.type === 'costCenter' &&
					selectedLedger?.cost_center_count > 0
				) {
					const costCenterIndex = orderEntry.index;
					if (costCenters[costCenterIndex]) {
						subRows.push({
							type: 'costCenter',
							parent: idx,
							subIdx: costCenterIndex,
							displayIndex: displayIndex,
							mainType: type,
							id: `costCenter-${idx}-${costCenterIndex}-${renderKey}`,
						});
					}
				}
			});

			const mainRow = {
				type: 'main',
				parent: idx,
				rowSpan: Math.max(1, subRows.length + 1),
				fieldId: fieldEntry.id,
				id: `main-${idx}-${renderKey}`,
			};

			rows.push(mainRow);
			rows.push(...subRows);
		});

		return rows;
	}, [
		voucherFields,
		voucherEntries,
		category,
		ledgerOptions,
		renderKey,
		watch(''),
		allFormData,
	]);

	const rowClass = 'border px-3 py-2 text-sm align-top';

	const handelUpdate = async (idx, amount) => {
		setIndex(idx);
		const currentCostCenters =
			watch(`voucher_entry[${idx}].voucher_entry_cost_center`) || [];

		await setUpdateItem((prev) => ({
			...prev,
			leader_uuid: watch(`voucher_entry.${idx}.ledger_uuid`),
			voucher_entry_set_value: setValue,
			voucher_entry_get_values: watch,
			currentCostCenters: currentCostCenters,
			amount: amount,
			index: idx,
			invalidQueryCostCenter: invalidQueryCostCenter,
			invalidateLedger: invalidateLedger,
		}));
		window['voucher_entry_cost_center_add'].showModal();
	};

	return (
		<div className=''>
			{/* Header */}
			<VoucherEntryHeader
				appendCrEntry={appendCrEntry}
				appendDrEntry={appendDrEntry}
			/>
			{/* Table */}
			<div className='overflow-scroll rounded-lg border bg-white shadow-sm'>
				<div className='overflow-x-auto'>
					<table className='w-full border-collapse'>
						<TableHead
							rowClass={rowClass}
							watch={watch}
							currencyOptions={currencyOptions}
						/>
						<tbody>
							{allRows.map((row) => {
								const p = row.parent;
								const entryPath = `voucher_entry[${p}]`;
								const voucherEntry = voucherEntries[p];

								if (!voucherEntry) return null;

								const type = voucherEntry.type;
								const ledgerUuid = voucherEntry.ledger_uuid;
								const selectedLedger = ledgerOptions.find(
									(l) => l.value === ledgerUuid
								);

								const showPaymentButton =
									type === 'cr' &&
									(category === 'payment' ||
										category === 'contra') &&
									selectedLedger?.is_cash_ledger === false;
								const remainingAmount =
									voucherEntry.amount -
									voucherEntry.voucher_entry_cost_center.reduce(
										(sum, entry) =>
											sum + Number(entry.amount),
										0
									) -
									voucherEntry.voucher_entry_payment.reduce(
										(sum, entry) =>
											sum + Number(entry.amount),
										0
									);

								return (
									<tr
										key={row.id}
										className={` ${rowClass} hover:bg-gray-50 ${
											p % 2 === 0
												? 'bg-gray-50'
												: 'bg-white'
										} `}
									>
										{/* Main entry fields with rowSpan */}
										{row.type === 'main' && (
											<>
												<td
													rowSpan={row.rowSpan}
													className={`${rowClass} w-10 align-top`}
												>
													{p + 1}
												</td>
												<td
													rowSpan={row.rowSpan}
													className={`${rowClass} w-32 align-top`}
												>
													<FormField
														label={`${entryPath}.type`}
														is_title_needed='false'
														dynamicerror={
															errors
																.voucher_entry?.[
																p
															]?.type
														}
													>
														<Controller
															name={`${entryPath}.type`}
															control={control}
															render={({
																field: {
																	onChange,
																	value,
																},
															}) => (
																<ReactSelect
																	placeholder='Select Type'
																	options={
																		typeOptions
																	}
																	value={
																		typeOptions.find(
																			(
																				o
																			) =>
																				o.value ===
																				value
																		) ??
																		null
																	}
																	onChange={(
																		e
																	) =>
																		handleTypeChange(
																			p,
																			e?.value,
																			onChange
																		)
																	}
																	menuPortalTarget={
																		document.body
																	}
																/>
															)}
														/>
													</FormField>

													<div className='flex w-full flex-col justify-items-end gap-2 py-2'>
														{
															<button
																type='button'
																onClick={() => {
																	handleCostCenterAppend(
																		p,
																		remainingAmount >=
																			0
																			? remainingAmount
																			: 0
																	);
																}}
																disabled={
																	watch(
																		`voucher_entry.${p}.voucher_entry_cost_center`
																	)?.length >=
																		ledgerOptions.find(
																			(
																				l
																			) =>
																				l.value ===
																				ledgerUuid
																		)
																			?.cost_center_count ||
																	!watch(
																		`voucher_entry.${p}.ledger_uuid`
																	)
																}
																className='btn btn-outline btn-sm flex items-center justify-center gap-1 rounded'
																title='Add Cost Center Entry'
															>
																CC
																<Plus className='h-3 w-3' />
															</button>
														}
														{
															<button
																type='button'
																onClick={() => {
																	handelUpdate(
																		p,
																		remainingAmount >=
																			0
																			? remainingAmount
																			: 0
																	);

																	setIndex(p);

																	setValue(
																		`voucher_entry[${p}].voucher_entry_cost_center`,

																		watch(
																			`voucher_entry[${p}].voucher_entry_cost_center`
																		).filter(
																			(
																				item
																			) =>
																				item.cost_center_uuid !==
																					null &&
																				item.cost_center_uuid !==
																					undefined &&
																				item.cost_center_uuid !==
																					''
																		) || []
																	);
																}}
																disabled={
																	!watch(
																		`voucher_entry.${p}.ledger_uuid`
																	)
																}
																className='btn btn-outline btn-sm flex items-center justify-center gap-1 rounded bg-accent text-white'
																title='Add Cost Center Entry'
															>
																New CC
																<Plus className='h-3 w-3' />
															</button>
														}
													</div>

													{showPaymentButton && (
														<div className='w-full justify-items-end py-2'>
															<button
																type='button'
																onClick={() => {
																	handlePaymentAppend(
																		p,
																		remainingAmount >=
																			0
																			? remainingAmount
																			: 0
																	);
																}}
																className='btn btn-outline btn-sm flex flex-shrink-0 items-center gap-1 rounded'
																title='Add Payment Entry'
															>
																<Plus className='h-3 w-3' />
																Payment
															</button>
														</div>
													)}
												</td>
											</>
										)}
										<td
											// rowSpan={row.rowSpan}
											className={`${rowClass}`}
										>
											{row.type === 'main' && (
												<FormField
													label={`${entryPath}.ledger_uuid`}
													is_title_needed='false'
													dynamicerror={
														errors.voucher_entry?.[
															p
														]?.ledger_uuid
													}
												>
													<Controller
														name={`${entryPath}.ledger_uuid`}
														control={control}
														render={({
															field: {
																onChange,
																value,
															},
														}) => (
															<ReactSelect
																placeholder='Select Ledger'
																options={
																	filteredLedgerOptions
																}
																value={
																	ledgerOptions.find(
																		(o) =>
																			o.value ===
																			value
																	) ?? null
																}
																onChange={(e) =>
																	onChange(
																		e?.value
																	)
																}
																menuPortalTarget={
																	document.body
																}
															/>
														)}
													/>
												</FormField>
											)}

											{row.type === 'payment' && (
												<div className='flex gap-2'>
													<p className='justify-center py-4 align-baseline text-sm font-medium text-gray-900'>
														{p + 1}.
														{row.displayIndex + 1}
													</p>
													<FormField
														label={`${entryPath}.voucher_entry_payment[${row.subIdx}].payment_type`}
														is_title_needed='false'
														dynamicerror={
															errors
																.voucher_entry?.[
																p
															]
																?.voucher_entry_payment?.[
																row.subIdx
															]?.payment_type
														}
													>
														<Controller
															name={`${entryPath}.voucher_entry_payment[${row.subIdx}].payment_type`}
															control={control}
															render={({
																field: {
																	onChange,
																	value,
																},
															}) => (
																<ReactSelect
																	placeholder='Select Payment Method'
																	options={
																		paymentTypeOption
																	}
																	value={
																		paymentTypeOption.find(
																			(
																				o
																			) =>
																				o.value ===
																				value
																		) ??
																		null
																	}
																	onChange={(
																		e
																	) =>
																		onChange(
																			e?.value
																		)
																	}
																	menuPortalTarget={
																		document.body
																	}
																/>
															)}
														/>
													</FormField>
												</div>
											)}
											{row.type === 'costCenter' && (
												<CostCenter
													entryPath={entryPath}
													control={control}
													errors={errors}
													p={p}
													Controller={Controller}
													subIdx={row.subIdx}
													watch={watch}
													register={register}
													displayIndex={
														row.displayIndex + 1
													}
													setValue={setValue}
												></CostCenter>
											)}
										</td>

										{/* Transaction No */}
										<td className={`${rowClass} w-48`}>
											{row.type === 'payment' && (
												<Input
													title='Transaction No.'
													label={`${entryPath}.voucher_entry_payment[${row.subIdx}].trx_no`}
													is_title_needed='false'
													register={register}
													dynamicerror={
														errors.voucher_entry?.[
															p
														]
															?.voucher_entry_payment?.[
															row.subIdx
														]?.trx_no
													}
												/>
											)}
										</td>

										{/* Date */}
										<td className={`${rowClass} w-48`}>
											{row.type === 'payment' && (
												<DateInput
													label={`${entryPath}.voucher_entry_payment[${row.subIdx}].date`}
													control={control}
													Controller={Controller}
													is_title_needed='false'
													register={register}
													errors={errors}
													selected={watch(
														`${entryPath}.voucher_entry_payment[${row.subIdx}].date`
													)}
												/>
											)}
										</td>

										{/* Debit Amount */}
										<td
											className={`${rowClass} w-32 text-right`}
										>
											{row.type === 'main' &&
												type === 'dr' && (
													<Input
														title='Debit'
														type='number'
														label={`${entryPath}.amount`}
														is_title_needed='false'
														register={register}
														dynamicerror={
															errors
																.voucher_entry?.[
																p
															]?.amount
														}
													/>
												)}
											{row.type === 'costCenter' &&
												row.mainType == 'dr' && (
													<Input
														title='Debit'
														label={`${entryPath}.voucher_entry_cost_center[${row.subIdx}].amount`}
														type='number'
														is_title_needed='false'
														register={register}
														dynamicerror={
															errors
																.voucher_entry?.[
																p
															]
																?.voucher_entry_cost_center?.[
																row.subIdx
															]?.amount
														}
													/>
												)}
										</td>

										{/* Credit Amount */}
										<td
											className={`${rowClass} w-32 text-right`}
										>
											{row.type === 'main' &&
												type === 'cr' && (
													<Input
														title='Credit'
														label={`${entryPath}.amount`}
														is_title_needed='false'
														type='number'
														register={register}
														dynamicerror={
															errors
																.voucher_entry?.[
																p
															]?.amount
														}
													/>
												)}
											{row.type === 'payment' && (
												<Input
													title='Credit'
													label={`${entryPath}.voucher_entry_payment[${row.subIdx}].amount`}
													type='number'
													is_title_needed='false'
													register={register}
													dynamicerror={
														errors.voucher_entry?.[
															p
														]
															?.voucher_entry_payment?.[
															row.subIdx
														]?.amount
													}
												/>
											)}
											{row.type === 'costCenter' &&
												row.mainType == 'cr' && (
													<Input
														title='Debit'
														label={`${entryPath}.voucher_entry_cost_center[${row.subIdx}].amount`}
														type='number'
														is_title_needed='false'
														register={register}
														dynamicerror={
															errors
																.voucher_entry?.[
																p
															]
																?.voucher_entry_cost_center?.[
																row.subIdx
															]?.amount
														}
													/>
												)}
										</td>

										{/* Action Column */}
										<td
											className={`${rowClass} w-4 text-center`}
										>
											{row.type === 'main' ? (
												<div className='flex flex-wrap items-center justify-center gap-1'>
													<RemoveButton
														onClick={() =>
															handleVoucherRemove(
																p
															)
														}
														showButton
														className='flex-shrink-0'
													/>
												</div>
											) : (
												<RemoveButton
													onClick={() => {
														if (
															row.type ===
															'payment'
														) {
															handlePaymentRemove(
																p,
																row.subIdx
															);
														} else {
															handleCostCenterRemove(
																p,
																row.subIdx
															);
														}
														setTimeout(
															() =>
																setRenderKey(
																	(prev) =>
																		prev + 1
																),
															50
														);
													}}
													showButton
													className='flex-shrink-0'
												/>
											)}
										</td>
									</tr>
								);
							})}
							{children}
						</tbody>
					</table>
				</div>
			</div>

			{/* Empty State */}
			{voucherFields.length === 0 && (
				<EmptyState
					appendCrEntry={appendCrEntry}
					appendDrEntry={appendDrEntry}
				/>
			)}
		</div>
	);
}

export default React.memo(VoucherEntryRow);
