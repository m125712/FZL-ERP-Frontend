import { useEffect } from 'react';
import { useCommonMaterialUsedByUUID, useCommonTapeRM } from '@/state/Common';
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
	updateTapeLog = {
		uuid: null,
		section: null,
		used_quantity: null,
		tape_making: null,
		unit: null,
		wastage: null,
	},
	setUpdateTapeLog,
}) {
	const { updateData } = useCommonTapeRM();
	const { data } = useCommonMaterialUsedByUUID(updateTapeLog?.uuid);
	const { invalidateQuery: invalidateCommonTapeRM } = useCommonTapeRM();
	const { data: material } = useOtherMaterial();

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
		Number(updateTapeLog?.tape_making) +
		Number(updateTapeLog?.used_quantity) +
		(Number(updateTapeLog?.wastage) - watch('wastage'));
	let MAX_WASTAGE =
		Number(updateTapeLog?.tape_making) +
		Number(updateTapeLog?.wastage) +
		(Number(updateTapeLog?.used_quantity) - watch('used_quantity'));

	const onClose = () => {
		setUpdateTapeLog((prev) => ({
			...prev,
			uuid: null,
			section: null,
			used_quantity: null,
			tape_making: null,
			unit: null,
			wastage: null,
		}));
		reset(RM_MATERIAL_USED_EDIT_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		if (
			MAX_WASTAGE < watch('wastage') ||
			MAX_PROD < watch('production_quantity')
		) {
			ShowLocalToast({
				type: 'error',
				message: 'Beyond Stock',
			});
			return;
		}
		// Update item
		if (updateTapeLog?.uuid !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `/material/used/${updateTapeLog?.uuid}`,
				updatedData,
				onClose,
			});
			invalidateCommonTapeRM();
			return;
		}
	};

	const transactionArea = getTransactionArea();

	return (
		<AddModal
			id={modalId}
			title={`Update Tape Making: ${updateTapeLog?.material_name}`}
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
