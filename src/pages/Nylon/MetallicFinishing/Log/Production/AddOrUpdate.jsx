import { useEffect } from 'react';
import {
	useNylonMFProduction,
	useNylonMFProductionLog,
	useNylonMFProductionLogByUUID,
} from '@/state/Nylon';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { JoinInput, Textarea } from '@/ui';

import {
	SFG_PRODUCTION_SCHEMA_IN_PCS,
	SFG_PRODUCTION_SCHEMA_IN_PCS_NULL,
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

	const { register, handleSubmit, errors, reset, context } = useRHF(
		{
			...SFG_PRODUCTION_SCHEMA_IN_PCS,
			production_quantity:
				SFG_PRODUCTION_SCHEMA_IN_PCS.production_quantity.max(
					MAX_QUANTITY
				),
		},
		SFG_PRODUCTION_SCHEMA_IN_PCS_NULL
	);

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
		reset(SFG_PRODUCTION_SCHEMA_IN_PCS_NULL);
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
				url: `/zipper/finishing-batch-production/${updatedData?.uuid}`,
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
			onClose={onClose}
			isSmall={true}
		>
			<JoinInput
				title='Production Quantity'
				label='production_quantity'
				sub_label={`MAX: ${MAX_QUANTITY} pcs`}
				unit='PCS'
				{...{ register, errors }}
			/>
			<Textarea label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
