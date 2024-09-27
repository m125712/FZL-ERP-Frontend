import { useEffect } from 'react';
import { useConeTrxByUUID, useDyeingCone } from '@/state/Thread';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { Input, JoinInput } from '@/ui';

import { NUMBER_DOUBLE_REQUIRED, STRING } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateConingTrx = {
		uuid: null,
		batch_entry_uuid: null,
		trx_quantity: null,
		remarks: null,
	},
	setUpdateConingTrx,
}) {
	const { data, updateData, url } = useConeTrxByUUID(updateConingTrx?.uuid);
	const { invalidateQuery } = useDyeingCone();

	const MAX_TRX =
		Number(updateConingTrx?.quantity) +
		Number(updateConingTrx?.coning_production_quantity);

	const { register, handleSubmit, errors, reset, context } = useRHF(
		{
			quantity: NUMBER_DOUBLE_REQUIRED.moreThan(0, 'More than 0').max(
				MAX_TRX,
				'Beyond Max Quantity'
			),
			remarks: STRING.nullable(),
		},
		{
			quantity: '',
			remarks: '',
		}
	);

	// * To reset the form with the fetched data
	useEffect(() => {
		if (data) {
			reset(data); // Reset the form with the fetched data
		}
	}, [data, reset]);

	const onClose = () => {
		setUpdateConingTrx((prev) => ({
			...prev,
			uuid: null,
			batch_entry_uuid: null,
			trx_quantity: null,
			remarks: null,
		}));
		reset({
			quantity: '',
			remarks: '',
		});
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateConingTrx?.uuid !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url,
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
			title={`Transfer Log`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				label='quantity'
				unit='KG'
				sub_label={`Max: ${MAX_TRX}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
