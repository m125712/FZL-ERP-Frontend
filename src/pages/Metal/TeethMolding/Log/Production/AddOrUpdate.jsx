import { useEffect } from 'react';
import {
	useMetalTMProduction,
	useMetalTMProductionLog,
	useMetalTMProductionLogByUUID,
} from '@/state/Metal';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { Input, JoinInput } from '@/ui';

import {
	NUMBER_DOUBLE_REQUIRED,
	SFG_PRODUCTION_SCHEMA_IN_PCS,
	SFG_PRODUCTION_SCHEMA_IN_PCS_NULL,
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

	const MAX_DUE_TAPE =
		Number(updateTeethMoldingLog?.tape_stock) +
		Number(dataByUUID?.dyed_tape_used_in_kg);

	const { register, handleSubmit, errors, reset, context } = useRHF(
		{
			...SFG_PRODUCTION_SCHEMA_IN_PCS,
			production_quantity:
				SFG_PRODUCTION_SCHEMA_IN_PCS.production_quantity.max(
					MAX_QUANTITY
				),
			dyed_tape_used_in_kg: NUMBER_DOUBLE_REQUIRED.max(
				MAX_DUE_TAPE,
				'Beyond Max limit'
			).min(0, 'Negative value not allowed'),
		},
		{ ...SFG_PRODUCTION_SCHEMA_IN_PCS_NULL, dyed_tape_used_in_kg: null }
	);

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
		reset({
			...SFG_PRODUCTION_SCHEMA_IN_PCS_NULL,
			dyed_tape_used_in_kg: null,
		});
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
				url: `/zipper/finishing-batch-production/${updatedData?.uuid}`,
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
			<JoinInput
				title='Production Quantity'
				label='production_quantity'
				sub_label={`MAX: ${MAX_QUANTITY} pcs`}
				unit='PCS'
				{...{ register, errors }}
			/>
			<JoinInput
				title='Dyed Tape Used'
				label='dyed_tape_used_in_kg'
				sub_label={`MAX: ${MAX_DUE_TAPE} kg`}
				unit='PCS'
				{...{ register, errors }}
			/>

			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
