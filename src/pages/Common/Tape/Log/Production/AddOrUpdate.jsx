import { AddModal } from '@/components/Modal';
import { useFetchForRhfReset, useRHF } from '@/hooks';
import {
	useCommonTapeProductionByUUID,
	useCommonTapeSFG,
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
	updateTapeLog = {
		uuid: null,
		tape_type: null,
		tape_or_coil_stock_id: null,
		production_quantity: null,
		tape_prod: null,
		coil_stock: null,
		wastage: null,
		issued_by_name: null,
	},
	setUpdateTapeLog,
}) {
	const { data, url, updateData } = useCommonTapeProductionByUUID(
		updateTapeLog?.uuid
	);
	const { invalidateQuery: invalidateCommonTapeSFG } = useCommonTapeSFG();
	const { data: material } = useOtherMaterial();

	const { register, handleSubmit, errors, reset, context, getValues } =
		useRHF(
			TAPE_OR_COIL_PRODUCTION_LOG_SCHEMA,
			TAPE_OR_COIL_PRODUCTION_LOG_NULL
		);

	useFetchForRhfReset(
		`/zipper/tape-coil-production/${updateTapeLog?.uuid}`,
		updateTapeLog?.uuid,
		reset
	);
	
	const onClose = () => {
		setUpdateTapeLog((prev) => ({
			...prev,
			uuid: null,
			tape_type: null,
			tape_or_coil_stock_id: null,
			prod_quantity: null,
			tape_prod: null,
			coil_stock: null,
			wastage: null,
			issued_by_name: null,
		}));
		reset(TAPE_OR_COIL_PRODUCTION_LOG_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		
		// Update item
		if (updateTapeLog?.uuid !== null && updateTapeLog?.uuid !== undefined) {
			const updatedData = {
				...data,
				type_of_zipper: updateTapeLog?.type_of_zipper,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url,
				updatedData,
				onClose,
			});
			invalidateCommonTapeSFG();
			return;
		}
	};

	return (
		<AddModal
			id={modalId}
			title={`Update Production Log of ${updateTapeLog?.type_of_zipper}`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<Input
				title='Production Quantity'
				label='production_quantity'
				//sub_label={`Min: ${//MIN_QUANTITY}`}
				//placeholder={`Min: ${//MIN_QUANTITY}`}
				{...{ register, errors }}
			/>
			<Input
				title='Wastage'
				label='wastage'
				//sub_label={`Min: ${//MIN_QUANTITY}`}
				//placeholder={`Min: ${//MIN_QUANTITY}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}