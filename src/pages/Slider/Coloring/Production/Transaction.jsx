import { useAuth } from '@/context/auth';
import { useMetalFProduction } from '@/state/Metal';
import {
	useNylonMFProduction,
	useNylonPlasticFinishingProduction,
} from '@/state/Nylon';
import {
	useSliderAssemblyTransferEntry,
	useSliderColoringProduction,
} from '@/state/Slider';
import { useVislonFinishingProd } from '@/state/Vislon';
import { DevTool } from '@hookform/devtools';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, JoinInput, ReactSelect } from '@/ui';

import nanoid from '@/lib/nanoid';
import {
	NUMBER_DOUBLE_REQUIRED,
	NUMBER_REQUIRED,
	SLIDER_ASSEMBLY_TRANSACTION_NULL,
	SLIDER_ASSEMBLY_TRANSACTION_SCHEMA,
	STRING,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateSliderTrx = {
		uuid: null,
		stock_uuid: null,
		slider_item_uuid: null,
		trx_from: null,
		trx_to: null,
		trx_quantity: null,
		remarks: '',
	},
	setUpdateSliderTrx,
}) {
	const { postData } = useSliderAssemblyTransferEntry();
	const { invalidateQuery } = useSliderColoringProduction();
	const { invalidateQuery: invalidateVislonFinishingProdLog } =
		useVislonFinishingProd();
	const { invalidateQuery: invalidateNylonMetallicFinishingProdLog } =
		useNylonMFProduction();
	const { invalidateQuery: invalidateNylonPlasticFinishingProdLog } =
		useNylonPlasticFinishingProduction();
	const { invalidateQuery: invalidateNylonFinishingProdLog } =
		useMetalFProduction();

	const { user } = useAuth();

	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		context,
		Controller,
		getValues,
	} = useRHF(
		{
			...SLIDER_ASSEMBLY_TRANSACTION_SCHEMA,
			sfg_uuid: STRING.when({
				is: () => updateSliderTrx?.order_type === 'slider',
				then: (schema) => schema.required('Required'),
				otherwise: (schema) => schema.nullable(),
			}),
			trx_quantity: NUMBER_REQUIRED.max(
				updateSliderTrx?.coloring_prod,
				'Beyond Max Quantity'
			),
			weight: NUMBER_DOUBLE_REQUIRED.max(
				updateSliderTrx?.coloring_prod_weight,
				'Beyond Max Quantity'
			),
		},
		{ ...SLIDER_ASSEMBLY_TRANSACTION_NULL, sfg_uuid: null }
	);

	const onClose = () => {
		setUpdateSliderTrx((prev) => ({
			...prev,
			uuid: null,
			sfg_uuid: null,
			stock_uuid: null,
			slider_item_uuid: null,
			trx_from: null,
			trx_to: null,
			trx_quantity: null,
			remarks: '',
		}));

		reset({ ...SLIDER_ASSEMBLY_TRANSACTION_NULL, sfg_uuid: null });
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			uuid: nanoid(),
			stock_uuid: updateSliderTrx?.uuid,
			from_section: 'coloring_prod',
			to_section: 'trx_to_finishing',
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url: '/slider/transaction',
			newData: updatedData,
			onClose,
		});

		invalidateQuery();
		invalidateVislonFinishingProdLog();
		invalidateNylonMetallicFinishingProdLog();
		invalidateNylonPlasticFinishingProdLog();
		invalidateNylonFinishingProdLog();
	};

	return (
		<AddModal
			id='TeethMoldingTrxModal'
			title='Slider Coloring ⇾ SFG Coloring'
			subTitle={`
				${updateSliderTrx.order_number} -> 
				${updateSliderTrx.item_description} -> 
				${updateSliderTrx.style_color_size} 
				`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			{updateSliderTrx?.order_type === 'slider' && (
				<FormField label='sfg_uuid' title='Style' errors={errors}>
					<Controller
						name='sfg_uuid'
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select style'
									options={updateSliderTrx?.style_object}
									value={updateSliderTrx?.style_object.filter(
										(item) =>
											item.value == getValues('sfg_uuid')
									)}
									onChange={(e) => {
										onChange(e.value);
									}}
								/>
							);
						}}
					/>
				</FormField>
			)}

			<JoinInput
				title='Transaction Quantity'
				label='trx_quantity'
				sub_label={`MAX: ${Number(updateSliderTrx?.coloring_prod)} PCS`}
				unit='PCS'
				{...{ register, errors }}
			/>
			<JoinInput
				title='Transaction Weight'
				label='weight'
				unit='KG'
				sub_label={`MAX: ${Number(updateSliderTrx?.coloring_prod_weight)} KG`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
