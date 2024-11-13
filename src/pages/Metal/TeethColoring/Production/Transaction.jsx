import { useAuth } from '@/context/auth';
import { useMetalTCProduction, useMetalTCTrxLog } from '@/state/Metal';
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
	updateTeethColoringTRX = {
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
	setUpdateTeethColoringTRX,
}) {
	const { postData } = useMetalTCProduction();
	const { invalidateQuery } = useMetalTCTrxLog();
	const { user } = useAuth();

	const { register, handleSubmit, errors, reset, control, context } = useRHF(
		{
			...SFG_TRANSACTION_SCHEMA_IN_PCS,
			trx_quantity: SFG_TRANSACTION_SCHEMA_IN_PCS.trx_quantity.max(
				updateTeethColoringTRX?.teeth_coloring_prod,
				'Beyond Max Quantity'
			),
		},
		SFG_TRANSACTION_SCHEMA_IN_PCS_NULL
	);

	const onClose = () => {
		setUpdateTeethColoringTRX((prev) => ({
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
			finishing_batch_entry_uuid: updateTeethColoringTRX?.finishing_batch_entry_uuid,
			trx_quantity_in_kg: 0,
			trx_from: 'teeth_coloring_prod',
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
			id='TeethColoringTrxModal'
			title='Teeth Coloring ⇾ Finishing'
			subTitle={`
				${updateTeethColoringTRX.order_number} -> 
				${updateTeethColoringTRX.item_description} -> 
				${updateTeethColoringTRX.style_color_size} 
				`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				title='Transaction Quantity'
				label='trx_quantity'
				sub_label={`MAX: ${Number(updateTeethColoringTRX?.teeth_coloring_prod)} pcs`}
				unit='PCS'
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
