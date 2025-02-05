import { useEffect } from 'react';
import {
	useSliderAssemblyProduction,
	useSliderAssemblyStock,
	useSliderAssemblyStockProductionByUUID,
} from '@/state/Slider';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, JoinInput, ReactSelect } from '@/ui';

import { DevTool } from '@/lib/react-hook-devtool';
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
	const { data, updateData, url } = useSliderAssemblyStockProductionByUUID(
		updateSliderProd?.uuid
	);
	const { invalidateQuery } = useSliderAssemblyStock();
	const { invalidateQuery: invalidateSliderAssembly } =
		useSliderAssemblyProduction();
	const {
		register,
		handleSubmit,
		errors,
		control,
		Controller,
		reset,
		getValues,
		context,
		watch,
	} = useRHF(
		{
			...SLIDER_ASSEMBLY_PRODUCTION_ENTRY_SCHEMA,
			production_quantity: NUMBER_REQUIRED.when('with_link', {
				is: true,
				then: (schema) =>
					schema.max(
						updateSliderProd.max_production_quantity_with_link,
						'Beyond Max Quantity'
					),
				otherwise: (schema) =>
					schema.max(
						updateSliderProd.max_production_quantity_without_link,
						'Beyond Max Quantity'
					),
			}).moreThan(0, 'More than 0'),
		},
		SLIDER_ASSEMBLY_PRODUCTION_ENTRY_NULL
	);

	const MAX_QUANTITY = watch('with_link')
		? Math.floor(Number(updateSliderProd.max_production_quantity_with_link))
		: Math.floor(
				Number(updateSliderProd.max_production_quantity_without_link)
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
				with_link: updateSliderProd.with_link,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url,
				updatedData: updatedData,
				onClose,
			});

			invalidateSliderAssembly();
			invalidateQuery();
			return;
		}
	};

	return (
		<AddModal
			id={modalId}
			title={`Stock Production Log`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			subTitle={`
				${updateSliderProd.order_number} -> 
				${updateSliderProd.item_name} 
				`}
			onClose={onClose}
			isSmall={true}
		>
			<JoinInput
				label='production_quantity'
				unit='PCS'
				sub_label={`Max: ${MAX_QUANTITY}`}
				{...{ register, errors }}
			/>
			<JoinInput label='weight' unit='KG' {...{ register, errors }} />
			<Input label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
