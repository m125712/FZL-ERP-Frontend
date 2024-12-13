import { useEffect } from 'react';
import {
	useOtherOrderBatchDescription,
	useOtherSliderItem,
} from '@/state/Other';
import {
	useSliderDieCastingProduction,
	useSliderDieCastingProductionByUUID,
	useSliderDieCastingStock,
} from '@/state/Slider';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, JoinInput, ReactSelect, Textarea } from '@/ui';

import {
	SLIDER_DIE_CASTING_PRODUCT_EDIT_NULL,
	SLIDER_DIE_CASTING_PRODUCT_EDIT_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	update = {
		uuid: null,
	},
	setUpdate,
}) {
	const { url, updateData } = useSliderDieCastingProduction();
	const { data } = useSliderDieCastingProductionByUUID(update?.uuid, {
		enabled: true,
	});
	const { invalidateQuery } = useSliderDieCastingStock();

	const { data: slider_item_name } = useOtherSliderItem();
	const { data: orders } = useOtherOrderBatchDescription();
	const {
		register,
		handleSubmit,
		errors,
		reset,
		getValues,
		context,
		Controller,
		control,
		watch,
	} = useRHF(
		SLIDER_DIE_CASTING_PRODUCT_EDIT_SCHEMA,
		SLIDER_DIE_CASTING_PRODUCT_EDIT_NULL
	);

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data, reset]);

	const onClose = () => {
		setUpdate((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(SLIDER_DIE_CASTING_PRODUCT_EDIT_NULL);
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
				url: `${url}/${update?.uuid}`,
				updatedData,
				onClose,
			});

			invalidateQuery();
			return;
		}
	};

	return (
		<AddModal
			id={modalId}
			title='Production Update'
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			formContext={context}
			isSmall={true}>
			<FormField
				title='Item'
				label={`die_casting_uuid`}
				register={register}
				dynamicerror={errors?.die_casting_uuid}>
				<Controller
					name={`die_casting_uuid`}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Item'
								options={slider_item_name}
								value={slider_item_name?.filter(
									(inItem) =>
										inItem.value ==
										getValues(`die_casting_uuid`)
								)}
								onChange={(e) => {
									onChange(e.value);
								}}
								isDisabled={update?.uuid !== null}
								menuPortalTarget={document.body}
							/>
						);
					}}
				/>
			</FormField>

			<FormField
				title='Finishing Batch'
				label={`finishing_batch_uuid`}
				register={register}
				dynamicerror={errors?.finishing_batch_uuid}>
				<Controller
					name={`finishing_batch_uuid`}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Order'
								options={orders}
								value={orders?.filter(
									(inItem) =>
										inItem.value ==
										getValues(`finishing_batch_uuid`)
								)}
								onChange={(e) => {
									onChange(e.value);
								}}
								isDisabled={update?.uuid !== null}
								menuPortalTarget={document.body}
							/>
						);
					}}
				/>
			</FormField>

			<div className='flex gap-2'>
				<Input
					label={`mc_no`}
					register={register}
					dynamicerror={errors?.mc_no}
				/>
				<Input
					label={`cavity_goods`}
					register={register}
					dynamicerror={errors?.cavity_goods}
				/>
				<Input
					label={`cavity_defect`}
					register={register}
					dynamicerror={errors?.cavity_defect}
				/>
			</div>
			<div className='flex gap-2'>
				<Input
					label={`push`}
					register={register}
					dynamicerror={errors?.push}
				/>
				<JoinInput
					label={`weight`}
					unit='KG'
					register={register}
					{...{ register, errors }}
				/>
				<JoinInput
					title='Production Quantity'
					label='production_quantity'
					value={watch('cavity_goods') * watch('push')}
					unit='PCS'
					disabled={true}
					{...{ register, errors }}
				/>
			</div>
			<Textarea label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
