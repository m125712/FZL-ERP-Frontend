import React, { useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';

import { FormField, Input, ReactSelect, RemoveButton } from '@/ui';

import { useOtherCostCenter } from '../../config/query';

export const CostCentersField = React.memo(function CostCentersField({
	voucherIndex,
	control,
	register,
	errors,
	Controller,
	watch,
	setValue,
}) {
	const {
		fields: costCenterFields,
		append: costCenterAppend,
		remove: costCenterRemove,
	} = useFieldArray({
		control,
		name: `voucher_entry.${voucherIndex}.voucher_entry_cost_center`,
	});

	const { data: costCenterOption } = useOtherCostCenter(
		`ledger_uuid=${watch(`voucher_entry.${voucherIndex}.ledger_uuid`)}`
	);

	const handleCostCenterAppend = () => {
		costCenterAppend({
			cost_center_uuid: '',
			amount: 0,
		});
	};
	const filterCostOptions = (options) => {
		return options?.filter((option) => {
			const isSelected = costCenterFields.some(
				(item) => item.cost_center_uuid === option.value
			);
			return !isSelected;
		});
	};
	useEffect(() => {
		if (watch(`voucher_entry.${voucherIndex}.type`) === 'cr') {
			setValue(
				`voucher_entry.${voucherIndex}.voucher_entry_cost_center`,
				[]
			);
		}
	}, [watch(`voucher_entry.${voucherIndex}.type`), voucherIndex, setValue]);

	const rowClass =
		'group whitespace-nowrap text-left text-sm font-normal tracking-wide  p-3';

	return (
		<div className='ml-4 mt-1 border-l-2 border-gray-200 pl-32'>
			<div className='mb-2 flex items-center justify-between'>
				<button
					type='button'
					onClick={handleCostCenterAppend}
					disabled={
						costCenterFields.length >= costCenterOption?.length
					}
					className='btn btn-outline btn-sm disabled:border-red-500 disabled:bg-red-50 disabled:text-red-400'
				>
					<Plus className='size-4' />
					Cost Center
				</button>
			</div>

			{costCenterFields?.length > 0 && (
				<table className='w-full table-auto'>
					<thead>
						<tr>
							<th className='pl-4'>No.</th>
							<th className='pl-4'>Cost Center</th>
							<th></th>
							<th className='pl-4'>Debit</th>
							<th></th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{costCenterFields.map((item, index) => (
							<tr key={item.id} className='gap-4'>
								<td className={`w-10 ${rowClass}`}>
									{index + 1}
								</td>
								<td className={`w-48 ${rowClass}`}>
									<FormField
										label={`voucher_entry.${voucherIndex}.voucher_entry_cost_center.${index}.cost_center_uuid`}
										title='Cost Center'
										is_title_needed='false'
										dynamicerror={
											errors?.voucher_entry?.[
												voucherIndex
											]?.voucher_entry_cost_center?.[
												index
											]?.cost_center_uuid
										}
									>
										<Controller
											name={`voucher_entry.${voucherIndex}.voucher_entry_cost_center.${index}.cost_center_uuid`}
											control={control}
											render={({
												field: { onChange, value },
											}) => (
												<ReactSelect
													placeholder='Select Cost Center'
													options={filterCostOptions(
														costCenterOption
													)}
													value={
														costCenterOption?.find(
															(o) =>
																o.value ===
																value
														) ?? null
													}
													onChange={(e) =>
														onChange(e?.value)
													}
													menuPortalTarget={
														document.body
													}
												/>
											)}
										/>
									</FormField>
								</td>

								<td className={`w-72 ${rowClass}`}></td>

								<td className={`w-48 ${rowClass}`}>
									<Input
										title='Debit'
										is_title_needed='false'
										label={`voucher_entry.${voucherIndex}.voucher_entry_cost_center.${index}.amount`}
										dynamicerror={
											errors?.voucher_entry?.[
												voucherIndex
											]?.voucher_entry_cost_center?.[
												index
											]?.amount
										}
										register={register}
									/>
								</td>

								<td className={`w-48 ${rowClass}`}></td>

								<td className={`w-12 ${rowClass} pl-0`}>
									<RemoveButton
										onClick={() => costCenterRemove(index)}
										showButton={costCenterFields.length > 0}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
});
