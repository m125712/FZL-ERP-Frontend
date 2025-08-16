import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useCommonCoilRM, useCommonMaterialUsedByUUID } from '@/state/Common';
import { useOtherMaterial } from '@/state/Other';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { ShowLocalToast } from '@/components/Toast';
import { FormField, JoinInput, ReactSelect, Textarea } from '@/ui';

import {
	RM_MATERIAL_USED_EDIT_NULL,
	RM_MATERIAL_USED_EDIT_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';
import getTransactionArea from '@/util/TransactionArea';

export default function Index({
	modalId = '',
	updateCoilLog = {
		uuid: null,
		section: null,
		used_quantity: null,
		coil_forming: null,
		unit: null,
		wastage: null,
	},
	setUpdateCoilLog,
}) {
	const { updateData } = useCommonCoilRM();
	const { data } = useCommonMaterialUsedByUUID(updateCoilLog?.uuid);
	const { data: material } = useOtherMaterial();
	const { invalidateQuery: invalidateCommonCoilRM } = useCommonCoilRM();
	const { user } = useAuth();

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
	let MAX_PROD =
		Number(updateCoilLog?.coil_forming) +
		Number(updateCoilLog?.used_quantity) +
		(Number(updateCoilLog?.wastage) - watch('wastage'));
	let MAX_WASTAGE =
		Number(updateCoilLog?.coil_forming) +
		Number(updateCoilLog?.wastage) +
		(Number(updateCoilLog?.used_quantity) - watch('used_quantity'));

	useEffect(() => {
		if (data && updateCoilLog?.uuid) {
			reset(data);
		}
	}, [data]);

	// const MAX_WASTAGE = MAX_QUANTITY - watch('used_quantity');

	const onClose = () => {
		setUpdateCoilLog((prev) => ({
			...prev,
			uuid: null,
			section: null,
			used_quantity: null,
			coil_forming: null,
			unit: null,
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
		if (updateCoilLog?.uuid !== null) {
			const updatedData = {
				...data,
				updated_by: user?.uuid,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `/material/used/${updateCoilLog?.uuid}`,
				updatedData,
				onClose,
			});

			return;
		}
		invalidateCommonCoilRM();
	};

	const transactionArea = getTransactionArea();

	return (
		<AddModal
			id={modalId}
			title={`Tape Making: ${updateCoilLog?.material_name}`}
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
								isDisabled
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
			<Textarea label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
