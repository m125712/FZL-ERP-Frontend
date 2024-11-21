import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useThreadDyesCategoryByUUID } from '@/state/Thread';
import { DevTool } from '@hookform/devtools';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, JoinInput, ReactSelect } from '@/ui';

import nanoid from '@/lib/nanoid';
import {
	THREAD_DYES_CATEGORY_NULL,
	THREAD_DYES_CATEGORY_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	update = {
		uuid: null,
	},
	setUpdate,
}) {
	const { data, url, updateData, postData } = useThreadDyesCategoryByUUID(
		update?.uuid
	);
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
	} = useRHF(THREAD_DYES_CATEGORY_SCHEMA, THREAD_DYES_CATEGORY_NULL);

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data]);

	const bleaching = [
		{ label: 'Bleach', value: 'bleach' },
		{ label: 'Non-Bleach', value: 'non-bleach' },
	];
	const onClose = () => {
		setUpdate((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(THREAD_DYES_CATEGORY_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (update?.uuid !== null && update?.uuid !== undefined) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
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
			url: '/thread/dyes-category',
			newData: updatedData,
			onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={
				update?.uuid !== null ? 'Update Dyes Category' : 'Dyes Category'
			}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<Input label='name' title='Category' {...{ register, errors }} />
			<div className='flex flex-col gap-2 md:flex-row'>
				<Input label='id' title='Program' {...{ register, errors }} />

				<FormField label='bleaching' title='Bleaching' errors={errors}>
					<Controller
						name={'bleaching'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Bleaching'
									options={bleaching}
									value={bleaching?.filter(
										(item) =>
											item.value ===
											getValues('bleaching')
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

			<JoinInput
				label='upto_percentage'
				title='Dyes %'
				unit='%'
				{...{ register, errors }}
			/>

			<Input label='remarks' {...{ register, errors }} />

			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
