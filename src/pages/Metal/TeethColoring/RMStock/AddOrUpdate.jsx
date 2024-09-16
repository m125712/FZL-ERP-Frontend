import { useAuth } from '@/context/auth';
import { useMetalTCRM, useMetalTCRMLog } from '@/state/Metal';
import { useOtherMaterial } from '@/state/Other';
import * as yup from 'yup';
//import { useLabDipRM, useLabDipRMLog } from '@/state/LabDip';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';



import { AddModal } from '@/components/Modal';
import { ShowLocalToast } from '@/components/Toast';
import { Input, JoinInput } from '@/ui';



import nanoid from '@/lib/nanoid';
import { RM_MATERIAL_USED_NULL, RM_MATERIAL_USED_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';





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
	};

	const { register, handleSubmit, errors, reset, watch, context } = useRHF(
		schema,
		RM_MATERIAL_USED_NULL
	);
	const MAX_WASTAGE = MAX_QUANTITY - watch('used_quantity');

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
		if (MAX_WASTAGE < watch('wastage')) {
			ShowLocalToast({
				type: 'error',
				message: 'Beyond Stock',
			});
			return;
		}
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
			formContext={context}
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
				sub_label={`Max:${MAX_WASTAGE}`}
				placeholder={`Max:${MAX_WASTAGE}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}