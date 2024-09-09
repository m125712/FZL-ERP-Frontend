import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useRHF, useUpdateFunc } from '@/hooks';
import { Input, JoinInput } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { SFG_PRODUCTION_NULL, SFG_PRODUCTION_SCHEMA } from '@util/Schema';

export default function Index({
	modalId = '',
	setTeethColoringProd,
	updateTeethColoringProd = {
		id: null,
		name: '',
		teeth_coloring_stock: null,
		teeth_coloring_prod: null,
		order_entry_id: null,
		item_description: null,
		total_trx_quantity: null,
		order_number: '',
		order_description: '',
	},
	setUpdateTeethColoringProd,
}) {
	const { user } = useAuth();
	const schema = {
		...SFG_PRODUCTION_SCHEMA,
		production_quantity: SFG_PRODUCTION_SCHEMA.production_quantity.max(
			updateTeethColoringProd?.teeth_coloring_stock
		),
	};
	const { register, handleSubmit, errors, reset, watch, context } = useRHF(
		schema,
		SFG_PRODUCTION_NULL
	);

	const onClose = () => {
		setUpdateTeethColoringProd((prev) => ({
			...prev,
			id: null,
			name: '',
			teeth_coloring_stock: null,
			teeth_coloring_prod: null,
			order_entry_id: null,
			item_description: null,
			total_trx_quantity: null,
			order_number: '',
			order_description: '',
		}));
		reset(SFG_PRODUCTION_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			name: updateTeethColoringProd?.name,
			order_entry_id: updateTeethColoringProd?.order_entry_id,
			order_number: updateTeethColoringProd?.order_number,
			order_description: updateTeethColoringProd?.order_description,
			item_description: updateTeethColoringProd?.item_description,
			teeth_coloring_stock:
				Number(updateTeethColoringProd?.teeth_coloring_stock) -
				(data.production_quantity + data.wastage),
			teeth_coloring_prod:
				updateTeethColoringProd?.teeth_coloring_prod +
				data.production_quantity,
			total_trx_quantity: updateTeethColoringProd?.total_trx_quantity,
			used_quantity: 0,
			section: 'teeth_coloring',
			issued_by: user?.id,
			created_at: GetDateTime(),
		};

		if (updatedData.production_quantity > 0) {
			await useUpdateFunc({
				uri: `/sfg/production`,
				itemId: updateTeethColoringProd?.id,
				data: data,
				updatedData: updatedData,
				setItems: setTeethColoringProd,
				onClose: onClose,
			});
		} else {
			alert('Quantity should be less than stock quantity');
			return;
		}
	};

	return (
		<AddModal
			id='TeethColoringProdModal'
			title={'Teeth Coloring Production'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				label='production_quantity'
				unit='PCS'
				placeholder={`Max: ${updateTeethColoringProd?.teeth_coloring_stock}`}
				{...{ register, errors }}
			/>
			<JoinInput
				label='wastage'
				unit='PCS'
				placeholder={`Max: ${updateTeethColoringProd?.teeth_coloring_stock - watch('production_quantity')}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
