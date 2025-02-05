import { useAuth } from '@/context/auth';
import {
	useVislonFinishingProd,
	useVislonFinishingProdLog,
	useVislonTMP,
} from '@/state/Vislon';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { JoinInput, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import {
	SFG_PRODUCTION_SCHEMA_IN_PCS,
	SFG_PRODUCTION_SCHEMA_IN_PCS_NULL,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateFinishingProd = {
		uuid: null,
		sfg_uuid: null,
		section: null,
		production_quantity_in_kg: null,
		production_quantity: null,
		coloring_prod: null,
		wastage: null,
		remarks: null,
	},
	setUpdateFinishingProd,
}) {
	const { postData } = useVislonTMP();
	const { invalidateQuery } = useVislonFinishingProd();
	const { invalidateQuery: invalidateVislonFinishingProdLog } =
		useVislonFinishingProdLog();
	const { user } = useAuth();

	const MAX_PROD =
		updateFinishingProd?.order_type === 'tape'
			? Math.min(
					Number(updateFinishingProd.balance_quantity),
					Number(updateFinishingProd.finishing_stock)
				)
			: Math.min(
					Number(updateFinishingProd.balance_quantity),
					Number(updateFinishingProd.slider_finishing_stock)
				);

	const { register, handleSubmit, errors, reset, control, context } = useRHF(
		{
			...SFG_PRODUCTION_SCHEMA_IN_PCS,
			production_quantity:
				SFG_PRODUCTION_SCHEMA_IN_PCS.production_quantity.max(
					MAX_PROD,
					'Beyond Max Quantity'
				),
		},
		SFG_PRODUCTION_SCHEMA_IN_PCS_NULL
	);

	const onClose = () => {
		setUpdateFinishingProd((prev) => ({
			...prev,
			uuid: null,
			sfg_uuid: null,
			section: null,
			production_quantity_in_kg: null,
			production_quantity: null,
			coloring_prod: null,
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
			finishing_batch_entry_uuid:
				updateFinishingProd?.finishing_batch_entry_uuid,
			coloring_prod: updateFinishingProd?.coloring_prod,
			section: 'finishing',
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url: '/zipper/finishing-batch-production',
			newData: updatedData,
			onClose,
		});

		invalidateQuery();
		invalidateVislonFinishingProdLog();

		return;
	};

	return (
		<AddModal
			id='TeethMoldingProdModal'
			title={'Finishing Production'}
			subTitle={`
				${updateFinishingProd.order_number} -> 
				${updateFinishingProd.item_description} -> 
				${updateFinishingProd.style_color_size} 
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
				sub_label={`MAX: ${MAX_PROD} PCS`}
				{...{ register, errors }}
			/>
			<Textarea label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
