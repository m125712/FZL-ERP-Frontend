import { useEffect, useState } from 'react';
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
		coning_carton_quantity: null,
		remarks: null,
	},
	setUpdateConingTrx,
}) {
	const { data, updateData, url } = useConeTrxByUUID(updateConingTrx?.uuid);
	const { invalidateQuery } = useDyeingCone();
	const [qty, setQty] = useState();

	const MAX_TRX =
		Number(updateConingTrx?.quantity) +
		Number(updateConingTrx?.coning_production_quantity);

	const MAX_CARTON = Math.ceil(
		Number(qty) / Number(updateConingTrx?.cone_per_carton)
	);

	const { register, handleSubmit, errors, reset, context, watch } = useRHF(
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
			coning_carton_quantity: null,
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

	useEffect(() => {
		setQty(watch('quantity'));
	}, [watch('quantity')]);

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
			<JoinInput
				title='Carton Quantity'
				label='carton_quantity'
				sub_label={`MAX: ${MAX_CARTON} pcs`}
				unit='PCS'
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
