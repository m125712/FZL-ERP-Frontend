import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useOtherMaterial, useOtherSliderDieCastingType } from '@/state/Other';
import {
	useSliderAssemblyStock,
	useSliderAssemblyStockByUUID,
} from '@/state/Slider';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, ReactSelect, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import {
	SLIDER_ASSEMBLY_STOCK_NULL,
	SLIDER_ASSEMBLY_STOCK_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateStock = {
		uuid: null,
	},
	setUpdateStock,
}) {
	const { url, updateData, postData } = useSliderAssemblyStock();
	const {
		register,
		handleSubmit,
		Controller,
		control,
		errors,
		getValues,
		reset,
		context,
	} = useRHF(SLIDER_ASSEMBLY_STOCK_SCHEMA, SLIDER_ASSEMBLY_STOCK_NULL);

	const { data: body } = useOtherSliderDieCastingType('body');
	const { data: puller } = useOtherSliderDieCastingType('puller');
	const { data: cap } = useOtherSliderDieCastingType('cap');
	const { data: link } = useOtherSliderDieCastingType('link');
	const { data: materials } = useOtherMaterial();
	const { data } = useSliderAssemblyStockByUUID(updateStock?.uuid);

	const { user } = useAuth();

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data]);

	const onClose = () => {
		setUpdateStock((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(SLIDER_ASSEMBLY_STOCK_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateStock?.uuid !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateStock?.uuid}`,
				uuid: updateStock?.uuid,
				updatedData,
				onClose,
			});

			return;
		}
		// Add new item
		const newData = {
			...data,
			quantity: 0,
			created_by: user?.uuid,
			created_at: GetDateTime(),
			uuid: nanoid(),
		};

		delete newData['updated_at'];

		await postData.mutateAsync({
			url,
			newData,
			onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={updateStock?.uuid !== null ? 'Update Stock' : 'Create Stock'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
		>
			{/* NAME , ITEM , ZIPPER NUMBER */}
			<div className='flex gap-4'>
				<Input
					label='name'
					placeholder='Enter Name'
					{...{ register, errors }}
				/>
				<FormField
					label='material_uuid'
					title='Material'
					errors={errors}
				>
					<Controller
						name={'material_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select material'
									options={materials}
									value={materials?.filter(
										(item) =>
											item.value ==
											getValues('material_uuid')
									)}
									onChange={(e) => onChange(e.value)}
									// isDisabled={order_info_id !== undefined}
								/>
							);
						}}
					/>
				</FormField>
			</div>
			<div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
				{/* Body */}
				<FormField
					label='die_casting_body_uuid'
					title='Body'
					errors={errors}
				>
					<Controller
						name={'die_casting_body_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select body'
									options={body}
									value={body?.filter(
										(item) =>
											item.value ==
											getValues('die_casting_body_uuid')
									)}
									onChange={(e) => onChange(e.value)}
									// isDisabled={order_info_id !== undefined}
								/>
							);
						}}
					/>
				</FormField>

				{/* Puller */}
				<FormField
					label='die_casting_puller_uuid'
					title='Puller'
					errors={errors}
				>
					<Controller
						name={'die_casting_puller_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select puller'
									options={puller}
									value={puller?.filter(
										(item) =>
											item.value ==
											getValues('die_casting_puller_uuid')
									)}
									onChange={(e) => onChange(e.value)}
									// isDisabled={order_info_id !== undefined}
								/>
							);
						}}
					/>
				</FormField>

				{/* Cap */}

				<FormField
					label='die_casting_cap_uuid'
					title='Cap'
					errors={errors}
				>
					<Controller
						name={'die_casting_cap_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select cap'
									options={cap}
									value={cap?.filter(
										(end_type) =>
											end_type.value ==
											getValues('die_casting_cap_uuid')
									)}
									onChange={(e) => {
										onChange(e.value);
									}}
									// isDisabled={order_info_id !== undefined}
								/>
							);
						}}
					/>
				</FormField>

				{/* Link */}
				<FormField
					label='die_casting_link_uuid'
					title='Link'
					errors={errors}
				>
					<Controller
						name={'die_casting_link_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select link'
									options={link}
									value={link?.filter(
										(puller_type) =>
											puller_type.value ==
											getValues('die_casting_link_uuid')
									)}
									onChange={(e) => onChange(e.value)}
									// isDisabled={order_info_id !== undefined}
								/>
							);
						}}
					/>
				</FormField>
			</div>

			{/* REMARKS */}
			<Textarea
				label='remarks'
				placeholder='Enter remarks'
				rows={3}
				{...{ register, errors }}
			/>
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
