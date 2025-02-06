import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { Input } from '@/ui';

import { SFG_TRX_NULL, SFG_TRX_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	setColoringProd,
	updateColoringProd = {
		id: null,
		name: '',
		coloring_stock: null,
		coloring_prod: null,
		order_entry_id: null,
		order_number: null,
		item_description: '',
		order_description: '',
	},
	setUpdateColoringProd,
}) {
	const { user } = useAuth();
	const schema = {
		trx_quantity: SFG_TRX_SCHEMA.trx_quantity.max(
			updateColoringProd?.coloring_prod
		),
	};
	const { register, handleSubmit, errors, reset, watch, context } = useRHF(
		schema,
		SFG_TRX_NULL
	);

	const onClose = () => {
		setUpdateColoringProd((prev) => ({
			...prev,
			id: null,
			name: '',
			coloring_stock: null,
			coloring_prod: null,
			order_entry_id: null,
			total_trx_quantity: null,
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
			name: updateColoringProd?.name,
			order_number: updateColoringProd?.order_number,
			item_description: updateColoringProd?.item_description,
			order_description: updateColoringProd?.order_description,
			order_entry_id: updateColoringProd?.order_entry_id,
			coloring_stock: updateColoringProd?.coloring_stock,
			coloring_prod:
				updateColoringProd?.coloring_prod - data.trx_quantity,
			total_trx_quantity:
				updateColoringProd?.total_trx_quantity + data.trx_quantity,
			end_type_name: updateColoringProd?.end_type_name,
			stopper_type_name: updateColoringProd?.stopper_type_name,
			trx_from: 'coloring_prod',
			trx_to: 'stopper_stock',
			name: updateColoringProd?.name,
			issued_by: user?.id,
			issued_by_name: user?.name,
			created_at: GetDateTime(),
		};
		if (updatedData.trx_quantity > 0) {
			await useUpdateFunc({
				uri: `/sfg/trx`,
				itemId: updateColoringProd?.id,
				data: data,
				updatedData: updatedData,
				setItems: setColoringProd,
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
			id='ColoringTrxModal'
			title={`Coloring ⇾ Stopper`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<Input
				label='trx_quantity'
				max={updateColoringProd?.coloring_prod}
				placeholder={`Max: ${updateColoringProd?.coloring_prod}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
