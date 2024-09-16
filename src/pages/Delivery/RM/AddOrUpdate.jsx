import { useAuth } from '@/context/auth';
import { useDeliveryRM, useDeliveryRMLog } from '@/state/Delivery';
import * as yup from 'yup';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { ShowLocalToast } from '@/components/Toast';
import { Input, JoinInput } from '@/ui';

import nanoid from '@/lib/nanoid';
import { RM_MATERIAL_USED_NULL, RM_MATERIAL_USED_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateStock = {
		uuid: null,
		unit: null,
		stock: null,
		section: null,
		wastage: null,
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
	};

	const { register, handleSubmit, errors, reset, watch, context } = useRHF(
		schema,
		RM_MATERIAL_USED_NULL
	);
	const MAX_WASTAGE = MAX_QUANTITY - watch('used_quantity');

	const onClose = () => {
		setUpdateStock((prev) => ({
			...prev,
			uuid: null,
			unit: null,
			stock: null,
			section: null,
			wastage: null,
		}));
		reset(RM_MATERIAL_USED_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		if (MAX_WASTAGE < watch('wastage')) {
			ShowLocalToast({
				type: 'error',
				message: 'Beyond Stock',
			});
			return;
		}
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
			formContext={context}
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
				sub_label={`Max:${MAX_WASTAGE}`}
				placeholder={`Max:${MAX_WASTAGE}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
