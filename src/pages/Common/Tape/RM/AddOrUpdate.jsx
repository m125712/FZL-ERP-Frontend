import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useCommonTapeRM, useCommonTapeRMLog } from '@/state/Common';
import { Input, JoinInput } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { RM_MATERIAL_USED_NULL, RM_MATERIAL_USED_SCHEMA } from '@util/Schema';
import * as yup from 'yup';

export default function Index({
	modalId = '',
	updateTapeStock = {
		uuid: null,
		unit: null,
		tape_making: null,
	},
	setUpdateTapeStock,
}) {
	const { user } = useAuth();
	const { url, postData } = useCommonTapeRM();
	const { invalidateQuery: invalidateCommonTapeRMLog } = useCommonTapeRMLog();
	const MAX_QUANTITY = updateTapeStock?.tape_making;

	const schema = {
		used_quantity: RM_MATERIAL_USED_SCHEMA.remaining.max(
			updateTapeStock?.tape_making
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
		setUpdateTapeStock((prev) => ({
			...prev,
			uuid: null,
			unit: null,
			tape_making: null,
		}));
		reset(RM_MATERIAL_USED_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,

			material_uuid: updateTapeStock?.uuid,
			section: 'tape_making',
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
		invalidateCommonTapeRMLog(); 
	};

	return (
		<AddModal
			id={modalId}
			title={updateTapeStock?.uuid !== null && 'Material Usage Entry'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				label='used_quantity'
				sub_label={`Max: ${Number(updateTapeStock?.tape_making)}`}
				unit={updateTapeStock?.unit}
				max={updateTapeStock?.tape_making}
				placeholder={`Max: ${Number(updateTapeStock?.tape_making)}`}
				{...{ register, errors }}
			/>
			<JoinInput
				label='wastage'
				unit={updateTapeStock?.unit}
				sub_label={`Max: ${(updateTapeStock?.tape_making -
					watch('used_quantity') <
				0
					? 0
					: updateTapeStock?.tape_making - watch('used_quantity')
				).toFixed(2)}`}
				placeholder={`Max: ${(updateTapeStock?.tape_making -
					watch('used_quantity') <
				0
					? 0
					: updateTapeStock?.tape_making - watch('used_quantity')
				).toFixed(2)}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
