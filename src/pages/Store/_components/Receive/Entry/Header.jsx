import { useEffect } from 'react';
import { useOtherCurrency } from '@/pages/Accounting/Currency/config/query';
import { useOtherVendor } from '@/state/Other';
import { Controller, useWatch } from 'react-hook-form';
import { useParams } from 'react-router';

import {
	File,
	FormField,
	Input,
	ReactSelect,
	SectionEntryBody,
	Textarea,
} from '@/ui';

export default function Header({
	register,
	errors,
	control,
	isUpdate,
	setValue,
}) {
	const { purchase_description_uuid } = useParams();
	const { data: vendorOptions } = useOtherVendor();
	const { data: currencyOptions } = useOtherCurrency();

	const selectedCurrency = useWatch({
		control,
		name: 'currency_uuid',
	});

	const purchaseOptions = [
		{ label: 'Import', value: 0 },
		{ label: 'Local', value: 1 },
	];

	useEffect(() => {
		if (
			!isUpdate &&
			currencyOptions?.length &&
			(selectedCurrency === undefined || selectedCurrency === null)
		) {
			const def = currencyOptions.find((c) => c.default === true);
			if (def) {
				setValue('currency_uuid', def.value, {
					shouldDirty: true,
					shouldValidate: true,
				});
				setValue('conversion_rate', def.conversion_rate, {
					shouldDirty: true,
					shouldValidate: true,
				});
			}
		}
	}, [isUpdate, currencyOptions, selectedCurrency, setValue]);

	return (
		<SectionEntryBody
			title={
				isUpdate
					? `${control.getValues('purchase_id')} (LC Number: ${control.getValues(
							'lc_number'
						)})`
					: 'Information'
			}
			className='grid grid-cols-3 gap-4'
		>
			<div className='col-span-2 grid grid-cols-2 gap-2 text-secondary-content'>
				<FormField label='vendor_uuid' title='Vendor' errors={errors}>
					<Controller
						name='vendor_uuid'
						control={control}
						render={({ field: { onChange, value } }) => (
							<ReactSelect
								placeholder='Select Vendor'
								options={vendorOptions}
								value={
									vendorOptions?.find(
										(opt) => opt.value === value
									) || null
								}
								onChange={(opt) => onChange(opt?.value)}
								isDisabled={
									purchase_description_uuid !== undefined
								}
							/>
						)}
					/>
				</FormField>

				<FormField
					label='is_local'
					title='Import / Local'
					errors={errors}
				>
					<Controller
						name='is_local'
						control={control}
						render={({ field: { onChange, value } }) => (
							<ReactSelect
								placeholder='Select'
								options={purchaseOptions}
								value={
									purchaseOptions.find(
										(opt) => opt.value === value
									) || null
								}
								onChange={(opt) => onChange(opt?.value)}
							/>
						)}
					/>
				</FormField>

				<Input label='lc_number' register={register} errors={errors} />
				<Input
					label='challan_number'
					register={register}
					errors={errors}
				/>

				<FormField
					label='currency_uuid'
					title='Currency'
					errors={errors}
				>
					<Controller
						name='currency_uuid'
						control={control}
						render={({ field: { onChange, value } }) => {
							const selectedOption =
								currencyOptions?.find(
									(opt) => opt.value === value
								) || null;
							return (
								<ReactSelect
									placeholder='Select Currency'
									options={currencyOptions}
									value={selectedOption}
									onChange={(opt) => {
										if (opt) {
											setValue(
												'conversion_rate',
												opt.conversion_rate,
												{
													shouldDirty: true,
													shouldValidate: true,
												}
											);
											onChange(opt.value);
										}
									}}
								/>
							);
						}}
					/>
				</FormField>

				<Input
					label='conversion_rate'
					register={register}
					errors={errors}
				/>
				<Textarea label='remarks' register={register} errors={errors} />
			</div>

			<FormField label='file' title='File' errors={errors}>
				<Controller
					name='file'
					control={control}
					render={(props) => (
						<File
							isUpdate={isUpdate}
							IframeClassName='h-[200px]'
							{...props}
						/>
					)}
				/>
			</FormField>
		</SectionEntryBody>
	);
}
