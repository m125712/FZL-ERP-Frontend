import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';
import nanoid from '@/lib/nanoid';

import { useDyeingRM } from '@/state/Dyeing';

import { Input, JoinInput } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { RM_MATERIAL_USED_NULL, RM_MATERIAL_USED_SCHEMA } from '@util/Schema';
import * as yup from 'yup';

export default function Index({
	modalId = '',
	updateDyeingStock = {
		uuid: null,
		unit: null,
		dying_and_iron: null,
	},
	setUpdateDyeingStock,
}) {
	const { user } = useAuth();
	const { url, postData } = useDyeingRM();
	//const { invalidateQuery: invalidateDyeingRMLog } = useDyeingRMLog();
	const MAX_QUANTITY = updateDyeingStock?.dying_and_iron;

	const schema = {
		used_quantity: RM_MATERIAL_USED_SCHEMA.remaining.max(
			updateDyeingStock?.dying_and_iron
		),
		wastage: RM_MATERIAL_USED_SCHEMA.remaining.max(
			MAX_QUANTITY,
			'Must be less than or equal ${MAX_QUANTITY}'
		),
	};

	const { register, handleSubmit, errors, reset, watch ,context} = useRHF(
		schema,
		RM_MATERIAL_USED_NULL
	);

	const onClose = () => {
		setUpdateDyeingStock((prev) => ({
			...prev,
			uuid: null,
			unit: null,
			dying_and_iron: null,
		}));
		reset(RM_MATERIAL_USED_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,

			material_uuid: updateDyeingStock?.uuid,
			section: 'dying_and_iron',
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
		//invalidateDyeingRMLog();
	};

	return (
		<AddModal
			id={modalId}
			title={updateDyeingStock?.uuid !== null && 'Material Usage Entry'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				label='used_quantity'
				sub_label={`Max: ${Number(updateDyeingStock?.dying_and_iron)}`}
				unit={updateDyeingStock?.unit}
				max={updateDyeingStock?.dying_and_iron}
				placeholder={`Max: ${Number(updateDyeingStock?.dying_and_iron)}`}
				{...{ register, errors }}
			/>
			<JoinInput
				label='wastage'
				unit={updateDyeingStock?.unit}
				sub_label={`Max: ${(updateDyeingStock?.dying_and_iron -
					watch('used_quantity') <
				0
					? 0
					: updateDyeingStock?.dying_and_iron - watch('used_quantity')
				).toFixed(2)}`}
				placeholder={`Max: ${(updateDyeingStock?.dying_and_iron -
					watch('used_quantity') <
				0
					? 0
					: updateDyeingStock?.dying_and_iron - watch('used_quantity')
				).toFixed(2)}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
