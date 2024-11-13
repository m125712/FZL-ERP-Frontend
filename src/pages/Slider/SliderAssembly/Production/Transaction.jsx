import { useAuth } from '@/context/auth';
import {
	useSliderAssemblyProduction,
	useSliderAssemblyTransferEntry,
	useSliderColoringProduction,
} from '@/state/Slider';
import { DevTool } from '@hookform/devtools';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { Input, JoinInput } from '@/ui';

import nanoid from '@/lib/nanoid';
import {
	NUMBER_DOUBLE_REQUIRED,
	NUMBER_REQUIRED,
	SLIDER_ASSEMBLY_TRANSACTION_NULL,
	SLIDER_ASSEMBLY_TRANSACTION_SCHEMA,
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
	const { postData, url } = useSliderAssemblyTransferEntry();
	const { invalidateQuery } = useSliderAssemblyProduction();
	const { invalidateQuery: invalidateVislonFinishingProdLog } =
		useSliderColoringProduction();
	const { user } = useAuth();

	const { register, handleSubmit, errors, reset, watch, control, context } =
		useRHF(
			{
				...SLIDER_ASSEMBLY_TRANSACTION_SCHEMA,
				trx_quantity: NUMBER_REQUIRED.max(
					updateSliderTrx?.sa_prod,
					'Beyond Max Quantity'
				),
				weight: NUMBER_DOUBLE_REQUIRED.max(
					updateSliderTrx?.sa_prod_weight,
					'Beyond Max Quantity'
				),
			},
			SLIDER_ASSEMBLY_TRANSACTION_NULL
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
			stock_uuid: updateSliderTrx?.uuid,
			from_section: 'sa_prod',
			to_section: 'coloring_stock',
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url,
			newData: updatedData,
			onClose,
		});

		invalidateQuery();
		invalidateVislonFinishingProdLog();
	};

	return (
		<AddModal
			id='TeethMoldingTrxModal'
			title='Slider Assembly ⇾ Coloring Stock'
			subTitle={`
				${updateSliderTrx.order_number} -> 
				${updateSliderTrx.item_description} -> 
				${updateSliderTrx.item_name} 
				`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				title='Transaction Quantity'
				label='trx_quantity'
				sub_label={`MAX: ${Number(updateSliderTrx?.sa_prod)} PCS`}
				unit='PCS'
				{...{ register, errors }}
			/>
			<JoinInput
				title='Transaction Weight'
				label='weight'
				sub_label={`MAX: ${Number(updateSliderTrx?.sa_prod_weight)} KG`}
				unit='KG'
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
