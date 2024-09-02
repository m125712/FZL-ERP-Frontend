import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useRHF } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useMetalTMProduction } from '@/state/Metal';
import { JoinInput, Textarea } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { DevTool } from '@hookform/devtools';
import { SFG_PRODUCTION_NULL, SFG_PRODUCTION_SCHEMA } from '@util/Schema';

export default function Index({
	modalId = '',
	updatePFProd = {
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
	},
	setUpdatePFProd,
}) {
	const { postData } = useMetalTMProduction();
	const { user } = useAuth();

	const MAX_PROD_PCS = Number(updatePFProd.balance_quantity).toFixed(0);
	const MAX_PROD_KG = Number(updatePFProd.metal_teeth_molding).toFixed(3);

	const { register, handleSubmit, errors, reset, watch, control } = useRHF(
		SFG_PRODUCTION_SCHEMA,
		SFG_PRODUCTION_NULL
	);
	const MAX_WASTAGE_KG = Number(
		MAX_PROD_KG - (watch('production_quantity_in_kg') || 0)
	).toFixed(3);

	const onClose = () => {
		setUpdatePFProd((prev) => ({
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
			sfg_uuid: updatePFProd?.sfg_uuid,
			section: 'teeth_molding',
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
			id={modalId}
			title={'Nylon/Plastic Finishing/Production'}
			subTitle={`
				${updatePFProd.order_number} -> 
				${updatePFProd.item_description} -> 
				${updatePFProd.style_color_size} 
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
