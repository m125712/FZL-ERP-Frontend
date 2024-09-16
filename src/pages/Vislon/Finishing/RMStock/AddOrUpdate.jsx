import { useAuth } from '@/context/auth';
import { useVislonFinishingRM, useVislonFinishingRMLog } from '@/state/Vislon';
import * as yup from 'yup';
//import { useLabDipRM, useLabDipRMLog } from '@/state/LabDip';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { ShowLocalToast } from '@/components/Toast/ReactToastify';
import { Input, JoinInput } from '@/ui';

import nanoid from '@/lib/nanoid';
import { RM_MATERIAL_USED_NULL, RM_MATERIAL_USED_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

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
	const { url, postData } = useVislonFinishingRM();
	const { invalidateQuery: invalidateFinishingRMLog } =
		useVislonFinishingRMLog();
	const MAX_QUANTITY = updateFinishingStock?.stock;

	const schema = {
		used_quantity: RM_MATERIAL_USED_SCHEMA.remaining.max(
			updateFinishingStock?.stock
		),
	};

	const { register, handleSubmit, errors, reset, watch, context } = useRHF(
		schema,
		RM_MATERIAL_USED_NULL
	);
	const MAX_WASTAGE = MAX_QUANTITY - watch('used_quantity');
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
		if (MAX_WASTAGE < watch('wastage')) {
			ShowLocalToast({
				type: 'error',
				message: 'Beyond Stock',
			});
			return;
		}
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
			formContext={context}
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
				sub_label={`Max:${MAX_WASTAGE}`}
				placeholder={`Max:${MAX_WASTAGE}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
