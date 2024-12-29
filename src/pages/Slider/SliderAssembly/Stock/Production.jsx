import { useAuth } from '@/context/auth';
import {
	useSliderAssemblyStock,
	useSliderAssemblyStockProduction,
	useSliderDieCastingStock,
} from '@/state/Slider';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, JoinInput, ReactSelect, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
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
	const { postData, invalidateQuery: invalidateAssemblyStock } =
		useSliderAssemblyStock();
	const { invalidateQuery: invalidateDieCastingStock } =
		useSliderDieCastingStock();
	const { invalidateQuery: invalidateSliderAssemblyStockProduction } =
		useSliderAssemblyStockProduction();
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
						updateSliderProd.min_quantity_with_link,
						'Beyond Max Quantity'
					),
				otherwise: (schema) =>
					schema.max(
						updateSliderProd.min_quantity_no_link,
						'Beyond Max Quantity'
					),
			}).moreThan(0, 'More than 0'),
		},
		SLIDER_ASSEMBLY_PRODUCTION_ENTRY_NULL
	);

	// TODO: Wastage
	const MAX_WASTAGE_KG = Number(
		MAX_PROD_KG - (watch('production_quantity_in_kg') || 0)
	).toFixed(3);

	const MAX_PROD = watch('with_link')
		? Math.floor(Number(updateSliderProd.min_quantity_with_link))
		: Math.floor(Number(updateSliderProd.min_quantity_no_link));

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
			assembly_stock_uuid: updateSliderProd?.uuid,
			with_link: data.with_link ? 1 : 0,
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url: '/slider/die-casting-to-assembly-stock',
			newData: updatedData,
			onClose,
		});

		invalidateAssemblyStock();
		invalidateDieCastingStock();
		invalidateSliderAssemblyStockProduction();
		return;
	};

	const with_link = [
		{ label: 'Yes', value: 1 },
		{ label: 'No', value: 0 },
	];

	return (
		<AddModal
			id={modalId}
			title={'Slider Stock Assembly ⇾ Production'}
			subTitle={`
				${updateSliderProd.order_number} -> 
				${updateSliderProd.item_description} -> 
				${updateSliderProd.item_name} 
				`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<FormField label='with_link' title='Link' errors={errors}>
				<Controller
					name={'with_link'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Link'
								options={with_link}
								value={with_link?.filter(
									(with_link) =>
										with_link.value ==
										getValues('with_link')
								)}
								onChange={(e) => onChange(e.value)}
								// isDisabled={order_info_id !== undefined}
							/>
						);
					}}
				/>
			</FormField>
			<JoinInput
				title='Production Quantity'
				label='production_quantity'
				unit='PCS'
				sub_label={`MAX: ${MAX_PROD} PCS`}
				{...{ register, errors }}
			/>
			<JoinInput
				title='weight'
				label='weight'
				unit='KG'
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
