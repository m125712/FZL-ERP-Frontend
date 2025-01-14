import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useDyeingRMLog } from '@/state/Dyeing';
import * as yup from 'yup';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { Input, JoinInput } from '@/ui';

import nanoid from '@/lib/nanoid';
import { RM_MATERIAL_USED_NULL, RM_MATERIAL_USED_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateDyeingStock = {
		uuid: null,
		trxArea: [],
	},
	setUpdateDyeingStock,
}) {
	const [wastage, setWastage] = useState(0);

	const { user } = useAuth();
	const { postData, invalidateQuery } = useDyeingRMLog(
		`${updateDyeingStock?.trxArea?.map((item) => item.value).join(',')}`
	);

	const MAX_QUANTITY = updateDyeingStock[updateDyeingStock?.section];

	const schema = {
		used_quantity: RM_MATERIAL_USED_SCHEMA.remaining.max(
			MAX_QUANTITY,
			'Beyond Max Value'
		),
		wastage: RM_MATERIAL_USED_SCHEMA.wastage
			.min(0, 'Minimum of 0')
			.max(MAX_QUANTITY - wastage, 'Beyond Max Value'),
	};

	const { register, handleSubmit, errors, reset, watch, context } = useRHF(
		schema,
		RM_MATERIAL_USED_NULL
	);

	useEffect(() => {
		if (updateDyeingStock?.uuid !== null) {
			setWastage(MAX_QUANTITY - watch('used_quantity'));
		}
	}, [watch('used_quantity')]);

	const onClose = () => {
		setUpdateDyeingStock((prev) => ({
			...prev,
			uuid: null,
			trxArea: null,
		}));
		reset(RM_MATERIAL_USED_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			material_uuid: updateDyeingStock?.uuid,
			section: updateDyeingStock?.section,
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
		invalidateQuery();
	};

	return (
		<AddModal
			id={modalId}
			title={
				updateDyeingStock?.uuid !== null &&
				`Material Usage Entry: ${updateDyeingStock?.material_name}`
			}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				label='used_quantity'
				sub_label={`Max: ${Number(MAX_QUANTITY)}`}
				unit={updateDyeingStock?.unit}
				placeholder={`Max: ${Number(MAX_QUANTITY)}`}
				{...{ register, errors }}
			/>
			<JoinInput
				label='wastage'
				unit={updateDyeingStock?.unit}
				sub_label={`Max:${wastage}`}
				placeholder={`Max:${wastage}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
