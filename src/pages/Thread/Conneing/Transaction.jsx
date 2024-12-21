import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import {
	useConningProdLog,
	useConningTrxLog,
	useDyeingCone,
} from '@/state/Thread';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { Input, JoinInput } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import { NUMBER_REQUIRED, STRING } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	coningTrx = {
		uuid: null,
		batch_entry_uuid: null,
		trx_quantity: null,
		remarks: null,
	},
	setConingTrx,
}) {
	const { postData, invalidateQuery } = useDyeingCone();
	const { invalidateQuery: invalidateConningProdLog } = useConningProdLog();
	const { invalidateQuery: invalidateConningTrxLog } = useConningTrxLog();
	const { user } = useAuth();
	const [qty, setQty] = useState();

	const MAX_TRX = Number(coningTrx?.coning_production_quantity);
	const MAX_CARTON = Math.ceil(
		Number(qty) / Number(coningTrx?.cone_per_carton)
	);

	const { register, handleSubmit, errors, reset, control, context, watch } =
		useRHF(
			{
				quantity: NUMBER_REQUIRED.moreThan(0, 'More than 0').max(
					MAX_TRX,
					'Beyond Max Quantity'
				),
				carton_quantity: NUMBER_REQUIRED.moreThan(0, 'More than 0'),
				remarks: STRING.nullable(),
			},
			{
				quantity: '',
				remarks: '',
			}
		);

	const onClose = () => {
		setConingTrx((prev) => ({
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
		const updatedData = {
			...data,
			uuid: nanoid(),
			batch_entry_uuid: coningTrx?.batch_entry_uuid,
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url: '/thread/batch-entry-trx',
			newData: updatedData,
			onClose,
		});

		invalidateQuery();
		invalidateConningProdLog();
		invalidateConningTrxLog();
		return;
	};

	useEffect(() => {
		setQty(watch('quantity'));
	}, [watch('quantity')]);

	return (
		<AddModal
			id='ConingTrxModal'
			title='Coning ⇾ Finishing'
			subTitle='Coning ⇾ Finishing'
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				title='Transaction Quantity'
				label='quantity'
				sub_label={`MAX: ${MAX_TRX} pcs`}
				unit='PCS'
				{...{ register, errors }}
			/>
			<JoinInput
				title='Carton Quantity'
				label='carton_quantity'
				sub_label={`Suggested: ${MAX_CARTON} pcs`}
				unit='PCS'
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
