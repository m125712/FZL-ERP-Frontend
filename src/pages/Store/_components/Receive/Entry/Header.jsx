import { useOtherVendor } from '@/state/Other';
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
	getValues,
	Controller,
	isUpdate,
	type,
}) {
	const { purchase_description_uuid } = useParams();
	const { data: vendor } = useOtherVendor(type);

	const purchaseOptions = [
		{ label: 'Import', value: 0 },
		{ label: 'Local', value: 1 },
	];

	return (
		<SectionEntryBody
			title='Information'
			className='grid grid-cols-3 gap-4'
		>
			<div className='col-span-2 grid grid-cols-2 gap-2 text-secondary-content'>
				<FormField label='vendor_uuid' title='Vendor' errors={errors}>
					<Controller
						name={'vendor_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Vendor'
									options={vendor}
									value={vendor?.find(
										(item) =>
											item.value ==
											getValues('vendor_uuid')
									)}
									onChange={(e) => onChange(e.value)}
									isDisabled={
										purchase_description_uuid !== undefined
									}
								/>
							);
						}}
					/>
				</FormField>

				<FormField
					label='is_local'
					title='Import / Local'
					errors={errors}
				>
					<Controller
						name={'is_local'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select'
									options={purchaseOptions}
									value={purchaseOptions?.find(
										(item) =>
											item.value == getValues('is_local')
									)}
									onChange={(e) => onChange(e.value)}
								/>
							);
						}}
					/>
				</FormField>
				<Input label='lc_number' {...{ register, errors }} />
				<Input label='challan_number' {...{ register, errors }} />
				<Textarea label='remarks' {...{ register, errors }} />
			</div>
			<FormField label='file' title='File' errors={errors}>
				<Controller
					name={'file'}
					control={control}
					render={(props) => {
						return (
							<File
								isUpdate={isUpdate}
								IframeClassName='h-[200px]'
								{...props}
							/>
						);
					}}
				/>
			</FormField>
		</SectionEntryBody>
	);
}
