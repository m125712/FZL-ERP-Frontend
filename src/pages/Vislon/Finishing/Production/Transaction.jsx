import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useRHF } from '@/hooks';
import { Input, JoinInput } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import {
	NUMBER_REQUIRED,
	NUMBER,
	VISLON_TRANSACTION_SCHEMA,
	VISLON_TRANSACTION_SCHEMA_NULL,
} from '@util/Schema';

import nanoid from '@/lib/nanoid';
import { useVislonTMP, useVislonFinishingProd } from '@/state/Vislon';
import { DevTool } from '@hookform/devtools';

export default function Index({
	modalId = '',
	updateFinishingTRX = {
		uuid: null,
		sfg_uuid: null,
		trx_quantity_in_kg: null,
		trx_quantity: null,
		trx_from: null,
		trx_to: null,
		remarks: '',
	},
	setUpdateFinishingTRX,
}) {
	const { postData } = useVislonTMP();
	const { invalidateQuery} = useVislonFinishingProd();
	const { user } = useAuth();

	const { register, handleSubmit, errors, reset, watch, control, context } = useRHF(
		{
			...VISLON_TRANSACTION_SCHEMA,
			trx_quantity_in_kg: NUMBER,
			trx_quantity: NUMBER_REQUIRED.moreThan(0, 'More than 0').max(
				Number(updateFinishingTRX?.finishing_prod),
				'Beyond Max Quantity'
			),
		},
		{
			...VISLON_TRANSACTION_SCHEMA_NULL,
			trx_quantity_in_kg: 0,
			trx_quantity: 0,
		}
	);

	const onClose = () => {
		setUpdateFinishingTRX((prev) => ({
			...prev,
			uuid: null,
			sfg_uuid: null,
			trx_quantity_in_kg: null,
			trx_quantity: null,
			trx_from: null,
			trx_to: null,
			remarks: '',
		}));

		reset(VISLON_TRANSACTION_SCHEMA_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			uuid: nanoid(),
			sfg_uuid: updateFinishingTRX?.sfg_uuid,
			trx_from: 'finishing_prod',
			trx_to: 'warehouse',
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url: '/zipper/finishing-batch-transaction',
			newData: updatedData,
			onClose,
		});

		invalidateQuery();
	};

	return (
		<AddModal
			id='TeethMoldingTrxModal'
			title='Transaction'
			subTitle='Finishing -> Warehouse'
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				title='Transaction Quantity'
				label='trx_quantity'
				sub_label={`MAX: ${Number(updateFinishingTRX?.finishing_prod)} PCS`}
				unit='PCS'
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
