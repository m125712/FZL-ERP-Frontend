import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import {
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
		stock_uuid: null,
		production_quantity: null,
		section: null,
		wastage: null,
		remarks: '',
	},
	setUpdateSliderProd,
}) {
	const { data, updateData, url } = useSliderAssemblyStockProductionByUUID(
		updateSliderProd?.uuid
	);
	const { invalidateQuery } = useSliderAssemblyStock();
	const { user } = useAuth();

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
			}),
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
			stock_uuid: null,
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
				updated_by: user?.uuid,
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
	const with_link = [
		{ label: 'Yes', value: 1 },
		{ label: 'No', value: 0 },
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
			isSmall={true}
		>
			<FormField label='with_link' title='Link' errors={errors}>
				<Controller
					name={'with_link'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Logo Type'
								options={with_link}
								value={with_link?.filter(
									(with_link) =>
										with_link.value ==
										getValues('with_link')
								)}
								onChange={(e) => onChange(e.value)}
								// isDisabled={order_info_id !== undefined}
							/>
						);
					}}
				/>
			</FormField>
			<JoinInput
				label='production_quantity'
				unit='PCS'
				sub_label={`Max: ${MAX_QUANTITY}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
