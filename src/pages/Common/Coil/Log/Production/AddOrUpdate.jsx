import { useEffect } from 'react';
import {
	useCommonCoilSFG,
	useCommonTapeProductionByUUID,
} from '@/state/Common';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { ShowLocalToast } from '@/components/Toast';
import { Input } from '@/ui';

import {
	TAPE_OR_COIL_PRODUCTION_LOG_NULL,
	TAPE_OR_COIL_PRODUCTION_LOG_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateCoilLog = {
		uuid: null,
		type_of_zipper: null,
		tape_coil_uuid: null,
		production_quantity: null,
		quantity: null,
		trx_quantity_in_coil: null,
		wastage: null,
		created_by_name: null,
	},
	setUpdateCoilLog,
}) {
	const { data, url, updateData } = useCommonTapeProductionByUUID(
		updateCoilLog?.uuid
	);
	const { invalidateQuery: invalidateCommonCoilSFG } = useCommonCoilSFG();

	const { register, handleSubmit, errors, reset, context, getValues, watch } =
		useRHF(
			TAPE_OR_COIL_PRODUCTION_LOG_SCHEMA,
			TAPE_OR_COIL_PRODUCTION_LOG_NULL
		);

	useEffect(() => {
		if (data && updateCoilLog?.uuid) {
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
	let MAX_PROD =
		Number(updateCoilLog?.trx_quantity_in_coil) +
		Number(updateCoilLog?.production_quantity) +
		(Number(updateCoilLog?.wastage) - watch('wastage'));
	let MAX_WASTAGE =
		Number(updateCoilLog?.trx_quantity_in_coil) +
		Number(updateCoilLog?.wastage) +
		(Number(updateCoilLog?.production_quantity) -
			watch('production_quantity'));

	const onSubmit = async (data) => {
		if (
			MAX_WASTAGE < watch('wastage') ||
			MAX_PROD < watch('production_quantity')
		) {
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
				sub_label={`Max: ${MAX_PROD}`}
				placeholder={`Max: ${MAX_PROD}`}
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
