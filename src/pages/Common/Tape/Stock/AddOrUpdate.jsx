import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useCommonTapeRM } from '@/state/Common';
import { Input, JoinInput } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { RM_MATERIAL_USED_NULL, RM_MATERIAL_USED_SCHEMA } from '@util/Schema';

export default function Index({
	modalId = '',
	updateTapeStock = {
		uuid: null,
		unit: null,
	},
	setUpdateTapeStock,
}) {
	//       "uuid": "0UEnxvp0dRSNN3O",
	//   "material_uuid": "0UEnxvp0dRSNN3O",
	//   "material_name": "Tape Material",
	//   "stock": "935.0000",
	//   "unit": "kg",
	//   "tape_making": "60.0000",
	//   "remarks": null
	const { user } = useAuth();
	const { url, updateData, postData } = useCommonTapeRM();

	const schema = {
		used_quantity: RM_MATERIAL_USED_SCHEMA.remaining.max(
			updateTapeStock?.tape_making
		),
		wastage: RM_MATERIAL_USED_SCHEMA.remaining.max(
			updateTapeStock?.tape_making
		),
	};

	const { register, handleSubmit, errors, reset, watch } = useRHF(
		schema,
		RM_MATERIAL_USED_NULL
	);

	useFetchForRhfReset(
		`${url}/${updateTapeStock?.uuid}`,
		updateTapeStock?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateTapeStock((prev) => ({
			...prev,
			uuid: null,
			unit: null,
		}));
		reset(RM_MATERIAL_USED_NULL);
		window[modalId].close();
	};
	//  "uuid": "string",
	//   "material_uuid": "string",
	//   "section": "string",
	//   "used_quantity": 0,
	//   "wastage": 0,
	//   "created_at": "2024-01-01 00:00:00",
	//   "updated_at": "2024-01-01 00:00:00",
	//   "remarks": "string"
	const onSubmit = async (data) => {
		const updatedData = {
			...data,

			// /coil_forming: data.remaining,
			// used_quantity:
			// 	updateCoilStock?.coil_forming - data.remaining - data.wastage,
			material_uuid: updateTapeStock?.uuid,
			section: 'tape_making',
			created_by: user?.uuid,
			created_by_name: user?.name,
			uuid: nanoid(),
			created_at: GetDateTime(),
		};

		// if (updatedData?.used_quantity < 0) {
		// 	alert("Wastage can't be greater than remaining");
		// 	return;
		// }
		await postData.mutateAsync({
			url: '/material/used',
			newData: updatedData,
			onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={updateTapeStock?.uuid !== null && 'Material Usage Entry'}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				label='used_quantity'
				unit={updateTapeStock?.unit}
				max={updateTapeStock?.tape_making}
				placeholder={`Max: ${updateTapeStock?.tape_making}`}
				{...{ register, errors }}
			/>
			<JoinInput
				label='wastage'
				unit={updateTapeStock?.unit}
				placeholder={`Max: ${(
					updateTapeStock?.tape_making - watch('used_quantity')
				).toFixed(2)}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
