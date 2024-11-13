import { useAuth } from '@/context/auth';
import { useMetalFProduction, useMetalTCProduction } from '@/state/Metal';
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
	updateFinishingProd = {
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
	setUpdateFinishingProd,
}) {
	const { postData } = useMetalTCProduction();
	const { invalidateQuery } = useMetalFProduction();
	
	const { user } = useAuth();

	const MAX_PROD_PCS = Math.min(
		Number(updateFinishingProd.balance_quantity),
		Number(updateFinishingProd.finishing_stock),
		Number(updateFinishingProd.slider_finishing_stock)
	);

	const { register, handleSubmit, errors, reset, watch, control, context } =
		useRHF(SFG_PRODUCTION_SCHEMA_IN_PCS, SFG_PRODUCTION_SCHEMA_IN_PCS_NULL);
	const MAX_WASTAGE_KG = Number(
		MAX_PROD_PCS - (watch('production_quantity') || 0)
	).toFixed(3);

	const onClose = () => {
		setUpdateFinishingProd((prev) => ({
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
			finishing_batch_entry_uuid: updateFinishingProd?.finishing_batch_entry_uuid,
			section: 'finishing',
			production_quantity_in_kg: 0,
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url: '/zipper/finishing-batch-production',
			newData: updatedData,
			onClose,
		});

		invalidateQuery();
	};

	return (
		<AddModal
			id='FinishingProdModal'
			title={'Finishing Production'}
			subTitle={`
				${updateFinishingProd.order_number} -> 
				${updateFinishingProd.item_description} -> 
				${updateFinishingProd.style_color_size} 
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
			<Textarea label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
