import { useAuth } from '@/context/auth';
import { useCommonTapeRequired } from '@/state/Common';
import { DevTool } from '@hookform/devtools';
import { useFetch, useFetchForRhfReset, useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, ReactSelect, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import { TAPE_REQUIRED_NULL, TAPE_REQUIRED_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateTapeRequired = {
		uuid: null,
	},
	setUpdateTapeRequired,
}) {
	const { url, updateData, postData } = useCommonTapeRequired();
	const { user } = useAuth();
	const {
		register,
		handleSubmit,
		errors,
		reset,
		Controller,
		control,
		getValues,
		watch,
		context,
	} = useRHF(TAPE_REQUIRED_SCHEMA, TAPE_REQUIRED_NULL);

	useFetchForRhfReset(
		`${url}/${updateTapeRequired?.uuid}`,
		updateTapeRequired?.uuid,
		reset
	);

	const { value: end_type } = useFetch(`/other/order-properties/by/end_type`);
	const { value: item } = useFetch(`/other/order-properties/by/item`);
	const { value: zipper_number } = useFetch(
		`/other/order-properties/by/zipper_number`
	);
	const { value: nylon_stop } = useFetch(
		`/other/order-properties/by/nylon_stopper`
	);

	const onClose = () => {
		setUpdateTapeRequired((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(TAPE_REQUIRED_NULL);
		window[modalId].close();
	};

	console.log(getValues());

	const onSubmit = async (data) => {
		// Update item
		if (
			updateTapeRequired?.uuid !== null &&
			updateTapeRequired?.uuid !== undefined
		) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateTapeRequired?.uuid}`,
				uuid: updateTapeRequired?.uuid,
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
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url,
			newData: updatedData,
			onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={
				updateTapeRequired?.uuid !== null
					? 'Update TAPE_REQUIRED'
					: 'TAPE_REQUIRED'
			}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<div className='flex gap-1'>
				<FormField label='item_uuid' title='Item' errors={errors}>
					<Controller
						name={'item_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Item'
									options={item}
									value={item?.filter(
										(item) =>
											item.value ===
											getValues('item_uuid')
									)}
									onChange={(e) => onChange(e.value)}
								/>
							);
						}}
					/>
				</FormField>
				<FormField
					label='nylon_stopper_uuid'
					title='Nylon Stopper'
					errors={errors}>
					<Controller
						name={'nylon_stopper_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Nylon Stopper'
									options={nylon_stop}
									value={nylon_stop?.filter(
										(item) =>
											item.value ===
											getValues('nylon_stopper_uuid')
									)}
									onChange={(e) => onChange(e.value)}
								/>
							);
						}}
					/>
				</FormField>
			</div>
			<div className='flex gap-1'>
				<FormField
					label='zipper_number_uuid'
					title='Zipper Number'
					errors={errors}>
					<Controller
						name={'zipper_number_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Zipper Number'
									options={zipper_number}
									value={zipper_number?.filter(
										(item) =>
											item.value ===
											getValues('zipper_number_uuid')
									)}
									onChange={(e) => onChange(e.value)}
								/>
							);
						}}
					/>
				</FormField>
				<FormField
					label='end_type_uuid'
					title='End_type'
					errors={errors}>
					<Controller
						name={'end_type_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select End'
									options={end_type}
									value={end_type?.filter(
										(item) =>
											item.value ===
											getValues('end_type_uuid')
									)}
									onChange={(e) => onChange(e.value)}
								/>
							);
						}}
					/>
				</FormField>
			</div>

			<div className='flex gap-1'>
				<Input label='top' {...{ register, errors }} />
				<Input label='bottom' {...{ register, errors }} />
				<Input
					label='raw_mtr_per_kg'
					title='Raw (mtr/kg)'
					{...{ register, errors }}
				/>
				<Input
					label='dyed_mtr_per_kg'
					title='Dyed (mtr/kg)'
					{...{ register, errors }}
				/>
			</div>

			<Textarea label='remarks' {...{ register, errors }} />

			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
