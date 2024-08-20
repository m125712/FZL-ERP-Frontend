import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';
import nanoid from '@/lib/nanoid';

//import { useLabDipRM, useLabDipRMLog } from '@/state/LabDip';
import { useMetalTCRM, useMetalTCRMLog } from '@/state/Metal';
import { Input, JoinInput } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { RM_MATERIAL_USED_NULL, RM_MATERIAL_USED_SCHEMA } from '@util/Schema';
import * as yup from 'yup';

export default function Index({
	modalId = '',
	updateTCStock = {
		uuid: null,
		unit: null,
		stock: null,
		section: null,
	},
	setUpdateTCStock,
}) {
	const { user } = useAuth();
	const { url, postData } = useMetalTCRM();
	const { invalidateQuery: invalidateTCRMLog } = useMetalTCRMLog();
	const MAX_QUANTITY = updateTCStock?.stock;

	const schema = {
		used_quantity: RM_MATERIAL_USED_SCHEMA.remaining.max(
			updateTCStock?.stock
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
		setUpdateTCStock((prev) => ({
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

			material_uuid: updateTCStock?.uuid,
			section: updateTCStock?.section,
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
		invalidateTCRMLog();
	};

	return (
		<AddModal
			id={modalId}
			title={updateTCStock?.uuid !== null && 'Material Usage Entry'}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				label='used_quantity'
				sub_label={`Max: ${Number(updateTCStock?.stock)}`}
				unit={updateTCStock?.unit}
				max={updateTCStock?.stock}
				placeholder={`Max: ${Number(updateTCStock?.stock)}`}
				{...{ register, errors }}
			/>
			<JoinInput
				label='wastage'
				unit={updateTCStock?.unit}
				sub_label={`Max: ${(updateTCStock?.stock -
					watch('used_quantity') <
				0
					? 0
					: updateTCStock?.stock - watch('used_quantity')
				).toFixed(2)}`}
				placeholder={`Max: ${(updateTCStock?.stock -
					watch('used_quantity') <
				0
					? 0
					: updateTCStock?.stock - watch('used_quantity')
				).toFixed(2)}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
