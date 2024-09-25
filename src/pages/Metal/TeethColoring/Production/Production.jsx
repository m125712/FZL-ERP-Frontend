import { useAuth } from '@/context/auth';
import { useMetalTCProduction, useMetalTCProductionLog } from '@/state/Metal';
import { DevTool } from '@hookform/devtools';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { JoinInput, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import {
	SFG_PRODUCTION_SCHEMA_IN_PCS,
	SFG_PRODUCTION_SCHEMA_IN_PCS_NULL,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateTeethColoringProd = {
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
	},
	setUpdateTeethColoringProd,
}) {
	const { postData } = useMetalTCProduction();
	const { invalidateQuery } = useMetalTCProductionLog();
	const { user } = useAuth();

	const MAX_PROD_PCS = Math.min(
		Number(updateTeethColoringProd.balance_quantity),
		Number(updateTeethColoringProd.teeth_coloring_stock)
	);

	const { register, handleSubmit, errors, reset, watch, control, context } =
		useRHF(
			{
				...SFG_PRODUCTION_SCHEMA_IN_PCS,
				production_quantity:
					SFG_PRODUCTION_SCHEMA_IN_PCS.production_quantity.max(
						MAX_PROD_PCS,
						'Beyond max quantity'
					),
			},
			SFG_PRODUCTION_SCHEMA_IN_PCS_NULL
		);
	const MAX_WASTAGE_KG = Number(
		MAX_PROD_PCS - (watch('production_quantity') || 0)
	).toFixed(3);

	const onClose = () => {
		setUpdateTeethColoringProd((prev) => ({
			...prev,
			uuid: null,
			name: '',
			teeth_coloring_stock: null,
			teeth_coloring_prod: null,
			order_entry_id: null,
			item_description: null,
			total_trx_quantity: null,
			order_number: '',
			order_description: '',
		}));
		reset(SFG_PRODUCTION_SCHEMA_IN_PCS_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			uuid: nanoid(),
			sfg_uuid: updateTeethColoringProd?.sfg_uuid,
			section: 'teeth_coloring',
			production_quantity_in_kg: 0,
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url: '/zipper/sfg-production',
			newData: updatedData,
			onClose,
		});

		invalidateQuery();
		return;
	};

	return (
		<AddModal
			id='TeethColoringProdModal'
			title={'Metal/Teeth Coloring/Production'}
			subTitle={`
				${updateTeethColoringProd.order_number} -> 
				${updateTeethColoringProd.item_description} -> 
				${updateTeethColoringProd.style_color_size} 
				`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				title='Production Quantity'
				label='production_quantity'
				sub_label={`MAX: ${MAX_PROD_PCS} pcs`}
				unit='PCS'
				{...{ register, errors }}
			/>
			<JoinInput
				title='wastage'
				label='wastage'
				sub_label={`MAX: ${MAX_WASTAGE_KG} kg`}
				unit='KG'
				{...{ register, errors }}
				{...{ register, errors }}
			/>
			<Textarea label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
