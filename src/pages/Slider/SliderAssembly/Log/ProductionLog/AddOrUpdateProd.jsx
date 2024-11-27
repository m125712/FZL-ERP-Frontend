import { useEffect } from 'react';
import { useSliderAssemblyProduction, useSliderAssemblyProductionEntryByUUID } from '@/state/Slider';
import { DevTool } from '@hookform/devtools';
import { Weight } from 'lucide-react';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, JoinInput, ReactSelect } from '@/ui';

import {
	NUMBER_REQUIRED,
	SLIDER_ASSEMBLY_PRODUCTION_ENTRY_NULL,
	SLIDER_ASSEMBLY_PRODUCTION_ENTRY_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateSliderProd = {
		uuid: null,
	},
	setUpdateSliderProd,
}) {
	const { data, updateData, url } = useSliderAssemblyProductionEntryByUUID(
		updateSliderProd?.uuid
	);
	const { invalidateQuery } = useSliderAssemblyProduction();
	const MAX_QUANTITY = Math.floor(Number(updateSliderProd?.max_sa_quantity));
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
			...SLIDER_ASSEMBLY_PRODUCTION_ENTRY_SCHEMA,
			production_quantity: NUMBER_REQUIRED.max(
				MAX_QUANTITY,
				'Beyond Max Quantuty'
			).moreThan(0, 'More than 0'),
		},
		SLIDER_ASSEMBLY_PRODUCTION_ENTRY_NULL
	);

	// * To reset the form with the fetched data
	useEffect(() => {
		if (data) {
			reset(data); // Reset the form with the fetched data
		}
	}, [data, reset]);

	const onClose = () => {
		setUpdateSliderProd((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(SLIDER_ASSEMBLY_PRODUCTION_ENTRY_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateSliderProd?.uuid !== null) {
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

	return (
		<AddModal
			id={modalId}
			title={`Production Log`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			subTitle={`
				${updateSliderProd.order_number} -> 
				${updateSliderProd.item_name} 
				`}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				label='production_quantity'
				unit='PCS'
				sub_label={`Max: ${MAX_QUANTITY}`}
				{...{ register, errors }}
			/>
			<JoinInput
				label='weight'
				unit='KG'
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
