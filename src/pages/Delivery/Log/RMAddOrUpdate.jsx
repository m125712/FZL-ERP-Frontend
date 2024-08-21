import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';
import { useCommonMaterialUsed, useCommonTapeRM } from '@/state/Common';

import { useDeliveryRM } from '@/state/Delivery';

import { FormField, Input, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import {
	RM_MATERIAL_USED_EDIT_NULL,
	RM_MATERIAL_USED_EDIT_SCHEMA,
} from '@util/Schema';
import getTransactionArea from '@/util/TransactionArea';

export default function Index({
	modalId = '',
	updateRMLog = {
		uuid: null,
		section: null,
		used_quantity: null,
		m_qc_and_packing: null,
		n_qc_and_packing: null,
		v_qc_and_packing: null,
		s_qc_and_packing: null,
	},
	setUpdateRMLog,
}) {
	const { url, updateData } = useCommonMaterialUsed();
	const { invalidateQuery: invalidateRM } = useDeliveryRM();

	const MAX_QUANTITY =
		Number(
			updateRMLog?.section === 'n_qc_and_packing'
				? updateRMLog?.n_qc_and_packing
				: updateRMLog?.section === 'm_qc_and_packing'
					? updateRMLog?.m_qc_and_packing
					: updateRMLog?.section === 'v_qc_and_packing'
						? updateRMLog?.v_qc_and_packing
						: updateRMLog?.s_qc_and_packing
		) + Number(updateRMLog?.used_quantity);
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
		`${url}/${updateRMLog?.uuid}`,
		updateRMLog?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateRMLog((prev) => ({
			...prev,
			uuid: null,
			section: null,
			used_quantity: null,
			m_qc_and_packing: null,
			n_qc_and_packing: null,
			v_qc_and_packing: null,
			s_qc_and_packing: null,
		}));
		reset(RM_MATERIAL_USED_EDIT_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateRMLog?.uuid !== null) {
			const updatedData = {
				...data,
				material_name: updateRMLog?.material_name,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateRMLog?.uuid}`,
				uuid: updateRMLog?.uuid,
				updatedData,
				onClose,
			});
			invalidateRM();

			return;
		}
	};

const transactionArea = getTransactionArea();

	return (
		<AddModal
			id={modalId}
			title={`Delivery RM Log of ${updateRMLog?.material_name}`}
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
				sub_label={`Max: ${MAX_QUANTITY}`}
				placeholder={`Max: ${MAX_QUANTITY}`}
				{...{ register, errors }}
			/>
			<Input
				label='wastage'
				sub_label={`Max: ${MAX_QUANTITY}`}
				placeholder={`Max: ${MAX_QUANTITY}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
