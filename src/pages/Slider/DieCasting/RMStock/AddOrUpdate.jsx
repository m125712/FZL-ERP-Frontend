import { useAuth } from '@/context/auth';
import { useOtherMaterial } from '@/state/Other';
import {
	useSliderDieCastingRM,
	useSliderDieCastingRMLog,
} from '@/state/Slider';
import * as yup from 'yup';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { ShowLocalToast } from '@/components/Toast/ReactToastify';
import { Input, JoinInput } from '@/ui';

import nanoid from '@/lib/nanoid';
import { RM_MATERIAL_USED_NULL, RM_MATERIAL_USED_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

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
	const { data: material } = useOtherMaterial();
	const MAX_QUANTITY = updateSliderDieCastingStock?.die_casting;

	const schema = {
		used_quantity: RM_MATERIAL_USED_SCHEMA.remaining.max(
			updateSliderDieCastingStock?.die_casting
		),
	};

	const { register, handleSubmit, errors, reset, watch, context } = useRHF(
		schema,
		RM_MATERIAL_USED_NULL
	);
	const MAX_WASTAGE = MAX_QUANTITY - watch('used_quantity');
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
		if (MAX_WASTAGE < watch('wastage')) {
			ShowLocalToast({
				type: 'error',
				message: 'Beyond Stock',
			});
			return;
		}
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
				sub_label={`Max:${MAX_WASTAGE}`}
				placeholder={`Max:${MAX_WASTAGE}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
