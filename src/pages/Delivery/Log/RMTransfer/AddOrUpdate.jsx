import { useEffect } from 'react';
import { useCommonMaterialUsedByUUID } from '@/state/Common';
import { useDeliveryRM } from '@/state/Delivery';
import { useOtherMaterial } from '@/state/Other';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { ShowLocalToast } from '@/components/Toast/ReactToastify';
import { FormField, Input, JoinInput, ReactSelect } from '@/ui';

import {
	RM_MATERIAL_USED_EDIT_NULL,
	RM_MATERIAL_USED_EDIT_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';
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
	const { data, url, updateData } = useCommonMaterialUsedByUUID(
		updateRMLog?.uuid
	);
	const { invalidateQuery: invalidateRM } = useDeliveryRM();
	const { data: material } = useOtherMaterial();

	const MAX_QUANTITY = Number(
		updateRMLog?.section === 'n_qc_and_packing'
			? updateRMLog?.n_qc_and_packing
			: updateRMLog?.section === 'm_qc_and_packing'
				? updateRMLog?.m_qc_and_packing
				: updateRMLog?.section === 'v_qc_and_packing'
					? updateRMLog?.v_qc_and_packing
					: updateRMLog?.s_qc_and_packing
	);
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
		Number(updateRMLog?.used_quantity) +
		(Number(updateRMLog?.wastage) - watch('wastage'));
	let MAX_WASTAGE =
		MAX_QUANTITY +
		Number(updateRMLog?.wastage) +
		(Number(updateRMLog?.used_quantity) - watch('used_quantity'));
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
		if (updateRMLog?.uuid !== null) {
			const updatedData = {
				...data,
				material_name: updateRMLog?.material_name,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url,
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
