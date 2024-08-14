import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useCommonCoilRM } from '@/state/Common';
import { Input, JoinInput } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { RM_MATERIAL_USED_NULL, RM_MATERIAL_USED_SCHEMA } from '@util/Schema';
import * as yup from 'yup';

export default function Index({
	modalId = '',
	updateCoilStock = {
		uuid: null,
		unit: null,
		coil_forming: null,
	},
	setUpdateCoilStock,
}) {
	const { url, postData } = useCommonCoilRM();
	const MAX_QUANTITY = updateCoilStock?.coil_forming;
	const schema = {
		used_quantity: RM_MATERIAL_USED_SCHEMA.remaining.max(
			updateCoilStock?.coil_forming
		),
		wastage: RM_MATERIAL_USED_SCHEMA.remaining.max(MAX_QUANTITY),
	};

	const { register, handleSubmit, errors, reset, watch } = useRHF(
		schema,
		RM_MATERIAL_USED_NULL
	);

	useFetchForRhfReset(
		`${url}/${updateCoilStock?.uuid}`,
		updateCoilStock?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateCoilStock((prev) => ({
			...prev,
			uuid: null,
			unit: null,
		}));
		reset(RM_MATERIAL_USED_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
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
			url: '/material/used',
			newData: updatedData,
			onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={updateCoilStock?.uuid !== null && 'Material Usage Entry'}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				label='used_quantity'
				sub_label={`Max: ${updateCoilStock?.coil_forming}`}
				unit={updateCoilStock?.unit}
				max={updateCoilStock?.coil_forming}
				placeholder={`Max: ${updateCoilStock?.coil_forming}`}
				{...{ register, errors }}
			/>
			<JoinInput
				label='wastage'
				sub_label={`Max: ${(updateCoilStock?.coil_forming -
					watch('used_quantity') <
				0
					? 0
					: updateCoilStock?.coil_forming - watch('used_quantity')
				).toFixed(2)}`}
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
