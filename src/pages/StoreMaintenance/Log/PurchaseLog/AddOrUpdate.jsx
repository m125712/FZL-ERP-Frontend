import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useOtherMaterial } from '@/state/Other';
import {
	useMaterialInfo,
	usePurchaseEntryByUUID,
	usePurchaseLog,
} from '@/state/Store';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, JoinInput, ReactSelect } from '@/ui';

import { DevTool } from '@/lib/react-hook-devtool';
import { PURCHASE_ENTRY_NULL, PURCHASE_ENTRY_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updatePurchaseLog = {
		entry_uuid: null,
		material_name: null,
	},
	setUpdatePurchaseLog,
}) {
	const { data: material } = useOtherMaterial();
	const { invalidateQuery: invalidateMaterial } = useMaterialInfo();
	const { data, updateData } = usePurchaseEntryByUUID(
		updatePurchaseLog?.entry_uuid
	);
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
		setValue,
	} = useRHF(PURCHASE_ENTRY_SCHEMA, PURCHASE_ENTRY_NULL);

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data]);
	const selectUnit = [
		{ label: 'kg', value: 'kg' },
		{ label: 'Litre', value: 'ltr' },
		{ label: 'Meter', value: 'mtr' },
		{ label: 'Piece', value: 'pcs' },
		{ label: 'Set', value: 'set' },
		{ label: 'Roll', value: 'roll' },
		{ label: 'Gallon', value: 'gallon' },
		{ label: 'Lbs', value: 'lbs' },
	];

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
				updated_by: user?.uuid,
			};
			await updateData.mutateAsync({
				url: `/purchase/entry/${updatePurchaseLog?.entry_uuid}`,
				uuid: updatePurchaseLog?.entry_uuid,
				updatedData,
				onClose,
			});
			invalidateMaterial();
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
			isSmall={true}
		>
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
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
