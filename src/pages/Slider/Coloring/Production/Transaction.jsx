import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useRHF } from '@/hooks';
import { Input, JoinInput } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import {
	SLIDER_ASSEMBLY_TRANSACTION_SCHEMA,
	SLIDER_ASSEMBLY_TRANSACTION_NULL,
	NUMBER_REQUIRED,
} from '@util/Schema';

import { DevTool } from '@hookform/devtools';
import nanoid from '@/lib/nanoid';
import { useSliderAssemblyTransferEntry } from '@/state/Slider';

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
	const { user } = useAuth();

	const { register, handleSubmit, errors, reset, watch, control } = useRHF(
		SLIDER_ASSEMBLY_TRANSACTION_SCHEMA,
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
			slider_item_uuid: updateSliderTrx?.uuid,
			stock_uuid: updateSliderTrx?.uuid,
			trx_from: 'coloring_prod',
			trx_to: 'coloring_prod',
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		

		await postData.mutateAsync({
			url: '/zipper/sfg-transaction',
			newData: updatedData,
			onClose,
		});
	};

	return (
		<AddModal
			id='TeethMoldingTrxModal'
			title='Slider Assembly ⇾ Coloring Stock'
			subTitle={`
				${updateSliderTrx.order_number} -> 
				${updateSliderTrx.item_description} -> 
				${updateSliderTrx.style_color_size} 
				`}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				title='Transaction Quantity'
				label='trx_quantity'
				sub_label={`MAX: ${Number(updateSliderTrx?.teeth_molding_prod)} KG`}
				unit='KG'
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
