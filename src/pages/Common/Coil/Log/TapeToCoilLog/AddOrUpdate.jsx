import { useEffect } from 'react';
import { useCommonTapeSFG, useCommonTapeToCoilByUUID } from '@/state/Common';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { Input } from '@/ui';

import { TAPE_TO_COIL_TRX_NULL, TAPE_TO_COIL_TRX_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateTapeLog = {
		uuid: null,
		type_of_zipper: null,
		tape_or_coil_stock_id: null,
		tape_prod: null,
		coil_stock: null,
		trx_quantity: null,
		quantity_in_coil: null,
		trx_quantity_in_dying: null,
		to_section: null,
	},
	setUpdateTapeLog,
}) {
	const { data, url, updateData } = useCommonTapeToCoilByUUID(
		updateTapeLog?.uuid
	);
	const { invalidateQuery: invalidateCommonTapeSFG } = useCommonTapeSFG();

	const MAX_QUANTITY =
		Number(
			updateTapeLog?.to_section === 'stock'
				? updateTapeLog?.trx_quantity_in_dying
				: updateTapeLog?.quantity_in_coil
		) + Number(updateTapeLog?.trx_quantity);

	const schema = {
		...TAPE_TO_COIL_TRX_SCHEMA,
		trx_quantity: TAPE_TO_COIL_TRX_SCHEMA.trx_quantity.max(MAX_QUANTITY),
	};

	const { register, handleSubmit, errors, reset, context, getValues } =
		useRHF(schema, TAPE_TO_COIL_TRX_NULL);

	useEffect(() => {
		if (data && updateTapeLog?.uuid) {
			reset(data);
		}
	}, [data]);

	const onClose = () => {
		setUpdateTapeLog((prev) => ({
			...prev,
			uuid: null,
			trx_quantity: null,
		}));
		reset(TAPE_TO_COIL_TRX_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateTapeLog?.uuid !== null && updateTapeLog?.uuid !== undefined) {
			const updatedData = {
				...data,
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
			title={`Tape Log of ${updateTapeLog?.type_of_zipper}`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<Input
				label='trx_quantity'
				sub_label={`Max: ${
					Number(
						updateTapeLog?.to_section === 'stock'
							? updateTapeLog?.trx_quantity_in_dying
							: updateTapeLog?.quantity_in_coil
					) + Number(updateTapeLog?.trx_quantity)
				}`}
				placeholder={`Max: ${
					Number(
						updateTapeLog?.to_section === 'stock'
							? updateTapeLog?.trx_quantity_in_dying
							: updateTapeLog?.quantity_in_coil
					) + Number(updateTapeLog?.trx_quantity)
				}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
