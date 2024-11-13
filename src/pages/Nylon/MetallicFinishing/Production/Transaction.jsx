import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useRHF } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useNylonMFProduction } from '@/state/Nylon';
import { Input, JoinInput } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { DevTool } from '@hookform/devtools';
import {
	SFG_TRANSACTION_SCHEMA_IN_PCS,
	SFG_TRANSACTION_SCHEMA_IN_PCS_NULL,
} from '@util/Schema';

export default function Index({
	modalId = '',
	updateMFTRX = {
		sfg_uuid: null,
		order_number: null,
		item_description: null,
		style_color_size: null,
		order_quantity: null,
		balance_quantity: null,
		finishing_prod: null,
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
	setUpdateMFTRX,
}) {
	const { postData } = useNylonMFProduction();
	const { user } = useAuth();

	const { register, handleSubmit, errors, reset, control ,context} = useRHF(
		{
			...SFG_TRANSACTION_SCHEMA_IN_PCS,
			trx_quantity: SFG_TRANSACTION_SCHEMA_IN_PCS.trx_quantity.moreThan(0, 'More than 0').max(
				updateMFTRX?.finishing_prod
			),
		},
		SFG_TRANSACTION_SCHEMA_IN_PCS_NULL
	);

	const onClose = () => {
		setUpdateMFTRX((prev) => ({
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
			sfg_uuid: updateMFTRX?.sfg_uuid,
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
	};

	return (
		<AddModal
			id={modalId}
			title='Finishing Production ⇾ Warehouse'
			subTitle={`
				${updateMFTRX.order_number} -> 
				${updateMFTRX.item_description} -> 
				${updateMFTRX.style_color_size} 
				`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				title='Transaction Quantity'
				label='trx_quantity'
				sub_label={`MAX: ${Number(updateMFTRX?.finishing_prod)} pcs`}
				unit='PCS'
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
