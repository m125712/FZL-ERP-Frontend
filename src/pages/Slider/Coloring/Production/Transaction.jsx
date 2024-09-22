import { useAuth } from '@/context/auth';
import {
	useSliderAssemblyTransferEntry,
	useSliderColoringProduction,
} from '@/state/Slider';
import { DevTool } from '@hookform/devtools';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { Input, JoinInput } from '@/ui';

import nanoid from '@/lib/nanoid';
import {
	NUMBER_REQUIRED,
	NUMBER_DOUBLE_REQUIRED,
	SLIDER_ASSEMBLY_TRANSACTION_NULL,
	SLIDER_ASSEMBLY_TRANSACTION_SCHEMA,
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
	const { postData, url } = useSliderAssemblyTransferEntry();
	const { invalidateQuery } = useSliderColoringProduction();
	const { user } = useAuth();

	const { register, handleSubmit, errors, reset, watch, control, context } =
		useRHF(
			{
				...SLIDER_ASSEMBLY_TRANSACTION_SCHEMA,
				trx_quantity: NUMBER_REQUIRED.max(
					updateSliderTrx?.coloring_prod,
					'Beyond Max Quantity'
				),
				weight: NUMBER_DOUBLE_REQUIRED,
			},
			SLIDER_ASSEMBLY_TRANSACTION_NULL
		);

	const onClose = () => {
		setUpdateSliderTrx((prev) => ({
			...prev,
			uuid: null,
			stock_uuid: null,
			slider_item_uuid: null,
			trx_from: null,
			trx_to: null,
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
				sub_label={`MAX: ${Number(updateSliderTrx?.coloring_prod)} KG`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
