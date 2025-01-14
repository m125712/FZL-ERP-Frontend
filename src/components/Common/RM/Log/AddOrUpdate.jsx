import { useEffect, useState } from 'react';
import { useCommonMaterialUsedByUUID } from '@/state/Common';
import { useOtherRM } from '@/state/Other';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, JoinInput, ReactSelect } from '@/ui';

import {
	RM_MATERIAL_USED_EDIT_NULL,
	RM_MATERIAL_USED_EDIT_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateDyeingLog = {
		uuid: null,
		trxArea: null,
	},
	setUpdateDyeingLog,
}) {
	const [wastage, setWastage] = useState(0);
	const { data, url, updateData } = useCommonMaterialUsedByUUID(
		updateDyeingLog?.uuid
	);
	const { invalidateQuery: invalidateDyeingRM } = useOtherRM(
		'multi-field',
		`${updateDyeingLog?.trxArea?.map((item) => item.value).join(',')}`
	);

	const MAX_QUANTITY = Number(
		updateDyeingLog[updateDyeingLog?.section] +
			updateDyeingLog?.used_quantity
	);

	const {
		register,
		handleSubmit,
		errors,
		control,
		Controller,
		reset,
		getValues,
		context,
		watch,
	} = useRHF(
		{
			used_quantity: RM_MATERIAL_USED_EDIT_SCHEMA.used_quantity
				.moreThan(0, 'More Than 0')
				.max(MAX_QUANTITY, 'Beyond Max Value'),
			wastage: RM_MATERIAL_USED_EDIT_SCHEMA.wastage
				.min(0, 'Minimum of 0')
				.max(wastage, 'Beyond Max Value'),
		},
		RM_MATERIAL_USED_EDIT_NULL
	);

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data]);

	useEffect(() => {
		if (updateDyeingLog?.uuid !== null) {
			setWastage(watch('used_quantity'));
		}
	}, [watch('used_quantity')]);

	const onClose = () => {
		setUpdateDyeingLog((prev) => ({
			...prev,
			uuid: null,
			trxArea: null,
		}));
		reset(RM_MATERIAL_USED_EDIT_NULL);
		window[modalId].close();
	};

	const onSubmit = async (formData) => {
		if (updateDyeingLog?.uuid !== null) {
			const updatedData = {
				...formData,
				material_name: data?.material_name,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url,
				uuid: updateDyeingLog?.uuid,
				updatedData,
				onClose,
			});
			invalidateDyeingRM();

			return;
		}
	};

	const sections = [
		{
			value: data?.section,
			label: data?.section
				?.replace(/_|n_/g, ' ')
				.split(' ') // Split the string into words
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
				.join(' '), // Join the words back into a single string,
		},
	];

	return (
		<AddModal
			id={modalId}
			title={`Dyeing & Iron RM Log: ${data?.material_name}`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<FormField label='section' title='Section' errors={errors}>
				<Controller
					name={'section'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Section'
								options={sections}
								value={sections?.find(
									(item) => item.value == getValues('section')
								)}
								isDisabled='1'
							/>
						);
					}}
				/>
			</FormField>
			<JoinInput
				label='used_quantity'
				sub_label={`Max: ${MAX_QUANTITY}`}
				unit={data?.unit}
				{...{ register, errors }}
			/>
			<JoinInput
				label='wastage'
				sub_label={`Max: ${wastage}`}
				unit={data?.unit}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
