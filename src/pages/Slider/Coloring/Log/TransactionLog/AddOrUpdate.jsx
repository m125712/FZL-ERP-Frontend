import { AddModal } from '@/components/Modal';
import { useRHF, useUpdateFunc } from '@/hooks';
import { FormField, Input, JoinInput, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import {
	SLIDER_ASSEMBLY_TRANSACTION_SCHEMA,
	SLIDER_ASSEMBLY_TRANSACTION_NULL,
} from '@util/Schema';
import { useSliderAssemblyTransferEntryByUUID } from '@/state/Slider';
import { useEffect } from 'react';
import { DevTool } from '@hookform/devtools';

export default function Index({
	modalId = '',
	updateSliderTrx = {
		uuid: null,
		stock_uuid: null,
		slider_item_uuid: null,
		trx_from: null,
		trx_to: null,
		trx_quantity: null,
		remarks: '',
	},
	setUpdateSliderTrx,
}) {
	const { data, updateData, url } = useSliderAssemblyTransferEntryByUUID(
		updateSliderTrx?.uuid
	);

	const MAX_QUANTITY =
		updateSliderTrx?.slider_assembly_prod + updateSliderTrx?.trx_quantity;

	const {
		register,
		handleSubmit,
		errors,
		control,
		Controller,
		reset,
		getValues,
		context
	} = useRHF(
		SLIDER_ASSEMBLY_TRANSACTION_SCHEMA,
		SLIDER_ASSEMBLY_TRANSACTION_NULL
	);

	// * To reset the form with the fetched data
	useEffect(() => {
		if (data) {
			reset(data[0]); // Reset the form with the fetched data
		}
	}, [data, reset]);

	const onClose = () => {
		setUpdateSliderTrx((prev) => ({
			...prev,
			uuid: null,
			stock_uuid: null,
			slider_item_uuid: null,
			trx_from: null,
			trx_to: null,
			trx_quantity: null,
			remarks: '',
		}));
		reset(SLIDER_ASSEMBLY_TRANSACTION_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateSliderTrx?.uuid !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url,
				updatedData: updatedData,
				onClose,
			});

			return;
		}
	};

	const transactionArea = [
		{ label: 'Dying and Iron', value: 'dying_and_iron_stock' },
		{ label: 'Teeth Molding', value: 'slider_assembly_stock' },
		{ label: 'Teeth Coloring', value: 'teeth_coloring_stock' },
		{ label: 'Finishing', value: 'finishing_stock' },
		{ label: 'Slider Assembly', value: 'slider_assembly_stock' },
		{ label: 'Coloring', value: 'coloring_stock' },
	];

	return (
		<AddModal
			id={modalId}
			title={`Slider Assembly Transaction Log`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			subTitle={`
				${updateSliderTrx.order_number} -> 
				${updateSliderTrx.item_name} 
				`}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				label='trx_quantity'
				unit='PCS'
				sub_label={`Max: ${MAX_QUANTITY}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
