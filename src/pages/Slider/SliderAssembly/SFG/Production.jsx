import { useAuth } from '@/context/auth';
import {
	useFetchForRhfReset,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from '@/hooks';

import { AddModal } from '@/components/Modal';
import { Input, JoinInput } from '@/ui';

import {
	NUMBER_DOUBLE_REQUIRED,
	SFG_PRODUCTION_NULL,
	SFG_PRODUCTION_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	setSliderAssemblyProd,
	updateSliderAssemblyProd = {
		id: null,
		name: '',
		slider_assembly_stock: null,
		slider_assembly_prod: null,
		order_entry_id: null,
		total_trx_quantity: null,
		quantity: null,
		order_number: null,
		item_description: '',
		order_description: '',
	},
	setUpdateSliderAssemblyProd,
}) {
	const { user } = useAuth();
	const schema = {
		production_quantity: NUMBER_DOUBLE_REQUIRED.max(
			updateSliderAssemblyProd?.slider_assembly_stock
		),
	};
	const { register, handleSubmit, errors, reset, watch, context } = useRHF(
		schema,
		SFG_PRODUCTION_NULL
	);

	const onClose = () => {
		setUpdateSliderAssemblyProd((prev) => ({
			...prev,
			id: null,
			name: '',
			slider_assembly_stock: null,
			slider_assembly_prod: null,
			order_entry_id: null,
			total_trx_quantity: null,
			order_number: null,
			item_description: '',
			order_description: '',
		}));
		reset(SFG_PRODUCTION_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			name: updateSliderAssemblyProd?.name,
			order_entry_id: updateSliderAssemblyProd?.order_entry_id,
			order_number: updateSliderAssemblyProd?.order_number,
			item_description: updateSliderAssemblyProd?.item_description,
			order_description: updateSliderAssemblyProd?.order_description,
			slider_assembly_stock:
				updateSliderAssemblyProd?.slider_assembly_stock -
				(data.production_quantity + data.wastage),
			slider_assembly_prod:
				updateSliderAssemblyProd?.slider_assembly_prod +
				data.production_quantity,
			total_trx_quantity: updateSliderAssemblyProd?.total_trx_quantity,
			used_quantity: 0,
			section: 'slider_assembly',
			issued_by: user?.id,
			created_at: GetDateTime(),
		};

		if (updatedData.production_quantity > 0) {
			await useUpdateFunc({
				uri: `/sfg/production`,
				itemId: updateSliderAssemblyProd?.id,
				data: data,
				updatedData: updatedData,
				setItems: setSliderAssemblyProd,
				onClose: onClose,
			});
		} else {
			alert('Quantity should be less than stock quantity');
			return;
		}
	};

	return (
		<AddModal
			id='SliderAssemblyProdModal'
			title={'Assembly Production'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<JoinInput
				label='production_quantity'
				unit='PCS'
				placeholder={`Max: ${updateSliderAssemblyProd?.slider_assembly_stock}`}
				{...{ register, errors }}
			/>
			<JoinInput
				label='wastage'
				unit='PCS'
				placeholder={`Max: ${updateSliderAssemblyProd?.slider_assembly_stock - watch('production_quantity')}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
