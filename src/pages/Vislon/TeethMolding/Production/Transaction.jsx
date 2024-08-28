import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';
import { Input, JoinInput } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import {
	VISLON_TRANSACTION_SCHEMA_NULL,
	VISLON_TRANSACTION_SCHEMA,
} from '@util/Schema';
import { DevTool } from '@hookform/devtools';
import nanoid from '@/lib/nanoid';
import { useVislonTMT } from '@/state/Vislon';

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
		order_number: '',
		order_description: '',
		quantity: null,
	},
	setUpdateTeethMoldingProd,

	transactionData = {
		uuid: null,
		sfg_uuid: null,
		trx_quantity_in_kg: null,
		trx_from: null,
		trx_to: null,
		remarks: '',
	},
	setTransactionData,
}) {
	const { data, url, updateData, postData, deleteData, isLoading } =
		useVislonTMT();
	const { user } = useAuth();
	// const schema = {
	// 	trx_quantity: VISLON_TRANSACTION_SCHEMA.trx_quantity.max(
	// 		updateTeethMoldingProd?.teeth_molding_prod
	// 	),
	// };
	const { register, handleSubmit, errors, reset, watch, control } = useRHF(
		VISLON_TRANSACTION_SCHEMA,
		VISLON_TRANSACTION_SCHEMA_NULL
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
			quantity: null,
		}));

		setTransactionData((prev) => ({
			...prev,
			uuid: null,
			sfg_uuid: null,
			trx_quantity_in_kg: null,
			trx_from: null,
			trx_to: null,
			remarks: '',
		}));
		reset(VISLON_TRANSACTION_SCHEMA_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			uuid: nanoid(),
			sfg_uuid: transactionData?.sfg_uuid,
			trx_from: 'teeth_molding_prod',
			trx_to: 'finishing_stock',
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

	

		await postData.mutateAsync({
			url,
			newData: updatedData,
			onClose,
		});

		// if (updatedData.trx_quantity > 0) {
		// 	await useUpdateFunc({
		// 		uri: `/sfg/trx`,
		// 		itemId: updateTeethMoldingProd?.id,
		// 		data: data,
		// 		updatedData: updatedData,
		// 		setItems: setTeethMoldingProd,
		// 		onClose: onClose,
		// 	});
		// } else {
		// 	alert(
		// 		'Remaining trx_quantity should be less than stock trx_quantity'
		// 	);
		// 	return;
		// }
	};

	return (
		<AddModal
			id='TeethMoldingTrxModal'
			title='Teeth Molding ⇾ Finishing'
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				title='Transaction Quantity'
				label='trx_quantity_in_kg'
				unit='KG'
				max={updateTeethMoldingProd?.teeth_molding_prod}
				placeholder={`Max: ${updateTeethMoldingProd?.teeth_molding_prod}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
