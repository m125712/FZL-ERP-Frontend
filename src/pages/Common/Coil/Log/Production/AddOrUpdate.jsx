import { AddModal } from '@/components/Modal';
import { useRHF } from '@/hooks';
import {
	useCommonTapeProductionByUUID,
	useCommonCoilSFG,
} from '@/state/Common';
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

	const { register, handleSubmit, errors, reset, context } = useRHF(
		schema,
		TAPE_OR_COIL_PRODUCTION_LOG_NULL
	);

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data]);

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

	const onSubmit = async (data) => {
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
			<JoinInput
				title='Production Quantity'
				label='production_quantity'
				sub_label={`Min: ${MAX_QUANTITY}`}
				unit='KG'
				placeholder={`Min: ${MAX_QUANTITY}`}
				{...{ register, errors }}
			/>
			<JoinInput
				title='Wastage'
				label='wastage'
				sub_label={`Min: ${MAX_QUANTITY}`}
				unit='KG'
				placeholder={`Min: ${MAX_QUANTITY}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
