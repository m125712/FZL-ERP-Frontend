import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useRHF } from '@/hooks';
import { JoinInput, Textarea } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { DevTool } from '@hookform/devtools';
import {
	NUMBER_REQUIRED,
	NUMBER_DOUBLE_REQUIRED,
	SLIDER_ASSEMBLY_PRODUCTION_ENTRY_NULL,
	SLIDER_ASSEMBLY_PRODUCTION_ENTRY_SCHEMA,
} from '@util/Schema';

import nanoid from '@/lib/nanoid';
import { useSliderAssemblyProductionEntry, useSliderColoringProduction } from '@/state/Slider';

export default function Index({
	modalId = '',
	updateSliderProd = {
		uuid: null,
		stock_uuid: null,
		coloring_stock: null,
		coloring_prod: null,
		production_quantity: null,
		section: null,
		wastage: null,
		remarks: '',
	},
	setUpdateSliderProd,
}) {
	const { postData, url } = useSliderAssemblyProductionEntry();
	const { invalidateQuery} = useSliderColoringProduction();
	const { user } = useAuth();

	const MAX_PROD_KG = Number(updateSliderProd.balance_quantity).toFixed(3);

	const { register, handleSubmit, errors, reset, watch, control, context } =
		useRHF(
			{
				...SLIDER_ASSEMBLY_PRODUCTION_ENTRY_SCHEMA,
				production_quantity: NUMBER_REQUIRED.max(
					updateSliderProd?.coloring_stock,
					'Beyond Max'
				),
				weight: NUMBER_DOUBLE_REQUIRED,
			},
			SLIDER_ASSEMBLY_PRODUCTION_ENTRY_NULL
		);

	const MAX_WASTAGE_KG = Number(
		MAX_PROD_KG - (watch('production_quantity_in_kg') || 0)
	).toFixed(3);

	const onClose = () => {
		setUpdateSliderProd((prev) => ({
			...prev,
			uuid: null,
			stock_uuid: null,
			coloring_stock: null,
			coloring_prod: null,
			production_quantity: null,
			section: null,
			wastage: null,
			remarks: '',
		}));

		reset(SLIDER_ASSEMBLY_PRODUCTION_ENTRY_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			uuid: nanoid(),
			stock_uuid: updateSliderProd?.uuid,
			coloring_stock: updateSliderProd?.coloring_stock,
			coloring_prod: updateSliderProd?.coloring_prod,
			with_link: data.with_link ? 1 : 0,
			section: 'coloring',
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url,
			newData: updatedData,
			onClose,
		});

		invalidateQuery();
	};

	return (
		<AddModal
			id='TeethMoldingProdModal'
			title={'Slider Coloring ⇾ Production'}
			subTitle={`
				${updateSliderProd.order_info_uuid} -> 
				${updateSliderProd.item_name} 
				`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				title='Production Quantity'
				label='production_quantity'
				unit='PCS'
				sub_label={`MAX: ${Number(updateSliderProd?.coloring_stock)} PCS`}
				{...{ register, errors }}
			/>
			<JoinInput
				title='Production Weight'
				label='weight'
				unit='KG'
				sub_label={`MAX: ${Number(updateSliderProd?.coloring_stock)} KG`}
				{...{ register, errors }}
			/>
			<JoinInput
				title='wastage'
				label='wastage'
				unit='PCS'
				sub_label={`MAX: ${MAX_WASTAGE_KG} PCS`}
				{...{ register, errors }}
			/>
			<Textarea label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
