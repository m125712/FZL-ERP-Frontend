import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';
import { useCommonMaterialUsed, useCommonTapeRM } from '@/state/Common';
import { useVislonTMRM } from '@/state/Vislon';

import { FormField, Input, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import getTransactionArea from '@/util/TransactionArea';
import {
	RM_MATERIAL_USED_EDIT_NULL,
	RM_MATERIAL_USED_EDIT_SCHEMA,
} from '@util/Schema';
export default function Index({
	modalId = '',
	updateVislonTMRMLog = {
		uuid: null,
		section: null,
		used_quantity: null,
		v_teeth_molding: null,
	},
	setUpdateVislonTMRMLog,
}) {
	const { url, updateData } = useCommonMaterialUsed();
	const { invalidateQuery: invalidateVislonTMRM } = useVislonTMRM();

	const MAX_QUANTITY =
		Number(updateVislonTMRMLog?.v_teeth_molding) +
		Number(updateVislonTMRMLog?.used_quantity);
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
		`${url}/${updateVislonTMRMLog?.uuid}`,
		updateVislonTMRMLog?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateVislonTMRMLog((prev) => ({
			...prev,
			uuid: null,
			section: null,
			used_quantity: null,
			v_teeth_molding: null,
		}));
		reset(RM_MATERIAL_USED_EDIT_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateVislonTMRMLog?.uuid !== null) {
			const updatedData = {
				...data,
				material_name: updateVislonTMRMLog?.material_name,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateVislonTMRMLog?.uuid}`,
				uuid: updateVislonTMRMLog?.uuid,
				updatedData,
				onClose,
			});
			invalidateVislonTMRM();

			return;
		}
	};

	const transactionArea = getTransactionArea();

	return (
		<AddModal
			id={modalId}
			title={`Teeth Molding RM Log of ${updateVislonTMRMLog?.material_name}`}
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
				sub_label={`Max: ${Number(updateVislonTMRMLog?.v_teeth_molding) + Number(updateVislonTMRMLog?.used_quantity)}`}
				placeholder={`Max: ${Number(updateVislonTMRMLog?.v_teeth_molding) + Number(updateVislonTMRMLog?.used_quantity)}`}
				{...{ register, errors }}
			/>
			<Input
				label='wastage'
				sub_label={`Max: ${Number(updateVislonTMRMLog?.v_teeth_molding) + Number(updateVislonTMRMLog?.used_quantity)}`}
				placeholder={`Max: ${Number(updateVislonTMRMLog?.v_teeth_molding) + Number(updateVislonTMRMLog?.used_quantity)}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
