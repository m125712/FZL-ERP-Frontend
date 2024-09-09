import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';
import nanoid from '@/lib/nanoid';

import { useSliderColoringRM, useSliderColoringRMLog } from '@/state/Slider';
import { Input, JoinInput } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { RM_MATERIAL_USED_NULL, RM_MATERIAL_USED_SCHEMA } from '@util/Schema';
import * as yup from 'yup';

export default function Index({
	modalId = '',
	updateSliderColoringStock = {
		uuid: null,
		unit: null,
		coloring: null,
	},
	setUpdateSliderColoringStock,
}) {
	const { user } = useAuth();
	const { url, postData } = useSliderColoringRM();
	const { invalidateQuery: invalidateSliderColoringRMLog } =
		useSliderColoringRMLog();
	const MAX_QUANTITY = updateSliderColoringStock?.coloring;

	const schema = {
		used_quantity: RM_MATERIAL_USED_SCHEMA.remaining.max(
			updateSliderColoringStock?.coloring
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
		setUpdateSliderColoringStock((prev) => ({
			...prev,
			uuid: null,
			unit: null,
			coloring: null,
		}));
		reset(RM_MATERIAL_USED_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,

			material_uuid: updateSliderColoringStock?.uuid,
			section: 'coloring',
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
		invalidateSliderColoringRMLog();
	};

	return (
		<AddModal
			id={modalId}
			title={
				updateSliderColoringStock?.uuid !== null &&
				'Material Usage Entry'
			}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				label='used_quantity'
				sub_label={`Max: ${Number(updateSliderColoringStock?.coloring)}`}
				unit={updateSliderColoringStock?.unit}
				max={updateSliderColoringStock?.coloring}
				placeholder={`Max: ${Number(updateSliderColoringStock?.coloring)}`}
				{...{ register, errors }}
			/>
			<JoinInput
				label='wastage'
				unit={updateSliderColoringStock?.unit}
				sub_label={`Max: ${(updateSliderColoringStock?.coloring -
					watch('used_quantity') <
				0
					? 0
					: updateSliderColoringStock?.coloring -
						watch('used_quantity')
				).toFixed(2)}`}
				placeholder={`Max: ${(updateSliderColoringStock?.coloring -
					watch('used_quantity') <
				0
					? 0
					: updateSliderColoringStock?.coloring -
						watch('used_quantity')
				).toFixed(2)}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
