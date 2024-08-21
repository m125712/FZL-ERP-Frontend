import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';
import { useCommonMaterialUsed, useCommonTapeRM } from '@/state/Common';
import { useSliderDieCastingRM } from '@/state/Slider';

import { FormField, Input, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import {
	RM_MATERIAL_USED_EDIT_NULL,
	RM_MATERIAL_USED_EDIT_SCHEMA,
} from '@util/Schema';
import getTransactionArea from '@/util/TransactionArea';
export default function Index({
	modalId = '',
	updateSliderDieCastingRMLog = {
		uuid: null,
		section: null,
		used_quantity: null,
		die_casting: null,
	},
	setUpdateSliderDieCastingRMLog,
}) {
	const { url, updateData } = useCommonMaterialUsed();
	const { invalidateQuery: invalidateSliderDieCastingRM } =
		useSliderDieCastingRM();

	const MAX_QUANTITY =
		Number(updateSliderDieCastingRMLog?.die_casting) +
		Number(updateSliderDieCastingRMLog?.used_quantity);
	const schema = {
		...RM_MATERIAL_USED_EDIT_SCHEMA,
		used_quantity:
			RM_MATERIAL_USED_EDIT_SCHEMA.used_quantity.max(MAX_QUANTITY),
	};

	const {
		register,
		handleSubmit,
		errors,
		control,
		Controller,
		reset,
		getValues,
		wa,
	} = useRHF(schema, RM_MATERIAL_USED_EDIT_NULL);

	useFetchForRhfReset(
		`${url}/${updateSliderDieCastingRMLog?.uuid}`,
		updateSliderDieCastingRMLog?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateSliderDieCastingRMLog((prev) => ({
			...prev,
			uuid: null,
			section: null,
			used_quantity: null,
			die_casting: null,
		}));
		reset(RM_MATERIAL_USED_EDIT_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
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
			<Input
				label='used_quantity'
				sub_label={`Max: ${Number(updateSliderDieCastingRMLog?.die_casting) + Number(updateSliderDieCastingRMLog?.used_quantity)}`}
				placeholder={`Max: ${Number(updateSliderDieCastingRMLog?.die_casting) + Number(updateSliderDieCastingRMLog?.used_quantity)}`}
				{...{ register, errors }}
			/>
			<Input
				label='wastage'
				sub_label={`Max: ${Number(updateSliderDieCastingRMLog?.die_casting) + Number(updateSliderDieCastingRMLog?.used_quantity)}`}
				placeholder={`Max: ${Number(updateSliderDieCastingRMLog?.die_casting) + Number(updateSliderDieCastingRMLog?.used_quantity)}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
