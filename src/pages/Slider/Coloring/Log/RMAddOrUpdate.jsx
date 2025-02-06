import { useAuth } from '@/context/auth';
import { useCommonMaterialUsed, useCommonTapeRM } from '@/state/Common';
import { useSliderColoringRM } from '@/state/Slider';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { ShowLocalToast } from '@/components/Toast/ReactToastify';
import { FormField, Input, ReactSelect } from '@/ui';

import {
	RM_MATERIAL_USED_EDIT_NULL,
	RM_MATERIAL_USED_EDIT_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';
import getTransactionArea from '@/util/TransactionArea';

export default function Index({
	modalId = '',
	updateSliderColoringRMLog = {
		uuid: null,
		section: null,
		used_quantity: null,
		coloring: null,
		wastage: null,
	},
	setUpdateSliderColoringRMLog,
}) {
	const { url, updateData } = useCommonMaterialUsed();
	const { invalidateQuery: invalidateSliderColoringRM } =
		useSliderColoringRM();

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

	let MAX_PROD =
		Number(updateSliderColoringRMLog?.coloring) +
		Number(updateSliderColoringRMLog?.used_quantity) +
		(Number(updateSliderColoringRMLog?.wastage) - watch('wastage'));
	let MAX_WASTAGE =
		Number(updateSliderColoringRMLog?.coloring) +
		Number(updateSliderColoringRMLog?.wastage) +
		(Number(updateSliderColoringRMLog?.used_quantity) -
			watch('used_quantity'));
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
			wastage: null,
		}));
		reset(RM_MATERIAL_USED_EDIT_NULL);
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
				sub_label={`Max: ${MAX_PROD}`}
				placeholder={`Max: ${MAX_PROD}`}
				{...{ register, errors }}
			/>
			<Input
				label='wastage'
				sub_label={`Max: ${MAX_WASTAGE}`}
				placeholder={`Max: ${MAX_WASTAGE}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
