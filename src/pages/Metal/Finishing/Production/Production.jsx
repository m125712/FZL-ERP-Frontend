import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useRHF } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useMetalTCProduction } from '@/state/Metal';
import { JoinInput, Textarea } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { DevTool } from '@hookform/devtools';
import {
	SFG_PRODUCTION_SCHEMA_IN_PCS,
	SFG_PRODUCTION_SCHEMA_IN_PCS_NULL,
} from '@util/Schema';

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
	const { user } = useAuth();

	const MAX_PROD_PCS = Number(updateFinishingProd.balance_quantity).toFixed(
		0
	);
	const MAX_PROD_KG = Number(
		updateFinishingProd.teeth_coloring_stock
	).toFixed(3);

	const { register, handleSubmit, errors, reset, watch, control } = useRHF(
		SFG_PRODUCTION_SCHEMA_IN_PCS,
		SFG_PRODUCTION_SCHEMA_IN_PCS_NULL
	);
	const MAX_WASTAGE_KG = Number(
		MAX_PROD_PCS - (watch('production_quantity') || 0)
	).toFixed(3);

	console.log({
		MAX_WASTAGE_KG,
	});

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
			sfg_uuid: updateFinishingProd?.sfg_uuid,
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
	};

	return (
		<AddModal
			id='FinishingProdModal'
			title={'Metal/Finishing/Production'}
			subTitle={`
				${updateFinishingProd.order_number} -> 
				${updateFinishingProd.item_description} -> 
				${updateFinishingProd.style_color_size} 
				`}
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
