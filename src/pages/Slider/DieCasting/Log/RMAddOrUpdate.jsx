import { useAuth } from '@/context/auth';
import { useCommonMaterialUsed, useCommonTapeRM } from '@/state/Common';
import { useOtherMaterial } from '@/state/Other';
import { useSliderDieCastingRM } from '@/state/Slider';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { ShowLocalToast } from '@/components/Toast';
import { FormField, Input, JoinInput, ReactSelect } from '@/ui';

import {
	RM_MATERIAL_USED_EDIT_NULL,
	RM_MATERIAL_USED_EDIT_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';
import getTransactionArea from '@/util/TransactionArea';

export default function Index({
	modalId = '',
	updateSliderDieCastingRMLog = {
		uuid: null,
		section: null,
		used_quantity: null,
		die_casting: null,

		wastage: null,
	},
	setUpdateSliderDieCastingRMLog,
}) {
	const { url, updateData } = useCommonMaterialUsed();
	const { invalidateQuery: invalidateSliderDieCastingRM } =
		useSliderDieCastingRM();
	const { data: material } = useOtherMaterial();

	const MAX_QUANTITY = Number(updateSliderDieCastingRMLog?.die_casting);
	// const schema = {
	// 	...RM_MATERIAL_USED_EDIT_SCHEMA,
	// 	used_quantity:
	// 		RM_MATERIAL_USED_EDIT_SCHEMA.used_quantity.max(MAX_QUANTITY),
	// };

	const {
		register,
		handleSubmit,
		errors,
		control,
		Controller,
		reset,
		getValues,
		watch,
		context,
	} = useRHF(RM_MATERIAL_USED_EDIT_SCHEMA, RM_MATERIAL_USED_EDIT_NULL);

	useFetchForRhfReset(
		`${url}/${updateSliderDieCastingRMLog?.uuid}`,
		updateSliderDieCastingRMLog?.uuid,
		reset
	);
	let MAX_PROD =
		MAX_QUANTITY +
		Number(updateSliderDieCastingRMLog?.used_quantity) +
		(Number(updateSliderDieCastingRMLog?.wastage) - watch('wastage'));
	let MAX_WASTAGE =
		MAX_QUANTITY +
		Number(updateSliderDieCastingRMLog?.wastage) +
		(Number(updateSliderDieCastingRMLog?.used_quantity) -
			watch('used_quantity'));

	const onClose = () => {
		setUpdateSliderDieCastingRMLog((prev) => ({
			...prev,
			uuid: null,
			section: null,
			used_quantity: null,
			die_casting: null,
			wastage: null,
		}));
		reset(RM_MATERIAL_USED_EDIT_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		if (
			MAX_WASTAGE < watch('wastage') &&
			MAX_PROD < watch('used_quantity')
		) {
			ShowLocalToast({
				type: 'error',
				message: 'Beyond Stock',
			});
			return;
		}
		// Update item
		if (updateSliderDieCastingRMLog?.uuid !== null) {
			const updatedData = {
				...data,
				material_name: updateSliderDieCastingRMLog?.material_name,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateSliderDieCastingRMLog?.uuid}`,
				uuid: updateSliderDieCastingRMLog?.uuid,
				updatedData,
				onClose,
			});
			invalidateSliderDieCastingRM();

			return;
		}
	};

	const transactionArea = getTransactionArea();
	return (
		<AddModal
			id={modalId}
			title={`Die Casting RM Log of ${updateSliderDieCastingRMLog?.material_name}`}
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
								options={transactionArea}
								value={transactionArea?.find(
									(item) => item.value == getValues('section')
								)}
								onChange={(e) => onChange(e.value)}
								isDisabled='1'
							/>
						);
					}}
				/>
			</FormField>
			<JoinInput
				label='used_quantity'
				sub_label={`Max: ${MAX_PROD}`}
				unit={
					material?.find(
						(inItem) => inItem.value == getValues(`material_uuid`)
					)?.unit
				}
				{...{ register, errors }}
			/>
			<JoinInput
				label='wastage'
				sub_label={`Max: ${MAX_WASTAGE}`}
				unit={
					material?.find(
						(inItem) => inItem.value == getValues(`material_uuid`)
					)?.unit
				}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
