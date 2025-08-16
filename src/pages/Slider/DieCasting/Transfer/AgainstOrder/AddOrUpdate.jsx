import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import {
	useSliderDashboardInfo,
	useSliderDieCastingTransferAgainstOrderByUUID,
} from '@/state/Slider';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, JoinInput, ReactSelect } from '@/ui';

import {
	SLIDER_DIE_CASTING_TRANSFER_AGAINST_ORDER_UPDATE,
	SLIDER_DIE_CASTING_TRANSFER_AGAINST_ORDER_UPDATE_NULL,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	update = {
		uuid: null,
	},
	setUpdate,
}) {
	const { data, url, updateData } =
		useSliderDieCastingTransferAgainstOrderByUUID(update?.uuid);
	const { invalidateQuery } = useSliderDashboardInfo();
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
	} = useRHF(
		SLIDER_DIE_CASTING_TRANSFER_AGAINST_ORDER_UPDATE,
		SLIDER_DIE_CASTING_TRANSFER_AGAINST_ORDER_UPDATE_NULL
	);

	// const { data: order } = useOtherSliderStockWithDescription();

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
		reset(SLIDER_DIE_CASTING_TRANSFER_AGAINST_ORDER_UPDATE_NULL);
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
			title={
				update?.uuid !== null
					? 'Update Against Order > Slider Assembly'
					: ''
			}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			formContext={context}
			isSmall={true}
		>
			<FormField label='stock_uuid' title='Type' errors={errors}>
				<Controller
					name={'stock_uuid'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Type'
								// options={order}
								value={{
									value: getValues('stock_uuid'),
									label: getValues('order_item_description'),
								}}
								onChange={(e) => {
									onChange(e.value);
								}}
								isDisabled={update?.uuid !== null}
							/>
						);
					}}
				/>
			</FormField>

			<JoinInput
				title='Production Quantity'
				label='trx_quantity'
				unit='PCS'
				sub_label={`MAX: ${Number(getValues('max_quantity'))} PCS`}
				{...{ register, errors }}
			/>
			<JoinInput
				title='Production Weight'
				label='weight'
				unit='KG'
				sub_label={`MAX: ${Number(getValues('max_weight'))} KG`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
