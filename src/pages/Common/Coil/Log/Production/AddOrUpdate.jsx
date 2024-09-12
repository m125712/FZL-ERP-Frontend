import { AddModal } from '@/components/Modal';
import { ShowLocalToast } from '@/components/Toast';
import { useFetchForRhfReset, useRHF } from '@/hooks';
import {
	useCommonCoilSFG,
	useCommonTapeProductionByUUID,
} from '@/state/Common';
import { useOtherMaterial } from '@/state/Other';
import { Input, JoinInput } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import {
	TAPE_OR_COIL_PRODUCTION_LOG_NULL,
	TAPE_OR_COIL_PRODUCTION_LOG_SCHEMA,
} from '@util/Schema';
import { useEffect } from 'react';

export default function Index({
	modalId = '',
	updateCoilLog = {
		uuid: null,
		type_of_zipper: null,
		tape_coil_uuid: null,
		production_quantity: null,
		quantity: null,
		coil_stock: null,
		wastage: null,
		created_by_name: null,
	},
	setUpdateCoilLog,
}) {
	const { data, url, updateData } = useCommonTapeProductionByUUID(
		updateCoilLog?.uuid
	);
	const { invalidateQuery: invalidateCommonCoilSFG } = useCommonCoilSFG();
	const { data: material } = useOtherMaterial();

	const MAX_QUANTITY =
		Number(updateCoilLog.trx_quantity_in_coil) +
		Number(updateCoilLog.production_quantity);
	const schema = {
		...TAPE_OR_COIL_PRODUCTION_LOG_SCHEMA,
		production_quantity:
			TAPE_OR_COIL_PRODUCTION_LOG_SCHEMA.production_quantity.max(
				MAX_QUANTITY
			),
	};

	const { register, handleSubmit, errors, reset, context, getValues, watch } =
		useRHF(schema, TAPE_OR_COIL_PRODUCTION_LOG_NULL);

	useFetchForRhfReset(
		`/zipper/tape-coil-production/${updateCoilLog?.uuid}`,
		updateCoilLog?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateCoilLog((prev) => ({
			...prev,
			uuid: null,
			type_of_zipper: null,
			tape_coil_uuid: null,
			production_quantity: null,
			quantity: null,
			coil_stock: null,
			wastage: null,
			created_by_name: null,
		}));
		reset(TAPE_OR_COIL_PRODUCTION_LOG_NULL);
		window[modalId].close();
	};

	const MAX_WASTAGE = MAX_QUANTITY - watch('production_quantity');

	const onSubmit = async (data) => {
		if (MAX_WASTAGE <= watch('wastage')) {
			ShowLocalToast({
				type: 'error',
				message: 'Beyond Stock',
			});
			return;
		}
		// Update item
		if (updateCoilLog?.uuid !== null && updateCoilLog?.uuid !== undefined) {
			const updatedData = {
				...data,
				type_of_zipper: updateCoilLog?.type_of_zipper,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url,
				updatedData,
				onClose,
			});
			invalidateCommonCoilSFG();
			return;
		}
	};

	return (
		<AddModal
			id={modalId}
			title={`Update Production Log of ${updateCoilLog?.type_of_zipper}`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<Input
				title='Production Quantity'
				label='production_quantity'
				sub_label={`Max: ${MAX_QUANTITY}`}
				placeholder={`Max: ${MAX_QUANTITY}`}
				{...{ register, errors }}
			/>
			<Input
				title='Wastage'
				label='wastage'
				sub_label={`Max: ${MAX_WASTAGE}`}
				placeholder={`Max: ${MAX_WASTAGE}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
