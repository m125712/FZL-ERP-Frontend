import { useAuth } from '@/context/auth';
import { useNylonMFProduction, useNylonMFProductionLog } from '@/state/Nylon';
import { DevTool } from '@hookform/devtools';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { JoinInput, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import {
	NUMBER_DOUBLE_REQUIRED,
	NUMBER_REQUIRED,
	SFG_PRODUCTION_SCHEMA_IN_KG,
	SFG_PRODUCTION_SCHEMA_IN_KG_NULL,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

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
	const { invalidateQuery } = useNylonMFProductionLog();

	const MAX_PROD = Math.min(
		Number(updateMFProd?.balance_quantity),
		Number(updateMFProd?.slider_finishing_stock)
	);

	const MAX_PROD_KG = Number(updateMFProd.tape_transferred);

	const { register, handleSubmit, errors, reset, watch, control, context } =
		useRHF(
			{
				...SFG_PRODUCTION_SCHEMA_IN_KG,
				production_quantity: NUMBER_REQUIRED.moreThan(
					0,
					'More Than 0'
				).max(MAX_PROD, 'Beyond Max Quantity'),
				production_quantity_in_kg: NUMBER_DOUBLE_REQUIRED.moreThan(
					0,
					'More Than 0'
				).max(MAX_PROD_KG, 'Beyond Max Quantity'),
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

		invalidateQuery();
		return;
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
