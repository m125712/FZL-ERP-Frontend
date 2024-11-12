import { useAuth } from '@/context/auth';
import { useMetalFProduction } from '@/state/Metal';
import { DevTool } from '@hookform/devtools';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { Input, JoinInput } from '@/ui';

import nanoid from '@/lib/nanoid';
import {
	SFG_TRANSACTION_SCHEMA_IN_PCS,
	SFG_TRANSACTION_SCHEMA_IN_PCS_NULL,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateFinishingTRX = {
		sfg_uuid: null,
		order_number: null,
		item_description: null,
		style_color_size: null,
		order_quantity: null,
		balance_quantity: null,
		teeth_coloring_prod: null,
		teeth_coloring_stock: null,
		total_trx_quantity: null,
		metal_teeth_coloring: null,
		uuid: null,
		sfg_uuid: null,
		trx_quantity_in_kg: null,
		trx_quantity_in: null,
		trx_from: null,
		trx_to: null,
		remarks: '',
	},
	setUpdateFinishingTRX,
}) {
	const { postData, invalidateQuery } = useMetalFProduction();

	const { user } = useAuth();

	const { register, handleSubmit, errors, reset, control, context } = useRHF(
		SFG_TRANSACTION_SCHEMA_IN_PCS,
		SFG_TRANSACTION_SCHEMA_IN_PCS_NULL
	);

	const onClose = () => {
		setUpdateFinishingTRX((prev) => ({
			...prev,
			sfg_uuid: null,
			order_number: null,
			item_description: null,
			style_color_size: null,
			order_quantity: null,
			balance_quantity: null,
			teeth_coloring_prod: null,
			teeth_coloring_stock: null,
			total_trx_quantity: null,
			metal_teeth_coloring: null,
			uuid: null,
			trx_quantity_in_kg: null,
			trx_quantity_in: null,
			trx_from: null,
			trx_to: null,
			remarks: '',
		}));
		reset(SFG_TRANSACTION_SCHEMA_IN_PCS_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			uuid: nanoid(),
			finishing_batch_entry_uuid: updateFinishingTRX?.finishing_batch_entry_uuid,
			trx_quantity_in_kg: 0,
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
			id='FinishingTrxModal'
			title='Finishing Transaction'
			subTitle='Teeth Coloring ⇾ Finishing'
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				title='Transaction Quantity'
				label='trx_quantity'
				sub_label={`MAX: ${Number(updateFinishingTRX?.teeth_coloring_prod)} pcs`}
				unit='PCS'
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
