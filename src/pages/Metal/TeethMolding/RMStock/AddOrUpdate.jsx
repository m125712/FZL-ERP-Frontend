import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';
import nanoid from '@/lib/nanoid';

import { useMetalTMRM, useMetalTMRMLog } from '@/state/Metal';
import { Input, JoinInput } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { RM_MATERIAL_USED_NULL, RM_MATERIAL_USED_SCHEMA } from '@util/Schema';
import * as yup from 'yup';

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
				sub_label={`Max: ${(updateMetalTMStock?.m_teeth_molding -
					watch('used_quantity') <
				0
					? 0
					: updateMetalTMStock?.m_teeth_molding -
						watch('used_quantity')
				).toFixed(2)}`}
				placeholder={`Max: ${(updateMetalTMStock?.m_teeth_molding -
					watch('used_quantity') <
				0
					? 0
					: updateMetalTMStock?.m_teeth_molding -
						watch('used_quantity')
				).toFixed(2)}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
