import { useFetch } from '@/hooks';
import {
	FormField,
	JoinInput,
	ReactSelect,
	SectionEntryBody,
	Textarea,
} from '@/ui';
import isJSON from '@/util/isJson';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Header({
	register,
	errors,
	control,
	getValues,
	Controller,
	isUpdate,
}) {
	const { value: batch_number } = useFetch(`/other/thread/batch/value/label`);
	const { value: machine } = useFetch('/other/machine/value/label');
	const { value: user } = useFetch('/other/hr/user/value/label');

	return (
		<div className='flex flex-col gap-4'>
			<SectionEntryBody title='Thread Batch'>
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
						title='Coning Operator'
						errors={errors}>
						<Controller
							name='coning_operator'
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Coning Operator'
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
						title='Coning Supervisor'
						errors={errors}>
						<Controller
							name='coning_supervisor'
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Coning Supervisor'
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
						title='Coning Machine'
						errors={errors}>
						<Controller
							name='coning_machines'
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Coning Machine'
										options={machine}
										value={machine?.find(
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
