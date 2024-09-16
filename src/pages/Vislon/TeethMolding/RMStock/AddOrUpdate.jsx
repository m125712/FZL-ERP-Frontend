import { useAuth } from '@/context/auth';
import { useVislonTMRM, useVislonTMRMLog } from '@/state/Vislon';
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
	updateVislonTMStock = {
		uuid: null,
		unit: null,
		v_teeth_molding: null,
	},
	setUpdateVislonTMStock,
}) {
	const { user } = useAuth();
	const { url, postData } = useVislonTMRM();
	const { invalidateQuery: invalidateVislonTMRMLog } = useVislonTMRMLog();
	const MAX_QUANTITY = updateVislonTMStock?.v_teeth_molding;

	const schema = {
		used_quantity: RM_MATERIAL_USED_SCHEMA.remaining.max(
			updateVislonTMStock?.v_teeth_molding
		),
	};

	const { register, handleSubmit, errors, reset, watch, context } = useRHF(
		schema,
		RM_MATERIAL_USED_NULL
	);
	const MAX_WASTAGE = MAX_QUANTITY - watch('used_quantity');
	const onClose = () => {
		setUpdateVislonTMStock((prev) => ({
			...prev,
			uuid: null,
			unit: null,
			v_teeth_molding: null,
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

			material_uuid: updateVislonTMStock?.uuid,
			section: 'v_teeth_molding',
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
		invalidateVislonTMRMLog();
	};

	return (
		<AddModal
			id={modalId}
			title={updateVislonTMStock?.uuid !== null && 'Material Usage Entry'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				label='used_quantity'
				sub_label={`Max: ${Number(updateVislonTMStock?.v_teeth_molding)}`}
				unit={updateVislonTMStock?.unit}
				max={updateVislonTMStock?.v_teeth_molding}
				placeholder={`Max: ${Number(updateVislonTMStock?.v_teeth_molding)}`}
				{...{ register, errors }}
			/>
			<JoinInput
				label='wastage'
				unit={updateVislonTMStock?.unit}
				sub_label={`Max:${MAX_WASTAGE}`}
				placeholder={`Max:${MAX_WASTAGE}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
