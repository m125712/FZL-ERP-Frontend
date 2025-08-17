import { useAuth } from '@/context/auth';
import { useLibraryPolicy } from '@/state/Library';
import { useFetchForRhfReset, useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, ReactSelect } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import { POLICY_NULL, POLICY_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updatePolicy = {
		uuid: null,
	},
	setUpdatePolicy,
}) {
	const {
		url,
		updateData,
		postData,
		invalidateQuery: invalidateLibraryPolicy,
	} = useLibraryPolicy();
	const { user } = useAuth();
	const typeOption = [
		{ label: 'Policy', value: 'policy' },
		{ label: 'Notice', value: 'notice' },
	];
	const statusOption = [
		{ label: 'Active', value: 1 },
		{ label: 'Inactive', value: 0 },
	];
	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		getValues,
		Controller,
		context,
	} = useRHF(POLICY_SCHEMA, POLICY_NULL);

	useFetchForRhfReset(
		`${url}/${updatePolicy?.uuid}`,
		updatePolicy?.uuid,
		reset
	);

	const onClose = () => {
		setUpdatePolicy((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(POLICY_NULL);
		window[modalId].close();
	};
	const onSubmit = async (data) => {
		// Update item
		if (updatePolicy?.uuid !== null && updatePolicy?.uuid !== undefined) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
				updated_by: user?.uuid,
			};

			await updateData.mutateAsync({
				url: `${url}/${updatePolicy?.uuid}`,
				uuid: updatePolicy?.uuid,
				updatedData,
				onClose,
			});

			return;
		}
		const updatedData = {
			...data,
			uuid: nanoid(),
			created_at: GetDateTime(),
			created_by: user?.uuid,
		};

		await postData.mutateAsync({
			url,
			newData: updatedData,
			onClose,
		});
		invalidateLibraryPolicy();
	};

	return (
		<AddModal
			id={modalId}
			title={updatePolicy?.uuid !== null ? 'Update Policy' : 'Policy'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<FormField label='type' title='Type' errors={errors}>
				<Controller
					name={'type'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select type'
								options={typeOption}
								value={typeOption?.filter(
									(item) => item.value === getValues('type')
								)}
								onChange={(e) => {
									onChange(e.value);
								}}
							/>
						);
					}}
				/>
			</FormField>
			<Input label='title' {...{ register, errors }} />
			<Input label='sub_title' {...{ register, errors }} />
			<FormField label='status' title='Status' errors={errors}>
				<Controller
					name={'status'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select type'
								options={statusOption}
								value={statusOption?.filter(
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
			<Input label='url' {...{ register, errors }} />
			<Input label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
