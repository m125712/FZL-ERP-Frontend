import { AddModal } from '@/components/Modal';
import { useRHF } from '@/hooks';

import { FormField, Input, JoinInput, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { PURCHASE_ENTRY_SCHEMA, PURCHASE_ENTRY_NULL } from '@util/Schema';

import { useEffect } from 'react';
import { usePurchaseEntryByUUID, usePurchaseLog } from '@/state/Store';
import { useOtherMaterial } from '@/state/Other';

export default function Index({
	modalId = '',
	updatePurchaseLog = {
		entry_uuid: null,
		material_name: null,
	},
	setUpdatePurchaseLog,
}) {
	const { updateData } = usePurchaseLog();
	const { data: material } = useOtherMaterial();
	const { data } = usePurchaseEntryByUUID(updatePurchaseLog?.entry_uuid);
	const {
		register,
		handleSubmit,
		errors,
		control,
		Controller,
		reset,
		getValues,
		context,
		setValue,
	} = useRHF(PURCHASE_ENTRY_SCHEMA, PURCHASE_ENTRY_NULL);

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data]);

	const onClose = () => {
		setUpdatePurchaseLog((prev) => ({
			...prev,
			uuid: null,
			material_uuid: null,
			quantity: null,
			price: null,
			unit: null,
			remarks: null,
		}));
		reset(PURCHASE_ENTRY_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updatePurchaseLog?.uuid !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};
			await updateData.mutateAsync({
				url: `/purchase/entry/${updatePurchaseLog?.entry_uuid}`,
				uuid: updatePurchaseLog?.entry_uuid,
				updatedData,
				onClose,
			});

			return;
		}
	};

	return (
		<AddModal
			id={modalId}
			title={`Purchase log of ${updatePurchaseLog?.material_name}`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<FormField label='material_uuid' title='Material' errors={errors}>
				<Controller
					name={'material_uuid'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Transaction Area'
								options={material}
								value={material?.find(
									(inItem) =>
										inItem.value ==
										getValues(`material_uuid`)
								)}
								onChange={(e) => {
									onChange(e.value);
									setValue('unit', e.unit);
								}}
							/>
						);
					}}
				/>
			</FormField>

			<JoinInput
				title='quantity'
				label={`quantity`}
				unit={
					material?.find(
						(inItem) => inItem.value == getValues(`material_uuid`)
					)?.unit
				}
				register={register}
			/>

			<Input title='price' label={`price`} {...{ register, errors }} />
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
