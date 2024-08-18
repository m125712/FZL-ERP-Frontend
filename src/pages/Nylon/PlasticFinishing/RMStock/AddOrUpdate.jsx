import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';
import nanoid from '@/lib/nanoid';

//import { useLabDipRM, useLabDipRMLog } from '@/state/LabDip';
import {
	useNylonMetallicFinishingRM,
	useNylonMetallicFinishingRMLog,
} from '@/state/Nylon';
import { Input, JoinInput } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { RM_MATERIAL_USED_NULL, RM_MATERIAL_USED_SCHEMA } from '@util/Schema';
import * as yup from 'yup';

export default function Index({
	modalId = '',
	updateFinishingStock = {
		uuid: null,
		unit: null,
		stock: null,
		section: null,
	},
	setUpdateFinishingStock,
}) {
	const { user } = useAuth();
	const { url, postData } = useNylonMetallicFinishingRM();
	const { invalidateQuery: invalidateFinishingRMLog } =
		useNylonMetallicFinishingRMLog();
	const MAX_QUANTITY = updateFinishingStock?.stock;

	const schema = {
		used_quantity: RM_MATERIAL_USED_SCHEMA.remaining.max(
			updateFinishingStock?.stock
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
		setUpdateFinishingStock((prev) => ({
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

			material_uuid: updateFinishingStock?.uuid,
			section: updateFinishingStock?.section,
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
		invalidateFinishingRMLog();
	};

	return (
		<AddModal
			id={modalId}
			title={
				updateFinishingStock?.uuid !== null && 'Material Usage Entry'
			}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				label='used_quantity'
				sub_label={`Max: ${Number(updateFinishingStock?.stock)}`}
				unit={updateFinishingStock?.unit}
				max={updateFinishingStock?.stock}
				placeholder={`Max: ${Number(updateFinishingStock?.stock)}`}
				{...{ register, errors }}
			/>
			<JoinInput
				label='wastage'
				unit={updateFinishingStock?.unit}
				sub_label={`Max: ${(updateFinishingStock?.stock -
					watch('used_quantity') <
				0
					? 0
					: updateFinishingStock?.stock - watch('used_quantity')
				).toFixed(2)}`}
				placeholder={`Max: ${(updateFinishingStock?.stock -
					watch('used_quantity') <
				0
					? 0
					: updateFinishingStock?.stock - watch('used_quantity')
				).toFixed(2)}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
