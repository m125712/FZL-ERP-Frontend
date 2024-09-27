import { useAuth } from '@/context/auth';
import { useConningProdLog, useDyeingCone } from '@/state/Thread';
import { DevTool } from '@hookform/devtools';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { Input, JoinInput } from '@/ui';

import nanoid from '@/lib/nanoid';
import { NUMBER_DOUBLE_REQUIRED, STRING } from '@util/Schema';
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
	const { user } = useAuth();

	const MAX_TRX = Number(coningTrx?.coning_production_quantity);

	const { register, handleSubmit, errors, reset, control, context } = useRHF(
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
		return;
	};

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
			<Input label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
