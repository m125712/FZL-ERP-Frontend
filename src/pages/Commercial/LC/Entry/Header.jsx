import { useState } from 'react';
import { useParams } from 'react-router-dom';

import {
	CheckBox,
	FormField,
	Input,
	ReactSelect,
	SectionEntryBody,
	Textarea,
} from '@/ui';
import { DateInput } from '@/ui/Core';
import { useFetch } from '@/hooks';

export default function Header({
	register,
	errors,
	control,
	getValues,
	Controller,
	watch,
}) {
	const { lc_uuid } = useParams();

	const { value: party } = useFetch('/other/party/value/label');

	const atSight = [
		{ value: null, label: '---' },
		{ value: 0, label: 'At Sight / 0 Day' },
		{ value: 30, label: '30' },
		{ value: 60, label: '60' },
		{ value: 90, label: '90' },
		{ value: 120, label: '120' },
		{ value: 150, label: '150' },
		{ value: 180, label: '180' },
	];

	const Section = ({ title, children }) => (
		<div className='flex flex-col gap-1 rounded-md bg-primary/20 p-2'>
			<span className='ml-1 text-xl font-bold'>{title}</span>
			<div className='flex flex-col gap-1 text-secondary-content md:flex-row'>
				{children}
			</div>
		</div>
	);

	return (
		<div className='flex flex-col gap-4'>
			<SectionEntryBody title='LC Information'>
				<div className='flex flex-col gap-2'>
					<div className='flex gap-1 overflow-auto text-sm md:justify-end'>
						<div className='rounded-md bg-primary px-1'>
							<CheckBox
								title='Problematic'
								label='problematical'
								text='text-primary-content'
								{...{ register, errors }}
							/>
						</div>
						<div className='rounded-md bg-primary px-1'>
							<CheckBox
								title='EPZ'
								label='epz'
								text='text-primary-content'
								{...{ register, errors }}
							/>
						</div>
						<div className='rounded-md bg-primary px-1'>
							<CheckBox
								title='Production Complete'
								label='production_complete'
								text='text-primary-content'
								{...{ register, errors }}
							/>
						</div>
						<div className='rounded-md bg-primary px-1'>
							<CheckBox
								title='Cancelled'
								label='lc_cancel'
								text='text-primary-content'
								{...{ register, errors }}
							/>
						</div>
					</div>
					<Section title='File Details'>
						<FormField
							label='party_uuid'
							title='Party'
							errors={errors}>
							<Controller
								name={'party_uuid'}
								control={control}
								render={({ field: { onChange } }) => {
									return (
										<ReactSelect
											placeholder='Select Party'
											options={party}
											value={party?.find(
												(item) =>
													item.value ===
													getValues('party_uuid')
											)}
											onChange={(e) => onChange(e.value)}
										/>
									);
								}}
							/>
						</FormField>
						<Input label='file_no' {...{ register, errors }} />
						<Input
							label='lc_number'
							disabled={lc_uuid != null}
							{...{ register, errors }}
						/>
						<DateInput
							label='lc_date'
							Controller={Controller}
							control={control}
							selected={watch('lc_date')}
						/>
					</Section>
					<Section title='Commercial Details'>
						<Input
							label='commercial_executive'
							{...{ register, errors }}
						/>
						<Input label='party_bank' {...{ register, errors }} />
						<DateInput
							label='shipment_date'
							Controller={Controller}
							control={control}
							selected={watch('shipment_date')}
						/>{' '}
						<DateInput
							label='expiry_date'
							Controller={Controller}
							control={control}
							selected={watch('expiry_date')}
						/>
					</Section>
					<Section title='Progression'>
						<Input
							label='ldbc_fdbc'
							title='LDBC/FDBC'
							{...{ register, errors }}
						/>
						<DateInput
							label='handover_date'
							Controller={Controller}
							control={control}
							selected={watch('handover_date')}
						/>
						<DateInput
							label='acceptance_date'
							Controller={Controller}
							control={control}
							selected={watch('acceptance_date')}
						/>
						<DateInput
							label='maturity_date'
							Controller={Controller}
							control={control}
							selected={watch('maturity_date')}
						/>
						<DateInput
							label='payment_date'
							Controller={Controller}
							control={control}
							selected={watch('payment_date')}
						/>
						<Input
							label='payment_value'
							{...{ register, errors }}
						/>
					</Section>
					<Section title='Others'>
						<Input label='ud_no' {...{ register, errors }} />
						<DateInput
							label='ud_received'
							Controller={Controller}
							control={control}
							selected={watch('ud_received')}
						/>
						<FormField
							label='at_sight'
							title='Payment Rec.'
							errors={errors}>
							<Controller
								name='at_sight'
								control={control}
								render={({ field: { onChange } }) => {
									return (
										<ReactSelect
											placeholder='Select Payment Receiving'
											options={atSight}
											value={atSight?.find(
												(item) =>
													item.value ==
													getValues('at_sight')
											)}
											onChange={(e) => {
												const value = parseInt(e.value);
												onChange(value);
											}}
										/>
									);
								}}
							/>
						</FormField>
						<DateInput
							label='amd_date'
							Controller={Controller}
							control={control}
							selected={watch('amd_date')}
						/>
						<Input label='amd_count' {...{ register, errors }} />
						<Textarea label='remarks' {...{ register, errors }} />
					</Section>
				</div>
			</SectionEntryBody>
		</div>
	);
}
