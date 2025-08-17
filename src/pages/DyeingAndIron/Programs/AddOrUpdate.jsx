import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import {
	useGetURLData,
	useOtherDyesCategory,
	useOtherMaterial,
} from '@/state/Other';
import { useThreadPrograms, useThreadProgramsByUUID } from '@/state/Thread';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, ReactSelect } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import { THREAD_PROGRAMS_NULL, THREAD_PROGRAMS_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	update = {
		uuid: null,
	},
	setUpdate,
}) {
	const { data, url, updateData, postData } = useThreadProgramsByUUID(
		update?.uuid
	);
	const { invalidateQuery: invalidateThreadPrograms } = useThreadPrograms();
	const { user } = useAuth();
	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		Controller,
		getValues,
		context,
	} = useRHF(THREAD_PROGRAMS_SCHEMA, THREAD_PROGRAMS_NULL);

	const { data: material } = useOtherMaterial();
	const { data: dyes } = useOtherDyesCategory();

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data]);

	const onClose = () => {
		setUpdate((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(THREAD_PROGRAMS_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (update?.uuid !== null && update?.uuid !== undefined) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
				updated_by: user?.uuid,
			};

			await updateData.mutateAsync({
				url,
				uuid: update?.uuid,
				updatedData,
				onClose,
			});

			return;
		}

		// Add new item
		const updatedData = {
			...data,
			uuid: nanoid(),
			created_by: user?.uuid,
			created_by_name: user?.name,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url: '/thread/programs',
			newData: updatedData,
			onClose,
		});
		invalidateThreadPrograms();
	};

	return (
		<AddModal
			id={modalId}
			title={update?.uuid !== null ? 'Update Programs' : 'Programs'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<FormField
				label='dyes_category_uuid'
				title='Dyes Category'
				errors={errors}
			>
				<Controller
					name={'dyes_category_uuid'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Dyes Category'
								options={dyes}
								value={dyes?.filter(
									(item) =>
										item.value ===
										getValues('dyes_category_uuid')
								)}
								onChange={(e) => {
									onChange(e.value);
								}}
							/>
						);
					}}
				/>
			</FormField>
			<FormField label='material_uuid' title='Material' errors={errors}>
				<Controller
					name={'material_uuid'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Material'
								options={material}
								value={material?.filter(
									(item) =>
										item.value ===
										getValues('material_uuid')
								)}
								onChange={(e) => {
									onChange(e.value);
								}}
							/>
						);
					}}
				/>
			</FormField>
			<Input label='quantity' {...{ register, errors }} />
			<Input label='remarks' {...{ register, errors }} />

			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
