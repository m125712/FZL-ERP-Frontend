import { useEffect } from 'react';
import {
	useSliderDieCastingStock,
	useSliderDieCastingTransferAgainstStockByUUID,
} from '@/state/Slider';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { Input, JoinInput } from '@/ui';

import {
	SLIDER_DIE_CASTING_TRANSFER_AGAINST_STOCK_UPDATE,
	SLIDER_DIE_CASTING_TRANSFER_AGAINST_STOCK_UPDATE_NULL,
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
		useSliderDieCastingTransferAgainstStockByUUID(update?.uuid);
	const { invalidateQuery } = useSliderDieCastingStock();

	const { register, handleSubmit, errors, reset, getValues, context } =
		useRHF(
			SLIDER_DIE_CASTING_TRANSFER_AGAINST_STOCK_UPDATE,
			SLIDER_DIE_CASTING_TRANSFER_AGAINST_STOCK_UPDATE_NULL
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
		reset(SLIDER_DIE_CASTING_TRANSFER_AGAINST_STOCK_UPDATE_NULL);
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
					? 'Update Against Stock > Slider Assembly'
					: ''
			}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			formContext={context}
			isSmall={true}>
			<JoinInput
				title='Production Quantity'
				label='quantity'
				unit='PCS'
				sub_label={`MAX: ${Number(getValues('max_quantity'))} PCS`}
				{...{ register, errors }}
			/>
			<JoinInput
				title='Production weight'
				label='weight'
				unit='KH'
				sub_label={`MAX: ${Number(getValues('max_weight'))} KH`}
				{...{ register, errors }}
			/>

			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
