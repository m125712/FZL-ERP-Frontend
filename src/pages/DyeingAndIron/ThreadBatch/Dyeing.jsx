import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetch, useFetchForRhfReset, useRHF } from '@/hooks';

import { useDyeingThreadBatch } from '@/state/Dyeing';
import { FormField, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { DevTool } from '@hookform/devtools';
import {
	DYEING_THREAD_BATCH_DYEING_NULL,
	DYEING_THREAD_BATCH_DYEING_SCHEMA,
} from '@util/Schema';

export default function Index({
	modalId = '',
	dyeing = {
		uuid: null,
		batch_id: null,
		dyeing_operator: null,
		reason: null,
		category: null,
		status: null,
		pass_by: null,
		shift: null,
		dyeing_supervisor: null,
	},
	setDyeing,
}) {
	const { url, updateData } = useDyeingThreadBatch();

	const { user } = useAuth();

	//const MAX_QUANTITY = dyeing?.tape_making;

	// const schema = {
	// 	used_quantity: DYEING_THREAD_BATCH_DYEING_SCHEMA.remaining.max(dyeing?.tape_making),
	// 	wastage: DYEING_THREAD_BATCH_DYEING_SCHEMA.remaining.max(
	// 		MAX_QUANTITY,
	// 		'Must be less than or equal ${MAX_QUANTITY}'
	// 	),
	// };

	const {
		register,
		handleSubmit,
		errors,
		reset,
		watch,
		control,
		getValues,
		Controller,
	} = useRHF(
		//schema,
		DYEING_THREAD_BATCH_DYEING_SCHEMA,
		DYEING_THREAD_BATCH_DYEING_NULL
	);

	useFetchForRhfReset(`${url}/${dyeing?.uuid}`, dyeing?.uuid, reset);

	const { value: dyeing_operator_option } = useFetch(
		'/other/hr/user/value/label'
	);
	const { value: pass_by_option } = useFetch('/other/hr/user/value/label');
	const { value: dyeing_supervisor_option } = useFetch(
		'/other/hr/user/value/label'
	);

	const reasonOption = [
		{ label: 'MC_pressure problem ect', value: 'mc_pressure_problem_ect' },
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

	const onClose = () => {
		setDyeing((prev) => ({
			...prev,
			uuid: null,
			batch_id: null,
			dyeing_operator: null,
			reason: null,
			category: null,
			status: null,
			pass_by: null,
			shift: null,
			dyeing_supervisor: null,
		}));
		reset(DYEING_THREAD_BATCH_DYEING_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		if (dyeing?.dyeing_operator !== null) {
			const updatedData = {
				...data,
				uuid: dyeing?.uuid,
				dyeing_updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${dyeing?.uuid}`,
				uuid: dyeing?.uuid,
				updatedData,
				onClose,
			});

			return;
		} else {
			const updatedData = {
				...data,
				dyeing_created_at: GetDateTime(),
				dyeing_created_by: user?.uuid,
			};

			await updateData.mutateAsync({
				url: `${url}/${dyeing?.uuid}`,
				uuid: dyeing?.uuid,
				updatedData,
				onClose,
			});

			return;
		}
	};

	return (
		<AddModal
			id={modalId}
			title={
				dyeing?.dyeing_operator !== null
					? `Update Dyeing on ${dyeing?.batch_id} `
					: `Dyeing Issue on ${dyeing?.batch_id} `
			}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<FormField
				label='dyeing_operator'
				title='Dyeing Operator'
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
									(item) => item.value === getValues('reason')
								)}
								onChange={(e) => {
									onChange(e.value);
								}}
							/>
						);
					}}
				/>
			</FormField>
			<FormField label='category' title='Category' errors={errors}>
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
										item.value === getValues('category')
								)}
								onChange={(e) => {
									onChange(e.value);
								}}
							/>
						);
					}}
				/>
			</FormField>
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
									(item) => item.value === getValues('status')
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
										item.value === getValues('pass_by')
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
									(item) => item.value === getValues('shift')
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
				title='Dyeing Supervisor'
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
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
