import { useAuth } from '@/context/auth';
import {
	useNylonPlasticFinishingProduction,
	useNylonPlasticFinishingProductionLog,
} from '@/state/Nylon';
import { DevTool } from '@hookform/devtools';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { JoinInput, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import {
	NUMBER_REQUIRED,
	SFG_PRODUCTION_SCHEMA_IN_PCS,
	SFG_PRODUCTION_SCHEMA_IN_PCS_NULL,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updatePFProd = {
		uuid: null,
		sfg_uuid: null,
		section: null,
		production_quantity_in_kg: null,
		production_quantity: null,
		coloring_prod: null,
		nylon_plastic_finishing: null,
		wastage: null,
		remarks: null,
	},
	setUpdatePFProd,
}) {
	const { postData } = useNylonPlasticFinishingProduction();
	const { invalidateQuery } = useNylonPlasticFinishingProductionLog();
	const { user } = useAuth();
	const MAX_PROD = Math.min(
		Number(updatePFProd?.balance_quantity),
		Number(updatePFProd?.slider_finishing_stock)
	);

	const MAX_PROD_KG = Number(updatePFProd?.tape_transferred);

	const { register, handleSubmit, errors, reset, watch, control, context } =
		useRHF(
			{
				...SFG_PRODUCTION_SCHEMA_IN_PCS,
				production_quantity: NUMBER_REQUIRED.moreThan(
					0,
					'More Than 0'
				).max(MAX_PROD, 'Beyond Max Quantity'),
			},
			SFG_PRODUCTION_SCHEMA_IN_PCS_NULL
		);

	const onClose = () => {
		setUpdatePFProd((prev) => ({
			...prev,
			uuid: null,
			sfg_uuid: null,
			section: null,
			production_quantity_in_kg: null,
			production_quantity: null,
			wastage: null,
			remarks: null,
		}));

		reset(SFG_PRODUCTION_SCHEMA_IN_PCS_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			uuid: nanoid(),
			sfg_uuid: updatePFProd?.sfg_uuid,
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
			title={'Nylon/Plastic Finishing/Production'}
			subTitle={`
				${updatePFProd.order_number} -> 
				${updatePFProd.item_description} -> 
				${updatePFProd.style_color_size} 
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
			<Textarea label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
