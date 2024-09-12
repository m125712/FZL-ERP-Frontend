import { AddModal } from '@/components/Modal';
import { useFetchForRhfReset, useRHF } from '@/hooks';
import { FormField, Input, JoinInput, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';

import { useCommonCoilToDyeingByUUID, useCommonTapeSFG } from '@/state/Common';
import { useOtherMaterial } from '@/state/Other';
import {
	COMMON_COIL_TO_DYEING_LOG_NULL,
	COMMON_COIL_TO_DYEING_LOG_SCHEMA,
} from '@util/Schema';
import { useEffect } from 'react';
import { Schema } from 'yup';

export default function Index({
	modalId = '',
	order_id,
	entry = { uuid: null, trx_quantity: null, tape_prod: null, remarks: null },
	setEntry,
}) {
	const { data, url, updateData } = useCommonCoilToDyeingByUUID(entry?.uuid);
	const { invalidateQuery: invalidateCommonTapeSFG } = useCommonTapeSFG();
	const { data: material } = useOtherMaterial();
	const MAX_QTY = Number(entry?.trx_quantity) + Number(entry?.tape_prod);
	const schema = {
		...COMMON_COIL_TO_DYEING_LOG_SCHEMA,
		trx_quantity:
			COMMON_COIL_TO_DYEING_LOG_SCHEMA.trx_quantity.max(MAX_QTY),
	};
	const {
		register,
		handleSubmit,
		errors,
		control,
		Controller,
		reset,
		getValues,
		context,
	} = useRHF(schema, COMMON_COIL_TO_DYEING_LOG_NULL);

	useFetchForRhfReset(
		`/zipper/tape-coil-to-dyeing/${entry?.uuid}`,
		entry?.uuid,
		reset
	);

	const onClose = () => {
		setEntry(() => ({
			uuid: null,
			trx_quantity: null,
			remarks: null,
		}));

		reset(COMMON_COIL_TO_DYEING_LOG_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (entry?.uuid !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url,
				updatedData: updatedData,
				onClose,
			});
			invalidateCommonTapeSFG();

			return;
		}
	};

	return (
		<AddModal
			id={modalId}
			title={`Tape -> Dyeing`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<FormField
				label='Order Entry ID'
				title='Order Entry ID'
				errors={errors}>
				<Controller
					name={'order_description_uuid'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Transaction Area'
								options={order_id}
								value={order_id?.find(
									(item) =>
										item.value ==
										getValues('order_description_uuid')
								)}
								onChange={(e) => onChange(e.value)}
								isDisabled={true}
							/>
						);
					}}
				/>
			</FormField>
			<Input
				label='trx_quantity'
				sub_label={`Max: ${MAX_QTY}`}
				//sub_label={`Max: ${Number(getValues('max_trf_qty'))}`} //  Max For This Order: ${getMaxQuantity()}
				unit={
					material?.find(
						(inItem) => inItem.value == getValues(`material_uuid`)
					)?.unit
				}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
