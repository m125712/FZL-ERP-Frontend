import { useState } from 'react';
import { useFetch } from '@/hooks';
import { FormField, ReactSelect, SectionEntryBody, Textarea } from '@/ui';

export default function Header({
	Controller,
	register,
	errors,
	control,
	getValues,
}) {
	const { value: machine } = useFetch('/other/machine/value/label');
	const slot = [
		{ label: 'Slot 1', value: 1 },
		{ label: 'Slot 2', value: 2 },
		{ label: 'Slot 3', value: 3 },
		{ label: 'Slot 4', value: 4 },
	];
	const [maxCapacity, setMaxCapacity] = useState(0);
	const [minCapacity, setMinCapacity] = useState(0);
	
	return (
		<div className='flex flex-col gap-4'>
			<SectionEntryBody
				title={`Batch Capacity: ${minCapacity} Kg to ${maxCapacity} Kg `}>
				<div className='flex flex-col gap-1 px-2 text-secondary-content md:flex-row'>
					<FormField
						label='machine_uuid'
						title='Machine'
						errors={errors}>
						<Controller
							name='machine_uuid'
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Machine'
										options={machine}
										value={machine?.find(
											(item) =>
												item.value ==
												getValues('machine_uuid')
										)}
										onChange={(e) => {
											const value = e.value;
											onChange(value);
											setMinCapacity(e.min_capacity);
											setMaxCapacity(e.max_capacity);
										}}
									/>
								);
							}}
						/>
					</FormField>
					<FormField label='slot' title='Slot' errors={errors}>
						<Controller
							name='slot'
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Slot'
										options={slot}
										value={slot?.find(
											(item) =>
												item.value == getValues('slot')
										)}
										onChange={(e) => {
											const value = e.value;
											onChange(value);
										}}
									/>
								);
							}}
						/>
					</FormField>
					<Textarea label='remarks' {...{ register, errors }} />
				</div>
			</SectionEntryBody>
		</div>
	);
}