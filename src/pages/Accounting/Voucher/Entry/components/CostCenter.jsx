import { useWatch } from 'react-hook-form';

import { FormField, Input, ReactSelect } from '@/ui';

import { useOtherCostCenter } from '../../config/query';

export default function CostCenter({
	entryPath,
	control,
	errors,
	p,
	Controller,
	subIdx,
	watch,
	register,
	vendor_name,
	purchase_id,
	amount,
}) {
	const filterCostOptions = (options, index) => {
		return options?.filter((option) => {
			const isSelected = watch(
				`voucher_entry[${index}].voucher_entry_cost_center`
			)?.some((item) => item.cost_center_uuid === option.value);
			return !isSelected;
		});
	};
	const watchedLedgers =
		useWatch({ control, name: `voucher_entry.${p}.ledger_uuid` }) || [];

	const { data: costCenterOptions = [] } = useOtherCostCenter(
		watchedLedgers ? `ledger_uuid=${watchedLedgers}` : ''
	);
	console.log(vendor_name, purchase_id, amount);
	return (
		<div className='flex gap-2'>
			<p className='justify-center py-4 align-baseline text-sm font-medium text-gray-900'>
				{p + 1}.{subIdx + 1}
			</p>
			<div className='flex gap-2'>
				<FormField
					label={`${entryPath}.voucher_entry_cost_center[${subIdx}].cost_center_uuid`}
					is_title_needed='false'
					dynamicerror={
						errors?.voucher_entry?.[p]?.voucher_entry_cost_center?.[
							subIdx
						]?.cost_center_uuid
					}
				>
					<Controller
						name={`${entryPath}.voucher_entry_cost_center[${subIdx}].cost_center_uuid`}
						control={control}
						render={({ field: { onChange, value } }) => (
							<ReactSelect
								placeholder='Select Cost Center'
								options={filterCostOptions(
									costCenterOptions,
									p
								)}
								value={
									costCenterOptions.find(
										(o) => o.value === value
									) ?? null
								}
								onChange={(e) => onChange(e?.value)}
								menuPortalTarget={document.body}
							/>
						)}
					/>
				</FormField>
				<Input
					title='price'
					label={`${entryPath}.voucher_entry_cost_center[${subIdx}].invoice_no`}
					placeholder='Enter Invoice No'
					is_title_needed='false'
					dynamicerror={errors?.purchase?.[index]?.price}
					register={register}
				/>
			</div>
		</div>
	);
}
