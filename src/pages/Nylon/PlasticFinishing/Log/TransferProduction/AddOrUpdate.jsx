import { useEffect } from 'react';
import {
	useNylonPlasticFinishingProduction,
	useNylonPlasticFinishingProductionLog,
	useNylonPlasticFinishingProductionLogByUUID,
} from '@/state/Nylon';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, JoinInput, ReactSelect, Textarea } from '@/ui';

import {
	NUMBER_DOUBLE_REQUIRED,
	NUMBER_REQUIRED,
	SFG_PRODUCTION_SCHEMA_IN_KG,
	SFG_PRODUCTION_SCHEMA_IN_KG_NULL,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updatePFProd = {
		uuid: null,
		sfg_uuid: null,
		section: null,
		production_quantity_in_kg: null,
		production_quantity: null,
		coloring_prod: null,
		nylon_plastic_finishing: null,
		finishing_prod: null,
		wastage: null,
		remarks: null,
	},
	setUpdatePFProd,
}) {
	const { invalidateQuery } = useNylonPlasticFinishingProduction();
	const { updateData } = useNylonPlasticFinishingProductionLog();
	const { data: dataByUUID } = useNylonPlasticFinishingProductionLogByUUID(
		updatePFProd.uuid,
		{
			enabled: updatePFProd.uuid !== null,
		}
	);

	const MAX_PROD = (
		Number(updatePFProd?.coloring_prod) +
		Number(updatePFProd?.production_quantity)
	).toFixed(3);
	const MAX_PROD_KG = Number(updatePFProd?.nylon_plastic_finishing).toFixed(
		3
	);

	const {
		register,
		handleSubmit,
		errors,
		reset,
		watch,
		control,
		Controller,
		context,
	} = useRHF(
		{
			...SFG_PRODUCTION_SCHEMA_IN_KG,

			production_quantity: NUMBER_REQUIRED.moreThan(0, 'More Than 0').max(
				MAX_PROD,
				'Beyond Max Quantity'
			),
			production_quantity_in_kg: NUMBER_DOUBLE_REQUIRED.moreThan(
				0,
				'More Than 0'
			).max(MAX_PROD_KG, 'Beyond Max Quantity'),
		},
		SFG_PRODUCTION_SCHEMA_IN_KG_NULL
	);

	const MAX_WASTAGE_KG = Number(
		MAX_PROD_KG - (watch('production_quantity_in_kg') || 0)
	).toFixed(3);

	useEffect(() => {
		if (dataByUUID) {
			console.log({
				dataByUUID,
			});
			reset(dataByUUID);
		}
	}, [dataByUUID]);

	const onClose = () => {
		setUpdatePFProd((prev) => ({
			...prev,
			uuid: null,
			sfg_uuid: null,
			section: null,
			production_quantity_in_kg: null,
			production_quantity: null,
			coloring_prod: null,
			nylon_plastic_finishing: null,
			finishing_prod: null,
			wastage: null,
			remarks: null,
		}));
		reset(SFG_PRODUCTION_SCHEMA_IN_KG_NULL);
		window[modalId].close();
	};

	const sectionName = [
		{ label: 'Dying and Iron', value: 'dying_and_iron' },
		{ label: 'Teeth Molding', value: 'teeth_molding' },
		{ label: 'Teeth Cleaning', value: 'teeth_cleaning' },
		{ label: 'Teeth Coloring', value: 'teeth_coloring' },
		{ label: 'Finishing', value: 'finishing' },
		{ label: 'Slider Assembly', value: 'slider_assembly' },
		{ label: 'Coloring', value: 'coloring' },
	];
	const onSubmit = async (data) => {
		// Update item
		if (updatePFProd?.uuid !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `/zipper/sfg-production/${updatedData?.uuid}`,
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
			title={`Nylon Plastic Finshing Transfer Log`}
			onSubmit={handleSubmit(onSubmit)}
			formContext={context}
			onClose={onClose}
			isSmall={true}>
			<FormField label='section' title='Section' errors={errors}>
				<Controller
					name={'section'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Production Area'
								options={sectionName}
								value={sectionName?.find(
									(item) =>
										item.value == updatePFProd?.section
								)}
								onChange={(e) => onChange(e.value)}
								isDisabled={updatePFProd?.uuid !== null}
							/>
						);
					}}
				/>
			</FormField>

			<JoinInput
				title='Production Quantity'
				label='production_quantity'
				sub_label={`MAX: ${MAX_PROD} pcs`}
				unit='PCS'
				{...{ register, errors }}
			/>
			<JoinInput
				title='Production Quantity (KG)'
				label='production_quantity_in_kg'
				sub_label={`MAX: ${MAX_PROD_KG} kg`}
				unit='KG'
				{...{ register, errors }}
			/>
			<JoinInput
				title='wastage'
				label='wastage'
				sub_label={`MAX: ${MAX_WASTAGE_KG} kg`}
				unit='KG'
				{...{ register, errors }}
				{...{ register, errors }}
			/>
			<Textarea label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
