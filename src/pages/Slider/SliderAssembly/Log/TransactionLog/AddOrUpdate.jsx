import { useEffect } from 'react';
import {
	useSliderAssemblyProduction,
	useSliderAssemblyTransferEntryByUUID,
} from '@/state/Slider';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { Input, JoinInput } from '@/ui';

import { DevTool } from '@/lib/react-hook-devtool';
import {
	NUMBER_DOUBLE_REQUIRED,
	NUMBER_REQUIRED,
	SLIDER_ASSEMBLY_TRANSACTION_NULL,
	SLIDER_ASSEMBLY_TRANSACTION_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateSliderTrx = {
		uuid: null,
		stock_uuid: null,
		from_section: null,
		to_section: null,
		max_trx_to_finishing_quantity: null,
		trx_quantity: null,
		remarks: '',
	},
	setUpdateSliderTrx,
}) {
	const { data, updateData, url } = useSliderAssemblyTransferEntryByUUID(
		updateSliderTrx?.uuid
	);

	const { invalidateQuery } = useSliderAssemblyProduction();
	const {
		register,
		handleSubmit,
		errors,
		control,
		Controller,
		reset,
		getValues,
		context,
	} = useRHF(
		{
			...SLIDER_ASSEMBLY_TRANSACTION_SCHEMA,
			trx_quantity: NUMBER_REQUIRED.max(
				updateSliderTrx?.max_sa_quantity,
				'Beyond Max Quantity'
			),
			weight: NUMBER_DOUBLE_REQUIRED,
		},
		SLIDER_ASSEMBLY_TRANSACTION_NULL
	);

	// * To reset the form with the fetched data
	useEffect(() => {
		if (data) {
			reset(data); // Reset the form with the fetched data
		}
	}, [data, reset]);

	const onClose = () => {
		setUpdateSliderTrx((prev) => ({
			...prev,
			uuid: null,
			stock_uuid: null,
			from_section: null,
			to_section: null,
			max_trx_to_finishing_quantity: null,
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

			invalidateQuery();
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
			isSmall={true}
		>
			<JoinInput
				label='trx_quantity'
				unit='PCS'
				sub_label={`Max: ${Number(updateSliderTrx?.max_sa_quantity)} PCS`}
				{...{ register, errors }}
			/>
			<JoinInput
				label='weight'
				unit='KG'
				sub_label={`Max: ${Number(updateSliderTrx?.max_sa_quantity)} KG`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
