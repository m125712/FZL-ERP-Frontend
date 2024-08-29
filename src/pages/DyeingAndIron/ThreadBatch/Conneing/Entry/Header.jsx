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
	const { value: dyeing_operator_option } = useFetch(
		'/other/hr/user/value/label'
	);
	const { value: pass_by_option } = useFetch('/other/hr/user/value/label');
	const { value: dyeing_supervisor_option } = useFetch(
		'/other/hr/user/value/label'
	);
	const reasonOption = [
		{
			label: 'MC_pressure problem ect',
			value: 'mc_pressure_problem_ect',
		},
		{ label: 'Other', value: 'other' },
	];
	const categoryOption = [
		{ label: 'Light', value: 'light' },
		{ label: 'Medium', value: 'medium' },
	];

	const statusOption = [
		{ label: 'RFT', value: 'rft' },
		{ label: 'Other', value: 'other' },
	];
	const shiftOption = [
		{ label: 'A', value: 'a' },
		{ label: 'B', value: 'b' },
	];

	return (
		<div className='flex flex-col gap-4'>
			<SectionEntryBody title='Yarn Issue'>
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
					<Input label='yarn_quantity' {...{ register, errors }} />
				</div>
			</SectionEntryBody>
			<SectionEntryBody title='Dyeing'>
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
										}}
									/>
								);
							}}
						/>
					</FormField>
					<FormField
						label='dyeing_operator'
						title='Operator'
						errors={errors}>
						<Controller
							name={'dyeing_operator'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Dyeing Operator'
										options={dyeing_operator_option}
										value={dyeing_operator_option?.find(
											(item) =>
												item.value ===
												getValues('dyeing_operator')
										)}
										onChange={(e) => {
											onChange(e.value);
										}}
									/>
								);
							}}
						/>
					</FormField>
					<FormField label='reason' title='Reason' errors={errors}>
						<Controller
							name={'reason'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Reason'
										options={reasonOption}
										value={reasonOption?.find(
											(item) =>
												item.value ===
												getValues('reason')
										)}
										onChange={(e) => {
											onChange(e.value);
										}}
									/>
								);
							}}
						/>
					</FormField>
					<FormField
						label='category'
						title='Category'
						errors={errors}>
						<Controller
							name={'category'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Category'
										options={categoryOption}
										value={categoryOption?.find(
											(item) =>
												item.value ===
												getValues('category')
										)}
										onChange={(e) => {
											onChange(e.value);
										}}
									/>
								);
							}}
						/>
					</FormField>
				</div>

				<div className='flex flex-col gap-1 px-2 text-secondary-content md:flex-row'>
					<FormField label='status' title='Status' errors={errors}>
						<Controller
							name={'status'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Status'
										options={statusOption}
										value={statusOption?.find(
											(item) =>
												item.value ===
												getValues('status')
										)}
										onChange={(e) => {
											onChange(e.value);
										}}
									/>
								);
							}}
						/>
					</FormField>
					<FormField label='pass_by' title='Pass By' errors={errors}>
						<Controller
							name={'pass_by'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Pass By'
										options={pass_by_option}
										value={pass_by_option?.find(
											(item) =>
												item.value ===
												getValues('pass_by')
										)}
										onChange={(e) => {
											onChange(e.value);
										}}
									/>
								);
							}}
						/>
					</FormField>
					<FormField label='shift' title='Shift' errors={errors}>
						<Controller
							name={'shift'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Shift'
										options={shiftOption}
										value={shiftOption?.find(
											(item) =>
												item.value ===
												getValues('shift')
										)}
										onChange={(e) => {
											onChange(e.value);
										}}
									/>
								);
							}}
						/>
					</FormField>
					<FormField
						label='dyeing_supervisor'
						title='Supervisor'
						errors={errors}>
						<Controller
							name={'dyeing_supervisor'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Dyeing Supervisor'
										options={dyeing_supervisor_option}
										value={dyeing_supervisor_option?.find(
											(item) =>
												item.value ===
												getValues('dyeing_supervisor')
										)}
										onChange={(e) => {
											onChange(e.value);
										}}
									/>
								);
							}}
						/>
					</FormField>
				</div>
			</SectionEntryBody>
			<SectionEntryBody title='Conneing'>
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
						title='Machine'
						errors={errors}>
						<Controller
							name='coning_machines'
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Machine'
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
