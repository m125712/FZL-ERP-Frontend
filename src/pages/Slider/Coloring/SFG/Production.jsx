import { useAuth } from '@/context/auth';
import {
	useFetchForRhfReset,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from '@/hooks';

import { AddModal } from '@/components/Modal';
import { Input, JoinInput } from '@/ui';

import { SFG_PRODUCTION_NULL, SFG_PRODUCTION_SCHEMA } from '@util/Schema';
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
		total_trx_quantity: null,
		order_number: null,
		item_description: '',
		order_description: '',
		quantity: null,
	},
	setUpdateColoringProd,
}) {
	const { user } = useAuth();
	const schema = {
		...SFG_PRODUCTION_SCHEMA,
		production_quantity: SFG_PRODUCTION_SCHEMA.production_quantity.max(
			updateColoringProd?.coloring_stock
		),
	};
	const { register, handleSubmit, errors, reset, watch, context } = useRHF(
		schema,
		SFG_PRODUCTION_NULL
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
			quantity: null,
		}));
		reset(SFG_PRODUCTION_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			quantity: updateColoringProd?.quantity,
			name: updateColoringProd?.name,
			order_entry_id: updateColoringProd?.order_entry_id,
			order_number: updateColoringProd?.order_number,
			item_description: updateColoringProd?.item_description,
			order_description: updateColoringProd?.order_description,
			coloring_stock:
				updateColoringProd?.coloring_stock -
				(data.production_quantity + data.wastage),
			coloring_prod:
				updateColoringProd?.coloring_prod + data.production_quantity,
			total_trx_quantity: updateColoringProd?.total_trx_quantity,
			used_quantity: 0,
			section: 'coloring',
			issued_by: user?.id,
			created_at: GetDateTime(),
		};

		if (updatedData.production_quantity > 0) {
			await useUpdateFunc({
				uri: `/sfg/production`,
				itemId: updateColoringProd?.id,
				data: data,
				updatedData: updatedData,
				setItems: setColoringProd,
				onClose: onClose,
			});
		} else {
			alert('Quantity should be less than stock quantity');
			return;
		}
	};

	return (
		<AddModal
			id='ColoringProdModal'
			title={'Coloring Production'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<JoinInput
				label='production_quantity'
				unit='PCS'
				max={updateColoringProd?.coloring_stock}
				placeholder={`Max: ${updateColoringProd?.coloring_stock}`}
				{...{ register, errors }}
			/>
			<JoinInput
				label='wastage'
				unit='PCS'
				placeholder={`Max: ${updateColoringProd?.coloring_stock - watch('production_quantity')}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
