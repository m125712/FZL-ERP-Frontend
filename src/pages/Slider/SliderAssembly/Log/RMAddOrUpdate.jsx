import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';
import { useCommonMaterialUsed, useCommonTapeRM } from '@/state/Common';
import { useSliderAssemblyRM } from '@/state/Slider';

import { FormField, Input, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import {
	RM_MATERIAL_USED_EDIT_NULL,
	RM_MATERIAL_USED_EDIT_SCHEMA,
} from '@util/Schema';
import getTransactionArea from '@/util/TransactionArea';
export default function Index({
	modalId = '',
	updateSliderAssemblyRMLog = {
		uuid: null,
		section: null,
		used_quantity: null,
		slider_assembly: null,
	},
	setUpdateSliderAssemblyRMLog,
}) {
	const { url, updateData } = useCommonMaterialUsed();
	const { invalidateQuery: invalidateSliderAssemblyRM } =
		useSliderAssemblyRM();

	const MAX_QUANTITY =
		Number(updateSliderAssemblyRMLog?.slider_assembly) +
		Number(updateSliderAssemblyRMLog?.used_quantity);
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
		`${url}/${updateSliderAssemblyRMLog?.uuid}`,
		updateSliderAssemblyRMLog?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateSliderAssemblyRMLog((prev) => ({
			...prev,
			uuid: null,
			section: null,
			used_quantity: null,
			slider_assembly: null,
		}));
		reset(RM_MATERIAL_USED_EDIT_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateSliderAssemblyRMLog?.uuid !== null) {
			const updatedData = {
				...data,
				material_name: updateSliderAssemblyRMLog?.material_name,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateSliderAssemblyRMLog?.uuid}`,
				uuid: updateSliderAssemblyRMLog?.uuid,
				updatedData,
				onClose,
			});
			invalidateSliderAssemblyRM();

			return;
		}
	};

	const transactionArea = getTransactionArea();


	return (
		<AddModal
			id={modalId}
			title={`Slider Assembly RM Log of ${updateSliderAssemblyRMLog?.material_name}`}
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
				sub_label={`Max: ${Number(updateSliderAssemblyRMLog?.slider_assembly) + Number(updateSliderAssemblyRMLog?.used_quantity)}`}
				placeholder={`Max: ${Number(updateSliderAssemblyRMLog?.slider_assembly) + Number(updateSliderAssemblyRMLog?.used_quantity)}`}
				{...{ register, errors }}
			/>
			<Input
				label='wastage'
				sub_label={`Max: ${Number(updateSliderAssemblyRMLog?.slider_assembly) + Number(updateSliderAssemblyRMLog?.used_quantity)}`}
				placeholder={`Max: ${Number(updateSliderAssemblyRMLog?.slider_assembly) + Number(updateSliderAssemblyRMLog?.used_quantity)}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
