import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import {
	useMetalTMProduction,
	useMetalTMProductionLog,
	useMetalTMProductionLogByUUID,
} from '@/state/Metal';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, JoinInput, ReactSelect } from '@/ui';

import {
	SFG_PRODUCTION_LOG_NULL,
	SFG_PRODUCTION_LOG_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateTeethMoldingLog = {
		uuid: null,
		order_entry_uuid: null,
		order_description: null,
		item_description: null,
		order_number: null,
		section: null,
		production_quantity: null,
		teeth_molding_stock: null,
		wastage: null,
	},
	setUpdateTeethMoldingLog,
}) {
	const { invalidateQuery } = useMetalTMProduction();
	const { updateData } = useMetalTMProductionLog();
	const { data: dataByUUID } = useMetalTMProductionLogByUUID(
		updateTeethMoldingLog.uuid,
		{
			enabled: updateTeethMoldingLog.uuid !== null,
		}
	);

	const MAX_QUANTITY =
		Number(updateTeethMoldingLog?.balance_quantity) +
		Number(dataByUUID?.production_quantity);

	const MAX_QUANTITY_IN_KG =
		Number(updateTeethMoldingLog?.teeth_molding_stock) +
		Number(updateTeethMoldingLog?.production_quantity_in_kg);

	const schema = {
		...SFG_PRODUCTION_LOG_SCHEMA,
		production_quantity: SFG_PRODUCTION_LOG_SCHEMA.production_quantity
			.max(MAX_QUANTITY),
		production_quantity_in_kg:
			SFG_PRODUCTION_LOG_SCHEMA.production_quantity_in_kg
				.max(MAX_QUANTITY_IN_KG),
	};
	const { user } = useAuth();
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
		setUpdateTeethMoldingLog((prev) => ({
			...prev,
			uuid: null,
			order_entry_uuid: null,
			order_description: null,
			item_description: null,
			order_number: null,
			section: null,
			production_quantity: null,
			teeth_molding_stock: null,
			wastage: null,
		}));
		reset(SFG_PRODUCTION_LOG_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateTeethMoldingLog?.uuid !== null) {
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
			title={`Teeth Molding Production Log`}
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
										updateTeethMoldingLog?.section
								)}
								onChange={(e) => onChange(e.value)}
								isDisabled={
									updateTeethMoldingLog?.uuid !== null
								}
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
				title='Production Quantity In KG'
				label='production_quantity_in_kg'
				sub_label={`MAX: ${MAX_QUANTITY_IN_KG} kg`}
				unit='PCS'
				{...{ register, errors }}
			/>
			<JoinInput
				title='Wastage'
				label='wastage'
				sub_label={`MAX: ${MAX_QUANTITY_IN_KG} kg`}
				unit='PCS'
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
