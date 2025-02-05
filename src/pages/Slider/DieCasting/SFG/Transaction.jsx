import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { Input } from '@/ui';

import { SFG_TRX_NULL, SFG_TRX_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	setDieCastingProd,
	updateDieCastingProd = {
		id: null,
		name: '',
		die_casting_stock: null,
		die_casting_prod: null,
		order_entry_id: null,
		order_number: null,
		item_description: '',
		order_description: '',
	},
	setUpdateDieCastingProd,
}) {
	const { user } = useAuth();
	const schema = {
		trx_quantity: SFG_TRX_SCHEMA.trx_quantity.max(
			updateDieCastingProd?.die_casting_prod
		),
	};
	const { register, handleSubmit, errors, reset, watch, context } = useRHF(
		schema,
		SFG_TRX_NULL
	);

	const onClose = () => {
		setUpdateDieCastingProd((prev) => ({
			...prev,
			id: null,
			name: '',
			die_casting_stock: null,
			die_casting_prod: null,
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
			name: updateDieCastingProd?.name,
			order_number: updateDieCastingProd?.order_number,
			item_description: updateDieCastingProd?.item_description,
			order_description: updateDieCastingProd?.order_description,
			order_entry_id: updateDieCastingProd?.order_entry_id,
			die_casting_stock: updateDieCastingProd?.die_casting_stock,
			die_casting_prod:
				updateDieCastingProd?.die_casting_prod - data.trx_quantity,
			total_trx_quantity:
				updateDieCastingProd?.total_trx_quantity + data.trx_quantity,
			end_type_name: updateDieCastingProd?.end_type_name,
			stopper_type_name: updateDieCastingProd?.stopper_type_name,
			trx_from: 'die_casting_prod',
			trx_to: 'slider_assembly_stock',
			name: updateDieCastingProd?.name,
			issued_by: user?.id,
			issued_by_name: user?.name,
			created_at: GetDateTime(),
		};
		if (updatedData.trx_quantity > 0) {
			await useUpdateFunc({
				uri: `/sfg/trx`,
				itemId: updateDieCastingProd?.id,
				data: data,
				updatedData: updatedData,
				setItems: setDieCastingProd,
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
			id='DieCastingTrxModal'
			title={`DieCasting ⇾ Slider Assembly`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<Input
				label='trx_quantity'
				max={updateDieCastingProd?.die_casting_prod}
				placeholder={`Max: ${updateDieCastingProd?.die_casting_prod}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
