import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useRHF } from '@/hooks';
import { Input, JoinInput } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import {
	NUMBER_REQUIRED,
	VISLON_TRANSACTION_SCHEMA,
	VISLON_TRANSACTION_SCHEMA_NULL,
} from '@util/Schema';

import nanoid from '@/lib/nanoid';
import { useVislonTMP } from '@/state/Vislon';
import { DevTool } from '@hookform/devtools';

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
	const { user } = useAuth();

	const { register, handleSubmit, errors, reset, watch, control } = useRHF(
		{
			...VISLON_TRANSACTION_SCHEMA,
			trx_quantity_in_kg: NUMBER_REQUIRED.max(
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
			sfg_uuid: updateTeethMoldingTRX?.sfg_uuid,
			trx_from: 'finishing_prod',
			trx_to: 'warehouse',
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url: '/zipper/sfg-transaction',
			newData: updatedData,
			onClose,
		});
	};

	return (
		<AddModal
			id='TeethMoldingTrxModal'
			title='Finishing ⇾ Warehouse'
			subTitle={`
				${updateTeethMoldingTRX.order_number} -> 
				${updateTeethMoldingTRX.item_description} -> 
				${updateTeethMoldingTRX.style_color_size} 
				`}
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
