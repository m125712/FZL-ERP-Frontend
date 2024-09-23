import { useEffect } from 'react';
import { useSliderAssemblyProductionEntryByUUID } from '@/state/Slider';
import { DevTool } from '@hookform/devtools';
import * as yup from 'yup';
import { useRHF, useUpdateFunc } from '@/hooks';

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
		stock_uuid: null,
		coloring_stock: null,
		coloring_prod: null,
		production_quantity: null,
		section: null,
		wastage: null,
		remarks: '',
	},
	setUpdateSliderProd,
}) {
	const { data, updateData, url } = useSliderAssemblyProductionEntryByUUID(
		updateSliderProd?.uuid
	);

	const MAX_QUANTITY =
		updateSliderProd?.slider_assembly_prod + updateSliderProd?.trx_quantity;

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
				yup.ref('max_coloring_quantity'),
				'Beyond Max'
			),
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
			stock_uuid: null,
			coloring_stock: null,
			coloring_prod: null,
			production_quantity: null,
			section: null,
			wastage: null,
			remarks: '',
		}));
		reset(SLIDER_ASSEMBLY_PRODUCTION_ENTRY_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateSliderProd?.uuid !== null) {
			const updatedData = {
				...data,
				with_link: data.with_link ? 1 : 0,
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
			title={`Slider Assembly Production Log`}
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
				sub_label={`Max: ${Number(getValues('max_coloring_quantity'))}`}
				{...{ register, errors }}
			/>
			<JoinInput
				label='weight'
				unit='kg'
				sub_label={`Max: ${Number(getValues('max_coloring_quantity'))}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
