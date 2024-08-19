import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useDeliveryRM, useDeliveryRMLog } from '@/state/Delivery';
import { Input, JoinInput } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { RM_MATERIAL_USED_NULL, RM_MATERIAL_USED_SCHEMA } from '@util/Schema';
import * as yup from 'yup';

export default function Index({
	modalId = '',
	updateStock = {
		uuid: null,
		unit: null,
		stock: null,
		section: null,
	},
	setUpdateStock,
}) {
	const { user } = useAuth();
	const { url, postData } = useDeliveryRM();
	const { invalidateQuery: invalidateRMLog } = useDeliveryRMLog();
	const MAX_QUANTITY = updateStock?.stock;

	const schema = {
		used_quantity: RM_MATERIAL_USED_SCHEMA.remaining.max(
			updateStock?.stock
		),
		wastage: RM_MATERIAL_USED_SCHEMA.remaining.max(
			MAX_QUANTITY,
			'Must be less than or equal ${MAX_QUANTITY}'
		),
	};

	const { register, handleSubmit, errors, reset, watch } = useRHF(
		schema,
		RM_MATERIAL_USED_NULL
	);

	const onClose = () => {
		setUpdateStock((prev) => ({
			...prev,
			uuid: null,
			unit: null,
			stock: null,
			section: null,
		}));
		reset(RM_MATERIAL_USED_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,

			material_uuid: updateStock?.uuid,
			section: updateStock?.section,
			created_by: user?.uuid,
			created_by_name: user?.name,
			uuid: nanoid(),
			created_at: GetDateTime(),
		};
		await postData.mutateAsync({
			url: '/material/used',
			newData: updatedData,
			onClose,
		});
		invalidateRMLog();
	};

	return (
		<AddModal
			id={modalId}
			title={updateStock?.uuid !== null && 'Material Usage Entry'}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				label='used_quantity'
				sub_label={`Max: ${Number(updateStock?.stock)}`}
				unit={updateStock?.unit}
				max={updateStock?.stock}
				placeholder={`Max: ${Number(updateStock?.stock)}`}
				{...{ register, errors }}
			/>
			<JoinInput
				label='wastage'
				unit={updateStock?.unit}
				sub_label={`Max: ${(updateStock?.stock -
					watch('used_quantity') <
				0
					? 0
					: updateStock?.stock - watch('used_quantity')
				).toFixed(2)}`}
				placeholder={`Max: ${(updateStock?.stock -
					watch('used_quantity') <
				0
					? 0
					: updateStock?.stock - watch('used_quantity')
				).toFixed(2)}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
