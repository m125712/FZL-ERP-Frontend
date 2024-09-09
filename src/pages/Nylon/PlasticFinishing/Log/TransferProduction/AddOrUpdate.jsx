import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useRHF } from '@/hooks';
import {
	useNylonPlasticFinishingProduction,
	useNylonPlasticFinishingProductionLog,
	useNylonPlasticFinishingProductionLogByUUID,
} from '@/state/Nylon';
import { FormField, Input, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import {
	NUMBER_REQUIRED,
	SFG_PRODUCTION_LOG_NULL,
	SFG_PRODUCTION_LOG_SCHEMA,
} from '@util/Schema';
import { useEffect } from 'react';

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
			...SFG_PRODUCTION_LOG_SCHEMA,
			production_quantity: NUMBER_REQUIRED.max(
				MAX_PROD,
				'Beyond Max Quantity'
			),
			production_quantity_in_kg: NUMBER_REQUIRED.max(
				MAX_PROD_KG,
				'Beyond Max Quantity'
			),
		},
		SFG_PRODUCTION_LOG_NULL
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
		reset(SFG_PRODUCTION_LOG_NULL);
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
			<Input
				label='production_quantity'
				sub_label={`Max: ${MAX_PROD}`}
				{...{ register, errors }}
			/>
			<Input
				label='production_quantity_in_kg'
				sub_label={`Max: ${MAX_PROD_KG}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
