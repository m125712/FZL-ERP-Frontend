import { useEffect } from 'react';
import { useCommonCoilSFG, useCommonCoilToDyeingByUUID } from '@/state/Common';
import { useOtherOrderDescription } from '@/state/Other';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, ReactSelect } from '@/ui';

import {
	COMMON_COIL_TO_DYEING_LOG_NULL,
	COMMON_COIL_TO_DYEING_LOG_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	entryUUID = { uuid: null, max_trf_qty: null },
	setEntryUUID,
}) {
	const { data, url, updateData } = useCommonCoilToDyeingByUUID(
		entryUUID?.uuid
	);

	const { invalidateQuery: invalidateCommonCoilSFG } = useCommonCoilSFG();
	const MAX_QTY = Number(entryUUID?.max_trf_qty);

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

	useEffect(() => {
		if (data && entryUUID?.uuid !== null) {
			reset(data);
		}
	}, [data]);

	const { data: order_id } = useOtherOrderDescription();

	const onClose = () => {
		setEntryUUID(() => ({
			uuid: null,
		}));
		reset(COMMON_COIL_TO_DYEING_LOG_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (entryUUID?.uuid !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url,
				updatedData: updatedData,
				onClose,
			});
			invalidateCommonCoilSFG();

			return;
		}
	};

	return (
		<AddModal
			id={modalId}
			title={`Coil SFG Transfer Log`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<FormField
				label='Order Entry ID'
				title='Order Entry ID'
				errors={errors}
			>
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
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
