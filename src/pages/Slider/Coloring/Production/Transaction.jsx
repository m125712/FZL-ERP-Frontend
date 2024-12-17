import { useState } from 'react';
import { useAuth } from '@/context/auth';
import { useMetalFProduction, useMetalTMProduction } from '@/state/Metal';
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
	const [styleObject, setStyleObject] = useState({
		label: null,
		value: null,
		left_quantity: 0,
		given_quantity: 0,
	});
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
	const { invalidateQuery: invalidateMetalTMProduction } =
		useMetalTMProduction();
	const { user } = useAuth();

	const MAX_TRX =
		updateSliderTrx?.order_type === 'slider'
			? Math.min(
					updateSliderTrx?.coloring_prod,
					styleObject?.left_quantity
				)
			: Number(updateSliderTrx?.coloring_prod);

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
			finishing_batch_entry_uuid: STRING.when({
				is: () => updateSliderTrx?.order_type === 'slider',
				then: (schema) => schema.required('Required'),
				otherwise: (schema) => schema.nullable(),
			}),
			trx_quantity: NUMBER_REQUIRED.max(
				updateSliderTrx?.coloring_prod,
				'Beyond Max Quantity'
			).moreThan(0, 'More than 0'),
			weight: NUMBER_DOUBLE_REQUIRED.max(
				updateSliderTrx?.coloring_prod_weight,
				'Beyond Max Quantity'
			),
		},
		{
			...SLIDER_ASSEMBLY_TRANSACTION_NULL,
			finishing_batch_entry_uuid: null,
		}
	);

	const onClose = () => {
		setUpdateSliderTrx((prev) => ({
			...prev,
			uuid: null,
			finishing_batch_entry_uuid: null,
			stock_uuid: null,
			slider_item_uuid: null,
			trx_from: null,
			trx_to: null,
			trx_quantity: null,
			remarks: '',
		}));

		setStyleObject({
			label: null,
			value: null,
			left_quantity: 0,
			given_quantity: 0,
		});

		reset({
			...SLIDER_ASSEMBLY_TRANSACTION_NULL,
			finishing_batch_entry_uuid: null,
		});
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
		invalidateMetalTMProduction();
	};

	const styleOption = updateSliderTrx?.style_object?.map((item) => ({
		value: item.value,
		label:
			item.label +
			' -> ' +
			item.given_quantity +
			'/' +
			item.left_quantity,
		given_quantity: item.given_quantity,
		left_quantity: item.left_quantity,
	}));

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
				<FormField
					label='finishing_batch_entry_uuid'
					title='Style'
					errors={errors}>
					<Controller
						name='finishing_batch_entry_uuid'
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select style'
									options={styleOption}
									value={styleOption.filter(
										(item) =>
											item.value ==
											getValues(
												'finishing_batch_entry_uuid'
											)
									)}
									onChange={(e) => {
										onChange(e.value);
										setStyleObject(e);
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
				sub_label={`MAX: ${MAX_TRX} PCS`}
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
