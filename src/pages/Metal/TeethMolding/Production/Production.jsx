import { useAuth } from '@/context/auth';
import { useMetalTMProduction, useMetalTMProductionLog } from '@/state/Metal';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { JoinInput, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import {
	NUMBER_DOUBLE_REQUIRED,
	SFG_PRODUCTION_SCHEMA_IN_PCS,
	SFG_PRODUCTION_SCHEMA_IN_PCS_NULL,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateTeethMoldingProd = {
		sfg_uuid: null,
		order_number: null,
		item_description: null,
		style_color_size: null,
		order_quantity: null,
		balance_quantity: null,
		teeth_molding_prod: null,
		teeth_molding_stock: null,
		total_trx_quantity: null,
		tape_transferred: null,
	},
	setUpdateTeethMoldingProd,
}) {
	const { postData } = useMetalTMProduction();
	const { invalidateQuery } = useMetalTMProductionLog();
	const { user } = useAuth();

	const MAX_PROD_PCS = updateTeethMoldingProd.balance_quantity;
	const MAX_PROD_KG = updateTeethMoldingProd.tape_stock;

	const { register, handleSubmit, errors, reset, watch, control, context } =
		useRHF(
			{
				...SFG_PRODUCTION_SCHEMA_IN_PCS,
				production_quantity:
					SFG_PRODUCTION_SCHEMA_IN_PCS.production_quantity.max(
						MAX_PROD_PCS,
						'Beyond Max limit'
					),
				remaining_dyed_tape: NUMBER_DOUBLE_REQUIRED.default(0)
					.max(MAX_PROD_KG, 'Beyond Max limit')
					.min(0, 'Negative value not allowed'),
			},
			{ ...SFG_PRODUCTION_SCHEMA_IN_PCS_NULL, remaining_dyed_tape: 0 }
		);

	const onClose = () => {
		setUpdateTeethMoldingProd((prev) => ({
			...prev,
			id: null,
			name: '',
			teeth_molding_stock: null,
			teeth_molding_prod: null,
			order_entry_id: null,
			item_description: null,
			total_trx_quantity: null,
			order_number: '',
			order_description: '',
		}));
		reset({
			...SFG_PRODUCTION_SCHEMA_IN_PCS_NULL,
			remaining_dyed_tape: null,
		});
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			uuid: nanoid(),
			finishing_batch_entry_uuid:
				updateTeethMoldingProd?.finishing_batch_entry_uuid,
			dyed_tape_used_in_kg:
				updateTeethMoldingProd.tape_stock - data.remaining_dyed_tape,
			section: 'teeth_molding',
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url: '/zipper/finishing-batch-production',
			newData: updatedData,
			onClose,
		});

		invalidateQuery();
		return;
	};

	return (
		<AddModal
			id='TeethMoldingProdModal'
			title={'Metal/Teeth Molding/Production'}
			subTitle={`
				${updateTeethMoldingProd.order_number} -> 
				${updateTeethMoldingProd.item_description} -> 
				${updateTeethMoldingProd.style_color_size} 
				`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<JoinInput
				title='Production Quantity'
				label='production_quantity'
				unit='PCS'
				sub_label={`MAX: ${MAX_PROD_PCS} pcs`}
				{...{ register, errors }}
			/>
			<JoinInput
				title='Remaining Dyed Tape'
				label='remaining_dyed_tape'
				sub_label={`MAX: ${MAX_PROD_KG} kg`}
				unit='KG'
				{...{ register, errors }}
			/>

			<Textarea label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
