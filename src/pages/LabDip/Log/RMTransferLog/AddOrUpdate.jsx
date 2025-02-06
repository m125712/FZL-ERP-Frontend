import { useAuth } from '@/context/auth';
import { useCommonMaterialUsed, useCommonTapeRM } from '@/state/Common';
import { useLabDipRM } from '@/state/LabDip';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { ShowLocalToast } from '@/components/Toast';
import { FormField, Input, ReactSelect } from '@/ui';

import {
	RM_MATERIAL_USED_EDIT_NULL,
	RM_MATERIAL_USED_EDIT_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';
import getTransactionArea from '@/util/TransactionArea';

export default function Index({
	modalId = '',
	updateLabDipRMLog = {
		uuid: null,
		section: null,
		used_quantity: null,
		lab_dip: null,
		wastage: null,
	},
	setUpdateLabDipRMLog,
}) {
	const { url, updateData } = useCommonMaterialUsed();
	const { invalidateQuery: invalidateLabDipRM } = useLabDipRM();

	// const MAX_QUANTITY =
	// 	Number(updateLabDipRMLog?.lab_dip) +
	// 	Number(updateLabDipRMLog?.used_quantity);
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
		`${url}/${updateLabDipRMLog?.uuid}`,
		updateLabDipRMLog?.uuid,
		reset
	);
	let MAX_PROD =
		Number(updateLabDipRMLog?.lab_dip) +
		Number(updateLabDipRMLog?.used_quantity) +
		(Number(updateLabDipRMLog?.wastage) - watch('wastage'));
	let MAX_WASTAGE =
		Number(updateLabDipRMLog?.lab_dip) +
		Number(updateLabDipRMLog?.wastage) +
		(Number(updateLabDipRMLog?.used_quantity) - watch('used_quantity'));

	const onClose = () => {
		setUpdateLabDipRMLog((prev) => ({
			...prev,
			uuid: null,
			section: null,
			used_quantity: null,
			lab_dip: null,
			wastage: null,
		}));
		reset(RM_MATERIAL_USED_EDIT_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (MAX_WASTAGE < watch('wastage')) {
			ShowLocalToast({
				type: 'error',
				message: 'Beyond Stock',
			});
			return;
		}
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
