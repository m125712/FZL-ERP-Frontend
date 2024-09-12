import { AddModal } from '@/components/Modal';
import { ShowLocalToast } from '@/components/Toast';
import { useAuth } from '@/context/auth';
import { useRHF } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useCommonCoilRMLog, useCommonMaterialUsed } from '@/state/Common';
import { Input, JoinInput } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { RM_MATERIAL_USED_NULL, RM_MATERIAL_USED_SCHEMA } from '@util/Schema';
import { useCallback } from 'react';

export default function Index({
	modalId = '',
	updateCoilStock = {
		uuid: null,
		unit: null,
		coil_forming: null,
	},
	setUpdateCoilStock,
}) {
	const { postData, url } = useCommonMaterialUsed();
	const { invalidateQuery: invalidateCoilRMLog } = useCommonCoilRMLog();
	const MAX_QUANTITY = updateCoilStock?.coil_forming;
	const { user } = useAuth();
	const schema = {
		used_quantity: RM_MATERIAL_USED_SCHEMA.remaining.max(
			updateCoilStock?.coil_forming
		),
		wastage: RM_MATERIAL_USED_SCHEMA.remaining,
	};

	const { register, handleSubmit, errors, reset, watch, context } = useRHF(
		schema,
		RM_MATERIAL_USED_NULL
	);
	const getTotalQty = useCallback(
		(used_quantity) => Number(used_quantity),
		[watch()]
	);

	const MAX_WASTAGE = MAX_QUANTITY - watch('used_quantity');

	const onClose = () => {
		setUpdateCoilStock((prev) => ({
			...prev,
			uuid: null,
			unit: null,
			coil_forming: null,
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

			material_uuid: updateCoilStock?.uuid,
			section: 'coil_forming',
			created_by: user?.uuid,
			created_by_name: user?.name,
			uuid: nanoid(),
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url,
			newData: updatedData,
			onClose,
		});
		invalidateCoilRMLog();
	};

	return (
		<AddModal
			id={modalId}
			title={updateCoilStock?.uuid !== null && 'Material Usage Entry'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				label='used_quantity'
				sub_label={`Max: ${Number(updateCoilStock?.coil_forming)}`}
				unit={updateCoilStock?.unit}
				max={updateCoilStock?.coil_forming}
				placeholder={`Max: ${updateCoilStock?.coil_forming}`}
				{...{ register, errors }}
			/>
			<JoinInput
				label='wastage'
				sub_label={`Max: ${Number(
					updateCoilStock?.coil_forming - watch('used_quantity') < 0
						? 0
						: updateCoilStock?.coil_forming - watch('used_quantity')
				)}`}
				unit={updateCoilStock?.unit}
				placeholder={`Max: ${(updateCoilStock?.coil_forming -
					watch('used_quantity') <
				0
					? 0
					: updateCoilStock?.coil_forming - watch('used_quantity')
				).toFixed(2)}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
