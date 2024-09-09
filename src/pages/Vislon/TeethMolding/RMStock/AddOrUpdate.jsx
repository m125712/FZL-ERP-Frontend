import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';
import nanoid from '@/lib/nanoid';

import { useVislonTMRM, useVislonTMRMLog } from '@/state/Vislon';
import { Input, JoinInput } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { RM_MATERIAL_USED_NULL, RM_MATERIAL_USED_SCHEMA } from '@util/Schema';
import * as yup from 'yup';

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
		wastage: RM_MATERIAL_USED_SCHEMA.remaining.max(
			MAX_QUANTITY,
			'Must be less than or equal ${MAX_QUANTITY}'
		),
	};

	const { register, handleSubmit, errors, reset, watch, context } = useRHF(
		schema,
		RM_MATERIAL_USED_NULL
	);

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
				sub_label={`Max: ${(updateVislonTMStock?.v_teeth_molding -
					watch('used_quantity') <
				0
					? 0
					: updateVislonTMStock?.v_teeth_molding -
						watch('used_quantity')
				).toFixed(2)}`}
				placeholder={`Max: ${(updateVislonTMStock?.v_teeth_molding -
					watch('used_quantity') <
				0
					? 0
					: updateVislonTMStock?.v_teeth_molding -
						watch('used_quantity')
				).toFixed(2)}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
