import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';
import { useCommonMaterialUsed, useCommonTapeRM } from '@/state/Common';
import { useLabDipRM } from '@/state/LabDip';

import { FormField, Input, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import getTransactionArea from '@/util/TransactionArea';
import {
	RM_MATERIAL_USED_EDIT_NULL,
	RM_MATERIAL_USED_EDIT_SCHEMA,
} from '@util/Schema';
export default function Index({
	modalId = '',
	updateLabDipRMLog = {
		uuid: null,
		section: null,
		used_quantity: null,
		lab_dip: null,
	},
	setUpdateLabDipRMLog,
}) {
	const { url, updateData } = useCommonMaterialUsed();
	const { invalidateQuery: invalidateLabDipRM } = useLabDipRM();

	const MAX_QUANTITY =
		Number(updateLabDipRMLog?.lab_dip) +
		Number(updateLabDipRMLog?.used_quantity);
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
		context,
	} = useRHF(schema, RM_MATERIAL_USED_EDIT_NULL);

	useFetchForRhfReset(
		`${url}/${updateLabDipRMLog?.uuid}`,
		updateLabDipRMLog?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateLabDipRMLog((prev) => ({
			...prev,
			uuid: null,
			section: null,
			used_quantity: null,
			lab_dip: null,
		}));
		reset(RM_MATERIAL_USED_EDIT_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateLabDipRMLog?.uuid !== null) {
			const updatedData = {
				...data,
				material_name: updateLabDipRMLog?.material_name,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateLabDipRMLog?.uuid}`,
				uuid: updateLabDipRMLog?.uuid,
				updatedData,
				onClose,
			});
			invalidateLabDipRM();

			return;
		}
	};

	const transactionArea = getTransactionArea();

	return (
		<AddModal
			id={modalId}
			title={`Lap Dip RM Log of ${updateLabDipRMLog?.material_name}`}
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
				sub_label={`Max: ${Number(updateLabDipRMLog?.lab_dip) + Number(updateLabDipRMLog?.used_quantity)}`}
				placeholder={`Max: ${Number(updateLabDipRMLog?.lab_dip) + Number(updateLabDipRMLog?.used_quantity)}`}
				{...{ register, errors }}
			/>
			<Input
				label='wastage'
				sub_label={`Max: ${Number(updateLabDipRMLog?.lab_dip) + Number(updateLabDipRMLog?.used_quantity)}`}
				placeholder={`Max: ${Number(updateLabDipRMLog?.lab_dip) + Number(updateLabDipRMLog?.used_quantity)}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
