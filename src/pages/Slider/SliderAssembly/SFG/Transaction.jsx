import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { Input, JoinInput } from '@/ui';

import { SFG_TRX_NULL, SFG_TRX_SCHEMA } from '@util/Schema';
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
		end_type_name: '',
		order_number: null,
		item_description: '',
		order_description: '',
	},
	setUpdateSliderAssemblyProd,
}) {
	const { user } = useAuth();
	const schema = {
		trx_quantity: SFG_TRX_SCHEMA.trx_quantity.max(
			updateSliderAssemblyProd?.slider_assembly_prod
		),
	};
	const { register, handleSubmit, errors, reset, watch, context } = useRHF(
		schema,
		SFG_TRX_NULL
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
			end_type_name: '',
			order_number: null,
			item_description: '',
			order_description: '',
		}));
		reset(SFG_TRX_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			name: updateSliderAssemblyProd?.name,
			order_number: updateSliderAssemblyProd?.order_number,
			item_description: updateSliderAssemblyProd?.item_description,
			order_description: updateSliderAssemblyProd?.order_description,
			order_entry_id: updateSliderAssemblyProd?.order_entry_id,
			slider_assembly_stock:
				updateSliderAssemblyProd?.slider_assembly_stock,
			slider_assembly_prod:
				updateSliderAssemblyProd?.slider_assembly_prod -
				data.trx_quantity,
			total_trx_quantity:
				updateSliderAssemblyProd?.total_trx_quantity +
				data.trx_quantity,
			end_type_name: updateSliderAssemblyProd?.end_type_name,
			trx_from: 'slider_assembly_prod',
			trx_to: 'coloring_stock',
			name: updateSliderAssemblyProd?.name,
			issued_by: user?.id,
			issued_by_name: user?.name,
			created_at: GetDateTime(),
		};
		if (updatedData.trx_quantity > 0) {
			await useUpdateFunc({
				uri: `/sfg/trx`,
				itemId: updateSliderAssemblyProd?.id,
				data: data,
				updatedData: updatedData,
				setItems: setSliderAssemblyProd,
				onClose: onClose,
			});
		} else {
			alert(
				'Remaining trx_quantity should be less than stock trx_quantity'
			);
			return;
		}
	};

	return (
		<AddModal
			id='SliderAssemblyTrxModal'
			title={`Assembly ⇾ Coloring`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<JoinInput
				label='trx_quantity'
				unit='PCS'
				max={updateSliderAssemblyProd?.slider_assembly_prod}
				placeholder={`Max: ${updateSliderAssemblyProd?.slider_assembly_prod}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
