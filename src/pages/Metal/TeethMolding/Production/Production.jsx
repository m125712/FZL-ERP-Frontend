import { useAuth } from '@/context/auth';
import { useMetalTMProduction, useMetalTMProductionLog } from '@/state/Metal';
import { DevTool } from '@hookform/devtools';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { JoinInput, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import { SFG_PRODUCTION_NULL, SFG_PRODUCTION_SCHEMA } from '@util/Schema';
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

	const MAX_PROD_PCS = 
		updateTeethMoldingProd.balance_quantity
	;
	const MAX_PROD_KG = updateTeethMoldingProd.tape_transferred
	;

	console.log(updateTeethMoldingProd);
	const { register, handleSubmit, errors, reset, watch, control, context } =
		useRHF(SFG_PRODUCTION_SCHEMA, SFG_PRODUCTION_NULL);
	const MAX_WASTAGE_KG = Number(
		MAX_PROD_KG - (watch('production_quantity_in_kg') || 0)
	).toFixed(3);

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
		reset(SFG_PRODUCTION_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			uuid: nanoid(),
			sfg_uuid: updateTeethMoldingProd?.sfg_uuid,
			section: 'teeth_molding',
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
			isSmall={true}>
			<JoinInput
				title='Production Quantity'
				label='production_quantity'
				sub_label={`MAX: ${MAX_PROD_PCS} pcs`}
				unit='PCS'
				{...{ register, errors }}
			/>
			<JoinInput
				title='Production Quantity (KG)'
				label='production_quantity_in_kg'
				sub_label={`MAX: ${MAX_PROD_KG} kg`}
				unit='KG'
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
