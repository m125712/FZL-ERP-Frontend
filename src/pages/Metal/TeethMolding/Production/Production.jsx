import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useRHF, useUpdateFunc } from '@/hooks';
import { Input, JoinInput, Textarea } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { SFG_PRODUCTION_SCHEMA } from '@util/Schema';
import { DevTool } from '@hookform/devtools';
import {
	METAL_TEETH_MOLDING_PRODUCTION_SCHEMA,
	METAL_TEETH_MOLDING_PRODUCTION_SCHEMA_NULL,
} from '@util/Schema';
import nanoid from '@/lib/nanoid';
import { useMetalTMProduction } from '@/state/Metal';

export default function Index({
	modalId = '',
	setTeethMoldingProd,
	updateTeethMoldingProd = {
		id: null,
		name: '',
		teeth_molding_stock: null,
		teeth_molding_prod: null,
		order_entry_id: null,
		item_description: null,
		total_trx_quantity: null,
		order_number: '',
		order_description: '',
		quantity: null,
	},
	setUpdateTeethMoldingProd,
}) {
	const { data, url, updateData, postData, deleteData, isLoading } =
		useMetalTMProduction();
	const { user } = useAuth();
	const MAX_SLIDER_PRODUCTION_QUANTITY =
		updateTeethMoldingProd?.quantity -
		(updateTeethMoldingProd?.total_trx_quantity +
			updateTeethMoldingProd?.teeth_molding_prod);

	const MAX_USED_QUANTITY = updateTeethMoldingProd?.teeth_molding_stock;
	const schema = {
		...SFG_PRODUCTION_SCHEMA,
		production_quantity: SFG_PRODUCTION_SCHEMA.production_quantity.max(
			MAX_SLIDER_PRODUCTION_QUANTITY
		),
		used_quantity:
			SFG_PRODUCTION_SCHEMA.production_quantity.max(MAX_USED_QUANTITY),
	};
	const { register, handleSubmit, errors, reset, watch, control } = useRHF(
		METAL_TEETH_MOLDING_PRODUCTION_SCHEMA,
		METAL_TEETH_MOLDING_PRODUCTION_SCHEMA_NULL
	);

	const onClose = () => {
		setUpdateTeethMoldingProd((prev) => ({
			...prev,
			id: null,
			name: '',
			teeth_molding_stock: null,
			teeth_molding_prod: null,
			order_entry_id: null,
			item_description: null,
			total_trx_quantity: null,
			order_number: '',
			order_description: '',
		}));
		reset(METAL_TEETH_MOLDING_PRODUCTION_SCHEMA_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			uuid: nanoid(),
			sfg_uuid: modalData?.sfg_uuid,
			section: 'teeth_molding',
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url,
			newData: updatedData,
			onClose,
		});
	};

	return (
		<AddModal
			id='TeethMoldingProdModal'
			title={'Teeth Molding Production'}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				title='Production Quantity'
				label='production_quantity_in_kg'
				unit='KG'
				placeholder={`Max: ${MAX_SLIDER_PRODUCTION_QUANTITY}`}
				{...{ register, errors }}
			/>
			<JoinInput
				title='wastage'
				label='wastage'
				unit='KG'
				placeholder={`Max: ${(
					MAX_USED_QUANTITY - watch('used_quantity')
				).toFixed(2)}`}
				{...{ register, errors }}
				{...{ register, errors }}
			/>
			<Textarea label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
