import { AddModal } from '@/components/Modal';
import { useFetchForRhfReset, useRHF } from '@/hooks';
import { FormField, Input, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';

import {
	COMMON_COIL_TO_DYEING_NULL,
	COMMON_COIL_TO_DYEING_SCHEMA,
} from '@util/Schema';
import { useEffect } from 'react';
import { useCommonCoilToDyeingByUUID } from '@/state/Common';

export default function Index({
	modalId = '',
	order_id,
	entryUUID,
	setEntryUUID,
}) {
	const { data, url, updateData } = useCommonCoilToDyeingByUUID(
		entryUUID?.uuid
	);

	const {
		register,
		handleSubmit,
		errors,
		control,
		Controller,
		reset,
		getValues,
	} = useRHF(COMMON_COIL_TO_DYEING_SCHEMA, COMMON_COIL_TO_DYEING_NULL);

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data]);

	const onClose = () => {
		setEntryUUID(() => ({
			uuid: null,
		}));
		reset(COMMON_COIL_TO_DYEING_NULL);
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

			return;
		}
	};

	return (
		<AddModal
			id={modalId}
			title={`Coil SFG Transfer Log`}
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
				// sub_label={`Max: ${MAX_QUANTITY}, Max For This Order: ${getMaxQuantity()}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
