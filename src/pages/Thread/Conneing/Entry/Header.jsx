import { useFetch } from '@/hooks';
import {
	FormField,
	Input,
	JoinInput,
	ReactSelect,
	SectionEntryBody,
	Textarea,
} from '@/ui';
import isJSON from '@/util/isJson';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Header({ errors, control, getValues, Controller }) {
	const { value: batch_number } = useFetch(`/other/thread/batch/value/label`);
	const { value: user } = useFetch('/other/hr/user/value/label');
	const machine_speed = [
		{ label: 'Low', value: 'low' },
		{ label: 'Medium', value: 'medium' },
		{ label: 'High', value: 'high' },
	];

	return (
		<div className='flex flex-col gap-4'>
			<SectionEntryBody title='Coning'>
				<div className='flex flex-col gap-1 px-2 text-secondary-content md:flex-row'>
					<FormField label='uuid' title='Batch No' errors={errors}>
						<Controller
							name='uuid'
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Batch'
										options={batch_number}
										value={batch_number?.find(
											(item) =>
												item.value == getValues('uuid')
										)}
										onChange={(e) => {
											const value = e.value;
											onChange(value);
										}}
										isDisabled={true}
									/>
								);
							}}
						/>
					</FormField>
					<FormField
						label='coning_operator'
						title='Operator'
						errors={errors}>
						<Controller
							name='coning_operator'
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Operator'
										options={user}
										value={user?.find(
											(item) =>
												item.value ==
												getValues('coning_operator')
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

					<FormField
						label='coning_supervisor'
						title='Supervisor'
						errors={errors}>
						<Controller
							name='coning_supervisor'
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Supervisor'
										options={user}
										value={user?.find(
											(item) =>
												item.value ==
												getValues('coning_supervisor')
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
					<FormField
						label='coning_machines'
						title='Machine Speed'
						errors={errors}>
						<Controller
							name='coning_machines'
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Machine Speed'
										options={machine_speed}
										value={machine_speed?.find(
											(item) =>
												item.value ==
												getValues('coning_machines')
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
				</div>
			</SectionEntryBody>
		</div>
	);
}
