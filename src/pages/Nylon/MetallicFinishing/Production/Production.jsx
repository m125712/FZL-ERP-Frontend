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
import { useNylonMFProduction } from '@/state/Nylon';

export default function Index({
	modalId = '',
	updateMFProd = {
		uuid: null,
		sfg_uuid: null,
		section: null,
		balance_quantity: null,
		production_quantity_in_kg: null,
		production_quantity: null,
		coloring_prod: null,
		nylon_metallic_finishing: null,
		wastage: null,
		remarks: null,
	},
	setUpdateMFProd,
}) {
	const { user } = useAuth();
	const { postData } = useNylonMFProduction();

	const MAX_PROD = Math.min(
		Number(updateMFProd?.balance_quantity),
		Number(updateMFProd?.coloring_prod)
	).toFixed(3);

	const MAX_PROD_KG = Number(updateMFProd.nylon_metallic_finishing).toFixed(
		3
	);

	const { register, handleSubmit, errors, reset, watch, control , context} = useRHF(
		{
			...SFG_PRODUCTION_SCHEMA_IN_KG,
			production_quantity: NUMBER_REQUIRED.max(
				MAX_PROD,
				'Beyond Max Quantity'
			),
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
		setUpdateMFProd((prev) => ({
			...prev,
			uuid: null,
			sfg_uuid: null,
			section: null,
			balance_quantity: null,
			production_quantity_in_kg: null,
			production_quantity: null,
			coloring_prod: null,
			nylon_metallic_finishing: null,
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
			sfg_uuid: updateMFProd?.sfg_uuid,
			section: 'finishing',
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
			title={'Nylon/Metallic Finishing/Production'}
			subTitle={`
				${updateMFProd.order_number} -> 
				${updateMFProd.item_description} -> 
				${updateMFProd.style_color_size} 
				`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				title='Production Quantity'
				label='production_quantity'
				sub_label={`MAX: ${MAX_PROD} pcs`}
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
