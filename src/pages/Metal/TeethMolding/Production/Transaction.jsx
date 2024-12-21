import { useAuth } from '@/context/auth';
import {
	useMetalTCProduction,
	useMetalTMProduction,
	useMetalTMTrxLog,
} from '@/state/Metal';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { Input, JoinInput } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import {
	SFG_TRANSACTION_SCHEMA_IN_PCS,
	SFG_TRANSACTION_SCHEMA_IN_PCS_NULL,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateTeethMoldingTRX = {
		sfg_uuid: null,
		order_number: null,
		item_description: null,
		style_color_size: null,
		order_quantity: null,
		balance_quantity: null,
		teeth_molding_prod: null,
		teeth_molding_stock: null,
		total_trx_quantity: null,
		metal_teeth_molding: null,
		uuid: null,
		sfg_uuid: null,
		trx_quantity_in_kg: null,
		trx_quantity_in: null,
		trx_from: null,
		trx_to: null,
		remarks: '',
	},
	setUpdateTeethMoldingTRX,
}) {
	const { postData } = useMetalTMProduction();
	const { invalidateQuery } = useMetalTMTrxLog();
	const { invalidateQuery: invalidateMetalTCProduction } =
		useMetalTCProduction();

	const { user } = useAuth();

	const { register, handleSubmit, errors, reset, watch, control, context } =
		useRHF(
			SFG_TRANSACTION_SCHEMA_IN_PCS,
			SFG_TRANSACTION_SCHEMA_IN_PCS_NULL
		);

	const onClose = () => {
		setUpdateTeethMoldingTRX((prev) => ({
			...prev,
			sfg_uuid: null,
			order_number: null,
			item_description: null,
			style_color_size: null,
			order_quantity: null,
			balance_quantity: null,
			teeth_molding_prod: null,
			teeth_molding_stock: null,
			total_trx_quantity: null,
			metal_teeth_molding: null,
			uuid: null,
			sfg_uuid: null,
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
			finishing_batch_entry_uuid:
				updateTeethMoldingTRX?.finishing_batch_entry_uuid,
			trx_quantity_in_kg: 0,
			trx_from: 'teeth_molding_prod',
			trx_to: 'teeth_coloring_stock',
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url: '/zipper/finishing-batch-transaction',
			newData: updatedData,
			onClose,
		});

		invalidateQuery();
		invalidateMetalTCProduction();
		return;
	};

	return (
		<AddModal
			id='TeethMoldingTrxModal'
			title='Teeth Molding ⇾ Teeth Coloring'
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
				label='trx_quantity'
				sub_label={`MAX: ${Number(updateTeethMoldingTRX?.teeth_molding_prod)} pcs`}
				unit='PCS'
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
