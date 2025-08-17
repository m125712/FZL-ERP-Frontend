import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import {
	useNylonPlasticFinishingProduction,
	useNylonPlasticFinishingProductionLog,
	useNylonPlasticFinishingProductionLogByUUID,
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
	const { user } = useAuth();

	const MAX_PROD =
		Math.min(
			Number(updatePFProd?.balance_quantity),
			Number(updatePFProd?.slider_finishing_stock)
		) + Number(dataByUUID?.production_quantity);

	const { register, handleSubmit, errors, reset, context } = useRHF(
		{
			...SFG_PRODUCTION_SCHEMA_IN_PCS,

			production_quantity:
				SFG_PRODUCTION_SCHEMA_IN_PCS.production_quantity.max(
					MAX_PROD,
					'Beyond Max Quantity'
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
		reset(SFG_PRODUCTION_SCHEMA_IN_PCS_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updatePFProd?.uuid !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
				updated_by: user?.uuid,
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
			title={`Nylon Plastic Finishing Transfer Log`}
			onSubmit={handleSubmit(onSubmit)}
			formContext={context}
			onClose={onClose}
			isSmall={true}
		>
			<JoinInput
				title='Production Quantity'
				label='production_quantity'
				sub_label={`MAX: ${MAX_PROD} pcs`}
				unit='PCS'
				{...{ register, errors }}
			/>
			<Textarea label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
