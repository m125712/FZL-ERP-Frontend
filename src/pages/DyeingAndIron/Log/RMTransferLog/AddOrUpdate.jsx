import { useEffect } from 'react';
import { useCommonMaterialUsedByUUID } from '@/state/Common';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { ShowLocalToast } from '@/components/Toast';
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
	},
	setUpdateDyeingLog,
}) {
	const { data, url, updateData } = useCommonMaterialUsedByUUID(
		updateDyeingLog?.uuid
	);
	// const { invalidateQuery: invalidateDyeingRM } = useDyeingRM();

	const MAX_QUANTITY = Number(updateDyeingLog?.dying_and_iron);

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
	} = useRHF(RM_MATERIAL_USED_EDIT_SCHEMA, RM_MATERIAL_USED_EDIT_NULL);

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data]);

	let MAX_PROD =
		MAX_QUANTITY +
		Number(data?.used_quantity) +
		(Number(data?.wastage) - watch('wastage'));
	let MAX_WASTAGE =
		MAX_QUANTITY +
		Number(data?.wastage) +
		(Number(data?.used_quantity) - watch('used_quantity'));

	const onClose = () => {
		setUpdateDyeingLog((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(RM_MATERIAL_USED_EDIT_NULL);
		window[modalId].close();
	};

	const onSubmit = async (formData) => {
		if (MAX_WASTAGE < watch('wastage')) {
			ShowLocalToast({
				type: 'error',
				message: 'Beyond Stock',
			});
			return;
		}
		// Update item
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
			title={`Dyeing and Iron RM Log of ${data?.material_name}`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
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
				sub_label={`Max: ${MAX_PROD}`}
				unit={data?.unit}
				{...{ register, errors }}
			/>
			<JoinInput
				label='wastage'
				sub_label={`Max: ${MAX_WASTAGE}`}
				unit={data?.unit}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
