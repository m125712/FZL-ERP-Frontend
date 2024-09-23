import { useAuth } from '@/context/auth';
import { useDyeingRM } from '@/state/Dyeing';
import { useOtherMaterial } from '@/state/Other';
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
	updateDyeingStock = {
		uuid: null,
		unit: null,
		dying_and_iron: null,
	},
	setUpdateDyeingStock,
}) {
	const { user } = useAuth();
	const { url, postData } = useDyeingRM();
	const { data: material } = useOtherMaterial();

	const { invalidateQuery: invalidateDyeingRMLog } = useDyeingRM();
	const MAX_QUANTITY = updateDyeingStock?.dying_and_iron;

	const schema = {
		used_quantity: RM_MATERIAL_USED_SCHEMA.remaining.max(
			updateDyeingStock?.dying_and_iron
		),
	};

	const { register, handleSubmit, errors, reset, watch, context } = useRHF(
		schema,
		RM_MATERIAL_USED_NULL
	);
	const MAX_WASTAGE = MAX_QUANTITY - watch('used_quantity');

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
		if (MAX_WASTAGE < watch('wastage')) {
			ShowLocalToast({
				type: 'error',
				message: 'Beyond Stock',
			});
			return;
		}
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
		invalidateDyeingRMLog();
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
				sub_label={`Max:${MAX_WASTAGE}`}
				placeholder={`Max:${MAX_WASTAGE}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
