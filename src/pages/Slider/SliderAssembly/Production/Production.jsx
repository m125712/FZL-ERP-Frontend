import { useAuth } from '@/context/auth';
import {
	useSliderAssemblyLogProduction,
	useSliderAssemblyProduction,
	useSliderAssemblyProductionEntry,
} from '@/state/Slider';
import { DevTool } from '@hookform/devtools';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, JoinInput, ReactSelect, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import {
	NUMBER_REQUIRED,
	SLIDER_ASSEMBLY_PRODUCTION_ENTRY_NULL,
	SLIDER_ASSEMBLY_PRODUCTION_ENTRY_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateSliderProd = {
		uuid: null,
		stock_uuid: null,
		production_quantity: null,
		section: null,
		wastage: null,
		remarks: '',
	},
	setUpdateSliderProd,
}) {
	const { postData, url } = useSliderAssemblyProductionEntry();
	const { invalidateQuery } = useSliderAssemblyProduction();
	const { invalidateQuery: invalidateLog } = useSliderAssemblyLogProduction();
	const { user } = useAuth();

	const MAX_PROD_KG = Number(updateSliderProd.balance_quantity).toFixed(3);

	const {
		register,
		handleSubmit,
		errors,
		reset,
		watch,
		control,
		context,
		getValues,
		Controller,
	} = useRHF(
		{
			...SLIDER_ASSEMBLY_PRODUCTION_ENTRY_SCHEMA,
			production_quantity: NUMBER_REQUIRED.when('with_link', {
				is: true,
				then: (schema) =>
					schema.max(
						updateSliderProd.max_sa_quantity_with_link,
						'Beyond Max Quantity'
					),
				otherwise: (schema) =>
					schema.max(
						updateSliderProd.max_sa_quantity_without_link,
						'Beyond Max Quantity'
					),
			}),
		},
		SLIDER_ASSEMBLY_PRODUCTION_ENTRY_NULL
	);

	// TODO: Wastage
	const MAX_WASTAGE_KG = Number(
		MAX_PROD_KG - (watch('production_quantity_in_kg') || 0)
	).toFixed(3);

	const MAX_PROD =
		updateSliderProd?.link_quantity > 0
			? Math.floor(Number(updateSliderProd.max_sa_quantity_with_link))
			: Math.floor(Number(updateSliderProd.max_sa_quantity_without_link));

	const onClose = () => {
		setUpdateSliderProd((prev) => ({
			...prev,
			uuid: null,
			stock_uuid: null,
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
			link: updateSliderProd?.link_quantity,
			section: 'sa_prod',
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url,
			newData: updatedData,
			onClose,
		});

		invalidateQuery();
		invalidateLog();
		return;
	};

	return (
		<AddModal
			id='TeethMoldingProdModal'
			title={'Slider Assembly ⇾ Production'}
			subTitle={`
				${updateSliderProd.order_number} -> 
				${updateSliderProd.item_description} -> 
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
				sub_label={`MAX: ${MAX_PROD} PCS`}
				{...{ register, errors }}
			/>
			<JoinInput
				title='Production Weight'
				label='weight'
				unit='KG'
				sub_label={`MAX: ${MAX_PROD} KG`}
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
