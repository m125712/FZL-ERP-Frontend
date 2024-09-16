import { useAuth } from '@/context/auth';
import { useMetalTMRM, useMetalTMRMLog } from '@/state/Metal';
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
	updateMetalTMStock = {
		uuid: null,
		unit: null,
		m_teeth_molding: null,
	},
	setUpdateMetalTMStock,
}) {
	const { user } = useAuth();
	const { url, postData } = useMetalTMRM();
	const { invalidateQuery: invalidateMetalTMRMLog } = useMetalTMRMLog();
	const MAX_QUANTITY = updateMetalTMStock?.m_teeth_molding;

	const schema = {
		used_quantity: RM_MATERIAL_USED_SCHEMA.remaining.max(
			updateMetalTMStock?.m_teeth_molding
		),
	};

	const { register, handleSubmit, errors, reset, watch, context } = useRHF(
		schema,
		RM_MATERIAL_USED_NULL
	);
	const MAX_WASTAGE = MAX_QUANTITY - watch('used_quantity');

	const onClose = () => {
		setUpdateMetalTMStock((prev) => ({
			...prev,
			uuid: null,
			unit: null,
			m_teeth_molding: null,
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

			material_uuid: updateMetalTMStock?.uuid,
			section: 'm_teeth_molding',
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
		invalidateMetalTMRMLog();
	};

	return (
		<AddModal
			id={modalId}
			title={updateMetalTMStock?.uuid !== null && 'Material Usage Entry'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				label='used_quantity'
				sub_label={`Max: ${Number(updateMetalTMStock?.m_teeth_molding)}`}
				unit={updateMetalTMStock?.unit}
				max={updateMetalTMStock?.m_teeth_molding}
				placeholder={`Max: ${Number(updateMetalTMStock?.m_teeth_molding)}`}
				{...{ register, errors }}
			/>
			<JoinInput
				label='wastage'
				unit={updateMetalTMStock?.unit}
				sub_label={`Max:${MAX_WASTAGE}`}
				placeholder={`Max:${MAX_WASTAGE}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
