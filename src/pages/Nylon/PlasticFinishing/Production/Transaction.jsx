import { useAuth } from '@/context/auth';
import { useMetalTMProduction } from '@/state/Metal';
import { useNylonPlasticFinishingProduction } from '@/state/Nylon';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { Input, JoinInput } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import {
	NUMBER_REQUIRED,
	SFG_TRANSACTION_SCHEMA_IN_PCS,
	SFG_TRANSACTION_SCHEMA_IN_PCS_NULL,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updatePFTRX = {
		uuid: null,
		sfg_uuid: null,
		section: null,
		production_quantity_in_kg: null,
		production_quantity: null,
		coloring_prod: null,
		nylon_plastic_finishing: null,
		finishing_prod: null,
		wastage: null,
		remarks: null,
	},
	setUpdatePFTRX,
}) {
	const { postData } = useNylonPlasticFinishingProduction();
	const { user } = useAuth();
	const MAX_QUANTITY = updatePFTRX?.finishing_prod;

	const { register, handleSubmit, errors, reset, control, context } = useRHF(
		{
			...SFG_TRANSACTION_SCHEMA_IN_PCS,
			trx_quantity: NUMBER_REQUIRED.moreThan(0, 'More than 0').max(
				MAX_QUANTITY,
				'Beyond Max Quantity'
			),
		},
		SFG_TRANSACTION_SCHEMA_IN_PCS_NULL
	);

	const onClose = () => {
		setUpdatePFTRX((prev) => ({
			...prev,
			uuid: null,
			sfg_uuid: null,
			section: null,
			production_quantity_in_kg: null,
			production_quantity: null,
			coloring_prod: null,
			nylon_plastic_finishing: null,
			wastage: null,
			remarks: null,
		}));
		reset(SFG_TRANSACTION_SCHEMA_IN_PCS_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			uuid: nanoid(),
			sfg_uuid: updatePFTRX?.sfg_uuid,
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
			title='Finishing ⇾ Warehouse'
			subTitle={`
				${updatePFTRX.order_number} -> 
				${updatePFTRX.item_description} -> 
				${updatePFTRX.style_color_size} 
				`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<JoinInput
				title='Transaction Quantity'
				label='trx_quantity'
				sub_label={`MAX: ${updatePFTRX?.finishing_prod} pcs`}
				unit='PCS'
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
