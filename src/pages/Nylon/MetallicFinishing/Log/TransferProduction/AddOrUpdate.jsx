import { useEffect } from 'react';
import {
	useNylonMFProduction,
	useNylonMFProductionLog,
	useNylonMFProductionLogByUUID,
} from '@/state/Nylon';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, JoinInput, ReactSelect, Textarea } from '@/ui';

import {
	NUMBER,
	NUMBER_DOUBLE_REQUIRED,
	NUMBER_REQUIRED,
	SFG_PRODUCTION_LOG_NULL,
	SFG_PRODUCTION_LOG_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateProductionLog = {
		uuid: null,
		order_entry_uuid: null,
		order_description: null,
		item_description: null,
		order_number: null,
		section: null,
		production_quantity: null,
		teeth_coloring_stock: null,
		wastage: null,
	},
	setUpdateProductionLog,
}) {
	const { invalidateQuery } = useNylonMFProduction(
		updateProductionLog.uuid !== null
	);
	const { updateData } = useNylonMFProductionLog();
	const { data: dataByUUID } = useNylonMFProductionLogByUUID(
		updateProductionLog.uuid,
		{
			enabled: updateProductionLog.uuid !== null,
		}
	);

	const MAX_QUANTITY =
		Math.min(
			Number(updateProductionLog?.balance_quantity),
			Number(updateProductionLog?.slider_finishing_stock)
		) + Number(dataByUUID?.production_quantity);



	const MAX_PROD_KG = Number(updateProductionLog?.nylon_metallic_finishing)+ Number(dataByUUID?.production_quantity_in_kg);

	const schema = {
		...SFG_PRODUCTION_LOG_SCHEMA,
		production_quantity: NUMBER_REQUIRED.moreThan(0).max(MAX_QUANTITY),
		production_quantity_in_kg: NUMBER_DOUBLE_REQUIRED.moreThan(
			0,
			'More Than 0'
		),
		wastage: NUMBER.min(0, 'Minimum Of 0'),
	};

	const {
		register,
		handleSubmit,
		errors,
		control,
		Controller,
		reset,
		context,
	} = useRHF(schema, SFG_PRODUCTION_LOG_NULL);

	useEffect(() => {
		if (dataByUUID) {
			reset(dataByUUID);
		}
	}, [dataByUUID]);

	const onClose = () => {
		setUpdateProductionLog((prev) => ({
			...prev,
			uuid: null,
			order_entry_uuid: null,
			order_description: null,
			item_description: null,
			order_number: null,
			section: null,
			production_quantity: null,
			teeth_coloring_stock: null,
			wastage: null,
		}));
		reset(SFG_PRODUCTION_LOG_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateProductionLog?.uuid !== null) {
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

	const sectionName = [
		{ label: 'Dying and Iron', value: 'dying_and_iron' },
		{ label: 'Teeth Molding', value: 'teeth_molding' },
		{ label: 'Teeth Cleaning', value: 'teeth_cleaning' },
		{ label: 'Teeth Coloring', value: 'teeth_coloring' },
		{ label: 'Finishing', value: 'finishing' },
		{ label: 'Slider Assembly', value: 'slider_assembly' },
		{ label: 'Coloring', value: 'coloring' },
	];

	return (
		<AddModal
			id={modalId}
			title={`Production Log`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
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
										item.value ==
										updateProductionLog?.section
								)}
								onChange={(e) => onChange(e.value)}
								isDisabled={updateProductionLog?.uuid !== null}
							/>
						);
					}}
				/>
			</FormField>
			<JoinInput
				title='Production Quantity'
				label='production_quantity'
				sub_label={`MAX: ${MAX_QUANTITY} pcs`}
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
				sub_label={`MAX: ${'MAX_WASTAGE_KG'} kg`}
				unit='KG'
				{...{ register, errors }}
				{...{ register, errors }}
			/>
			<Textarea label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
