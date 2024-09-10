import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';
import { useCommonMaterialUsed, useCommonTapeRM } from '@/state/Common';
import { useSliderColoringRM } from '@/state/Slider';

import { FormField, Input, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import {
	RM_MATERIAL_USED_EDIT_NULL,
	RM_MATERIAL_USED_EDIT_SCHEMA,
} from '@util/Schema';
import getTransactionArea from '@/util/TransactionArea';
export default function Index({
	modalId = '',
	updateSliderColoringRMLog = {
		uuid: null,
		section: null,
		used_quantity: null,
		coloring: null,
	},
	setUpdateSliderColoringRMLog,
}) {
	const { url, updateData } = useCommonMaterialUsed();
	const { invalidateQuery: invalidateSliderColoringRM } =
		useSliderColoringRM();

	const MAX_QUANTITY =
		Number(updateSliderColoringRMLog?.coloring) +
		Number(updateSliderColoringRMLog?.used_quantity);
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
		watch,
		context
	} = useRHF(schema, RM_MATERIAL_USED_EDIT_NULL);

	useFetchForRhfReset(
		`${url}/${updateSliderColoringRMLog?.uuid}`,
		updateSliderColoringRMLog?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateSliderColoringRMLog((prev) => ({
			...prev,
			uuid: null,
			section: null,
			used_quantity: null,
			coloring: null,
		}));
		reset(RM_MATERIAL_USED_EDIT_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateSliderColoringRMLog?.uuid !== null) {
			const updatedData = {
				...data,
				material_name: updateSliderColoringRMLog?.material_name,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateSliderColoringRMLog?.uuid}`,
				uuid: updateSliderColoringRMLog?.uuid,
				updatedData,
				onClose,
			});
			invalidateSliderColoringRM();

			return;
		}
	};

	const transactionArea = getTransactionArea();

	return (
		<AddModal
			id={modalId}
			title={`Coloring RM Log of ${updateSliderColoringRMLog?.material_name}`}
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
			<Input
				label='used_quantity'
				sub_label={`Max: ${Number(updateSliderColoringRMLog?.coloring) + Number(updateSliderColoringRMLog?.used_quantity)}`}
				placeholder={`Max: ${Number(updateSliderColoringRMLog?.coloring) + Number(updateSliderColoringRMLog?.used_quantity)}`}
				{...{ register, errors }}
			/>
			<Input
				label='wastage'
				sub_label={`Max: ${Number(updateSliderColoringRMLog?.coloring) + Number(updateSliderColoringRMLog?.used_quantity)}`}
				placeholder={`Max: ${Number(updateSliderColoringRMLog?.coloring) + Number(updateSliderColoringRMLog?.used_quantity)}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
