import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useThreadMachineByUUID } from '@/state/Thread';
import { DevTool } from '@hookform/devtools';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { CheckBox, Input } from '@/ui';

import nanoid from '@/lib/nanoid';
import { THREAD_MACHINE_NULL, THREAD_MACHINE_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateMachine = {
		uuid: null,
	},
	setUpdateMachine,
}) {
	const { data, url, updateData, postData } = useThreadMachineByUUID(
		updateMachine?.uuid
	);
	const { user } = useAuth();
	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		context,
		getValues,
		setValue,
		watch,
	} = useRHF(THREAD_MACHINE_SCHEMA, THREAD_MACHINE_NULL);

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data]);

	const onClose = () => {
		setUpdateMachine((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(THREAD_MACHINE_NULL);
		window[modalId].close();
	};
	const onSubmit = async (data) => {
		// Update item
		if (updateMachine?.uuid !== null && updateMachine?.uuid !== undefined) {
			const updatedData = {
				...data,
				is_nylon: data?.is_nylon ? 1 : 0,
				is_metal: data?.is_metal ? 1 : 0,
				is_vislon: data?.is_vislon ? 1 : 0,
				is_sewing_thread: data?.is_sewing_thread ? 1 : 0,
				is_bulk: data?.is_bulk ? 1 : 0,
				is_sample: data?.is_sample ? 1 : 0,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url,
				uuid: updateMachine?.uuid,
				updatedData,
				onClose,
			});

			return;
		}

		// Add new item
		const updatedData = {
			...data,
			uuid: nanoid(),
			is_nylon: data?.is_nylon ? 1 : 0,
			is_metal: data?.is_metal ? 1 : 0,
			is_vislon: data?.is_vislon ? 1 : 0,
			is_sewing_thread: data?.is_sewing_thread ? 1 : 0,
			is_bulk: data?.is_bulk ? 1 : 0,
			is_sample: data?.is_sample ? 1 : 0,
			created_by: user?.uuid,
			created_by_name: user?.name,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url: '/public/machine',
			newData: updatedData,
			onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={updateMachine?.uuid !== null ? 'Update Machine' : 'Machine'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<Input label='name' {...{ register, errors }} />
			<div className='m-2 flex items-center gap-1 text-sm'>
				<label className='text-sm text-primary'>Used For</label>
				<div className='w-1/4 rounded-md border border-secondary/30 bg-secondary px-1'>
					<CheckBox
						text='text-secondary-content'
						label='is_vislon'
						title='Vislon'
						height='h-[2.9rem]'
						defaultChecked={
							getValues('is_vislon') === 1 ||
							getValues('is_vislon') === true
								? setValue('is_vislon', true)
								: setValue('is_vislon', false)
						}
						onChange={(e) => {
							setValue('is_vislon', e.target.checked);
						}}
						{...{ register, errors }}
					/>
				</div>
				<div className='w-1/4 rounded-md border border-secondary/30 bg-secondary px-1'>
					<CheckBox
						text='text-secondary-content'
						label='is_metal'
						title='Metal'
						height='h-[2.9rem]'
						defaultChecked={
							getValues('is_metal') === 1 ||
							getValues('is_metal') === true
								? setValue('is_metal', true)
								: setValue('is_metal', false)
						}
						onChange={(e) => {
							setValue('is_metal', e.target.checked);
						}}
						{...{ register, errors }}
					/>
				</div>
				<div className='w-1/4 rounded-md border border-secondary/30 bg-secondary px-1'>
					<CheckBox
						text='text-secondary-content'
						label='is_nylon'
						title='Nylon'
						height='h-[2.9rem]'
						defaultChecked={
							getValues('is_nylon') === 1 ||
							getValues('is_nylon') === true
								? setValue('is_nylon', true)
								: setValue('is_nylon', false)
						}
						onChange={(e) => {
							setValue('is_nylon', e.target.checked);
						}}
						{...{ register, errors }}
					/>
				</div>
				<div className='rounded-md border border-secondary/30 bg-secondary px-1'>
					<CheckBox
						text='text-secondary-content'
						label='is_sewing_thread'
						title='Sewing Thread'
						height='h-[2.9rem]'
						defaultChecked={
							getValues('is_sewing_thread') === 1 ||
							getValues('is_sewing_thread') === true
								? setValue('is_sewing_thread', true)
								: setValue('is_sewing_thread', false)
						}
						onChange={(e) => {
							setValue('is_sewing_thread', e.target.checked);
						}}
						{...{ register, errors }}
					/>
				</div>
			</div>
			<div className='m-2 flex items-center gap-1 text-sm'>
				<label className='text-primary'>Purpose</label>
				<div className='w-1/2 rounded-md border border-secondary/30 bg-secondary px-1'>
					<CheckBox
						text='text-secondary-content'
						label='is_bulk'
						title='Bulk'
						height='h-[2.9rem]'
						defaultChecked={
							getValues('is_bulk') === 1 ||
							getValues('is_bulk') === true
								? setValue('is_bulk', true)
								: setValue('is_bulk', false)
						}
						onChange={(e) => {
							setValue('is_bulk', e.target.checked);
						}}
						{...{ register, errors }}
					/>
				</div>
				<div className='w-1/2 rounded-md border border-secondary/30 bg-secondary px-1'>
					<CheckBox
						text='text-secondary-content'
						label='is_sample'
						title='Sample'
						height='h-[2.9rem]'
						defaultChecked={
							getValues('is_sample') === 1 ||
							getValues('is_sample') === true
								? setValue('is_sample', true)
								: setValue('is_sample', false)
						}
						onChange={(e) => {
							setValue('is_sample', e.target.checked);
						}}
						{...{ register, errors }}
					/>
				</div>
			</div>
			<Input label='min_capacity' {...{ register, errors }} />
			<Input label='max_capacity' {...{ register, errors }} />
			<Input label='water_capacity' {...{ register, errors }} />
			<Input label='remarks' {...{ register, errors }} />

			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
