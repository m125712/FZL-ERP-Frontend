import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';
import nanoid from '@/lib/nanoid';

import {
	useSliderDieCastingRM,
	useSliderDieCastingRMLog,
} from '@/state/Slider';
import { Input, JoinInput } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { RM_MATERIAL_USED_NULL, RM_MATERIAL_USED_SCHEMA } from '@util/Schema';
import * as yup from 'yup';

export default function Index({
	modalId = '',
	updateSliderDieCastingStock = {
		uuid: null,
		unit: null,
		die_casting: null,
	},
	setUpdateSliderDieCastingStock,
}) {
	const { user } = useAuth();
	const { url, postData } = useSliderDieCastingRM();
	const { invalidateQuery: invalidateSliderDieCastingRMLog } =
		useSliderDieCastingRMLog();
	const MAX_QUANTITY = updateSliderDieCastingStock?.die_casting;

	const schema = {
		used_quantity: RM_MATERIAL_USED_SCHEMA.remaining.max(
			updateSliderDieCastingStock?.die_casting
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
		setUpdateSliderDieCastingStock((prev) => ({
			...prev,
			uuid: null,
			unit: null,
			die_casting: null,
		}));
		reset(RM_MATERIAL_USED_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,

			material_uuid: updateSliderDieCastingStock?.uuid,
			section: 'die_casting',
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
		invalidateSliderDieCastingRMLog();
	};

	return (
		<AddModal
			id={modalId}
			title={
				updateSliderDieCastingStock?.uuid !== null &&
				'Material Usage Entry'
			}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				label='used_quantity'
				sub_label={`Max: ${Number(updateSliderDieCastingStock?.die_casting)}`}
				unit={updateSliderDieCastingStock?.unit}
				max={updateSliderDieCastingStock?.die_casting}
				placeholder={`Max: ${Number(updateSliderDieCastingStock?.die_casting)}`}
				{...{ register, errors }}
			/>
			<JoinInput
				label='wastage'
				unit={updateSliderDieCastingStock?.unit}
				sub_label={`Max: ${(updateSliderDieCastingStock?.die_casting -
					watch('used_quantity') <
				0
					? 0
					: updateSliderDieCastingStock?.die_casting -
						watch('used_quantity')
				).toFixed(2)}`}
				placeholder={`Max: ${(updateSliderDieCastingStock?.die_casting -
					watch('used_quantity') <
				0
					? 0
					: updateSliderDieCastingStock?.die_casting -
						watch('used_quantity')
				).toFixed(2)}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
