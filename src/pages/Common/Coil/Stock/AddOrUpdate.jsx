import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';
import { Input, JoinInput } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { RM_MATERIAL_USED_NULL, RM_MATERIAL_USED_SCHEMA } from '@util/Schema';

export default function Index({
	modalId = '',
	updateCoilStock = {
		uuid: null,
		stock: null,
		unit: null,
	},
	setUpdateCoilStock,
}) {
	const { user } = useAuth();

	const schema = {
		remaining: RM_MATERIAL_USED_SCHEMA.remaining.max(
			updateCoilStock?.quantity
		),
		wastage: RM_MATERIAL_USED_SCHEMA.remaining.max(
			updateCoilStock?.quantity
		),
	};

	const { register, handleSubmit, errors, reset, watch } = useRHF(
		schema,
		RM_MATERIAL_USED_NULL
	);

	useFetchForRhfReset(
		`/material/stock/${updateCoilStock?.uuid}`,
		updateCoilStock?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateCoilStock((prev) => ({
			...prev,
			uuid: null,
			stock: null,
			unit: null,
		}));
		reset(RM_MATERIAL_USED_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			quantity: data.remaining,
			used_quantity:
				updateCoilStock?.quantity - data.remaining - data.wastage,
			material_stock_id: updateCoilStock?.uuid,
			section: 'coil_forming',
			issued_by: user?.uuid,
			issued_by_name: user?.name,
			created_at: GetDateTime(),
		};

		if (updatedData?.used_quantity < 0) {
			alert("Wastage can't be greater than remaining");
			return;
		}
		await useUpdateFunc({
			uri: `/material/used`,
			itemId: updateCoilStock?.id,
			data: data,
			updatedData: updatedData,
			setItems: setCoilStock,
			onClose: onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={updateCoilStock?.id !== null && 'Material Usage Entry'}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				label='remaining'
				unit={updateCoilStock?.unit}
				max={updateCoilStock?.quantity}
				placeholder={`Max: ${updateCoilStock?.quantity}`}
				{...{ register, errors }}
			/>
			<JoinInput
				label='wastage'
				unit={updateCoilStock?.unit}
				placeholder={`Max: ${(
					updateCoilStock?.quantity - watch('remaining')
				).toFixed(2)}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
