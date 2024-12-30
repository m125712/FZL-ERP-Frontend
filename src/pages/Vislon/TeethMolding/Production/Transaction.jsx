import { useAuth } from '@/context/auth';
import { useVislonTMP, useVislonTMTLog } from '@/state/Vislon';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { Input, JoinInput } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import {
	NUMBER_DOUBLE_REQUIRED,
	VISLON_TRANSACTION_SCHEMA,
	VISLON_TRANSACTION_SCHEMA_NULL,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateTeethMoldingTRX = {
		uuid: null,
		sfg_uuid: null,
		trx_quantity_in_kg: null,
		trx_from: null,
		trx_to: null,
		remarks: '',
	},
	setUpdateTeethMoldingTRX,
}) {
	const { postData } = useVislonTMP();
	const { invalidateQuery } = useVislonTMTLog();
	const { user } = useAuth();

	const { register, handleSubmit, errors, reset, control, context } = useRHF(
		{
			...VISLON_TRANSACTION_SCHEMA,
			trx_quantity_in_kg: NUMBER_DOUBLE_REQUIRED.moreThan(
				0,
				'More than 0'
			).max(
				Number(updateTeethMoldingTRX?.teeth_molding_prod),
				'Beyond Max Quantity'
			),
		},
		VISLON_TRANSACTION_SCHEMA_NULL
	);

	const onClose = () => {
		setUpdateTeethMoldingTRX((prev) => ({
			...prev,
			uuid: null,
			sfg_uuid: null,
			trx_quantity_in_kg: null,
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
			finishing_batch_entry_uuid:
				updateTeethMoldingTRX?.finishing_batch_entry_uuid,
			trx_from: 'teeth_molding_prod',
			trx_to: 'finishing_stock',
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url: '/zipper/finishing-batch-transaction',
			newData: updatedData,
			onClose,
		});

		invalidateQuery();
		return;
	};

	return (
		<AddModal
			id='TeethMoldingTrxModal'
			title='Teeth Molding ⇾ Finishing'
			subTitle={`
				${updateTeethMoldingTRX.order_number} -> 
				${updateTeethMoldingTRX.item_description} -> 
				${updateTeethMoldingTRX.style_color_size} 
				`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				title='Transaction Quantity'
				label='trx_quantity_in_kg'
				sub_label={`MAX: ${Number(updateTeethMoldingTRX?.teeth_molding_prod)} KG`}
				unit='KG'
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
