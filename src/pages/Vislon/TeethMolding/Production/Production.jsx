import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useRHF } from '@/hooks';
import { JoinInput, Textarea } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { DevTool } from '@hookform/devtools';
import {
	NUMBER_REQUIRED,
	SFG_PRODUCTION_SCHEMA_IN_KG,
	SFG_PRODUCTION_SCHEMA_IN_KG_NULL,
} from '@util/Schema';

import nanoid from '@/lib/nanoid';
import { useVislonTMP } from '@/state/Vislon';

export default function Index({
	modalId = '',
	updateTeethMoldingProd = {
		uuid: null,
		sfg_uuid: null,
		section: null,
		production_quantity_in_kg: null,
		production_quantity: null,
		vislon_teeth_molding: null,
		wastage: null,
		remarks: null,
	},
	setUpdateTeethMoldingProd,
}) {
	const { postData } = useVislonTMP();
	const { user } = useAuth();

	const MAX_PROD_KG = Math.min(
		Number(updateTeethMoldingProd.balance_quantity),
		Number(updateTeethMoldingProd.vislon_teeth_molding)
	).toFixed(3);

	const { register, handleSubmit, errors, reset, watch, control } = useRHF(
		{
			...SFG_PRODUCTION_SCHEMA_IN_KG,
			production_quantity_in_kg: NUMBER_REQUIRED.max(
				MAX_PROD_KG,
				'Beyond Max Quantity'
			),
		},
		SFG_PRODUCTION_SCHEMA_IN_KG_NULL
	);

	const MAX_WASTAGE_KG = Number(
		MAX_PROD_KG - (watch('production_quantity_in_kg') || 0)
	).toFixed(3);

	const onClose = () => {
		setUpdateTeethMoldingProd((prev) => ({
			...prev,
			uuid: null,
			sfg_uuid: null,
			section: null,
			production_quantity_in_kg: null,
			production_quantity: null,
			vislon_teeth_molding: null,
			wastage: null,
			remarks: null,
		}));

		reset(SFG_PRODUCTION_SCHEMA_IN_KG_NULL);
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
	};

	return (
		<AddModal
			id='TeethMoldingProdModal'
			title={'Teeth Molding Production'}
			subTitle={`
				${updateTeethMoldingProd.order_number} -> 
				${updateTeethMoldingProd.item_description} -> 
				${updateTeethMoldingProd.style_color_size} 
				`}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				title='Production Quantity'
				label='production_quantity_in_kg'
				unit='KG'
				sub_label={`MAX: ${MAX_PROD_KG} kg`}
				{...{ register, errors }}
			/>
			<JoinInput
				title='wastage'
				label='wastage'
				unit='KG'
				sub_label={`MAX: ${MAX_WASTAGE_KG} kg`}
				{...{ register, errors }}
			/>
			<Textarea label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
