import { useAuth } from '@/context/auth';
import { useOtherSliderStockWithDescription } from '@/state/Other';
import {
	useSliderAssemblyStock,
	useSliderAssemblyStockTransaction,
} from '@/state/Slider';
import { DevTool } from '@hookform/devtools';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, JoinInput, ReactSelect } from '@/ui';

import nanoid from '@/lib/nanoid';
import {
	NUMBER_REQUIRED,
	SLIDER_ASSEMBLY_TRANSACTION_NULL,
	SLIDER_ASSEMBLY_TRANSACTION_SCHEMA,
	STRING_REQUIRED,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateSliderTrx = {
		uuid: null,
		stock_uuid: null,
		from_section: null,
		to_section: null,
		trx_quantity: null,
		remarks: '',
	},
	setUpdateSliderTrx,
}) {
	const { postData, invalidateQuery: invalidateAssemblyStock } =
		useSliderAssemblyStock();
	const { invalidateQuery: invalidateAssemblyStockTransaction } =
		useSliderAssemblyStockTransaction();
	const { user } = useAuth();

	const { data: stock } = useOtherSliderStockWithDescription(
		'/other/slider/stock-with-order-description/value/label'
	);

	const {
		register,
		handleSubmit,
		errors,
		reset,
		getValues,
		control,
		context,
		Controller,
	} = useRHF(
		{
			...SLIDER_ASSEMBLY_TRANSACTION_SCHEMA,
			stock_uuid: STRING_REQUIRED,
			trx_quantity: NUMBER_REQUIRED.max(
				updateSliderTrx?.quantity,
				'Beyond Max Quantity'
			).moreThan(0, 'More than 0'),
			weight: SLIDER_ASSEMBLY_TRANSACTION_SCHEMA.weight.max(
				updateSliderTrx?.weight,
				'Beyond Max Quantity'
			),
		},
		{ ...SLIDER_ASSEMBLY_TRANSACTION_NULL, stock_uuid: null }
	);

	const onClose = () => {
		setUpdateSliderTrx((prev) => ({
			...prev,
			uuid: null,
			stock_uuid: null,
			from_section: null,
			to_section: null,
			trx_quantity: null,
			remarks: '',
		}));

		reset(SLIDER_ASSEMBLY_TRANSACTION_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			uuid: nanoid(),
			assembly_stock_uuid: updateSliderTrx?.uuid,
			from_section: 'assembly_stock',
			to_section: 'assembly_stock_to_coloring_stock',
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url: '/slider/transaction',
			newData: updatedData,
			onClose,
		});

		invalidateAssemblyStock();
		invalidateAssemblyStockTransaction();
	};

	return (
		<AddModal
			id={modalId}
			title='Slider Assembly Prod ⇾ Coloring Stock'
			subTitle={`
				${updateSliderTrx.order_number} -> 
				${updateSliderTrx.item_description} -> 
				${updateSliderTrx.item_name} 
				`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<FormField label='stock_uuid' title='Stock' errors={errors}>
				<Controller
					name={'stock_uuid'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Stock'
								options={stock}
								value={stock?.filter(
									(item) =>
										item.value == getValues('stock_uuid')
								)}
								onChange={(e) => onChange(e.value)}
								// isDisabled={order_info_id !== undefined}
							/>
						);
					}}
				/>
			</FormField>
			<JoinInput
				title='Transaction Quantity'
				label='trx_quantity'
				sub_label={`MAX: ${Number(updateSliderTrx?.quantity)} PCS`}
				unit='PCS'
				{...{ register, errors }}
			/>
			<JoinInput
				title='weight'
				label='weight'
				sub_label={`MAX: ${Number(updateSliderTrx?.weight)} KG`}
				unit='KG'
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
