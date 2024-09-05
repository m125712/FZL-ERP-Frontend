import { AddModal } from '@/components/Modal';
import { useRHF } from '@/hooks';
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
	entry = { uuid: null, trx_quantity: null, remarks: null },
	setEntry,
}) {
	const { data, url, updateData } = useCommonCoilToDyeingByUUID(entry?.uuid);

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
			reset(data[0]);
		}
	}, [data]);

	const onClose = () => {
		setEntry(() => ({
			uuid: null,
			trx_quantity: null,
			remarks: null,
		}));

		reset(COMMON_COIL_TO_DYEING_NULL);
		window[modalId].close();
	};


	const onSubmit = async (data) => {
		// Update item
		if (entry?.uuid !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			console.log('updatedData', updatedData);
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
			title={`Tape -> Dyeing`}
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
				sub_label={`Max: ${Number(getValues('max_trf_qty'))}`} //  Max For This Order: ${getMaxQuantity()}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
