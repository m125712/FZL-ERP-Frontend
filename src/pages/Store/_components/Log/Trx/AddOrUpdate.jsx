import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useCommonTapeRM } from '@/state/Common';
import { useLabDipRM } from '@/state/LabDip';
import { useOtherMaterial } from '@/state/Other';
import { useSliderAssemblyRM, useSliderDieCastingRM } from '@/state/Slider';
import { useMaterialInfo, useMaterialTrxByUUID } from '@/state/Store';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, JoinInput, ReactSelect } from '@/ui';

import { MATERIAL_STOCK_NULL, MATERIAL_STOCK_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';
import getTransactionArea from '@/util/TransactionArea';

export default function Index({
	modalId = '',
	updateMaterialTrx = {
		uuid: null,
		material_name: null,
		stock: null,
		trx_quantity: null,
	},
	setUpdateMaterialTrx,
}) {
	const { user } = useAuth();
	const { data, updateData } = useMaterialTrxByUUID(updateMaterialTrx?.uuid);
	const { invalidateQuery: invalidateMaterialInfo } = useMaterialInfo();
	const { invalidateQuery: invalidateCommonTapeRM } = useCommonTapeRM();
	const { invalidateQuery: invalidateLabDipRM } = useLabDipRM();
	const { invalidateQuery: invalidateSliderAssemblyRM } =
		useSliderAssemblyRM();
	const { invalidateQuery: invalidateDieCastingRM } = useSliderDieCastingRM();

	const { data: material } = useOtherMaterial();
	const { user } = useAuth();

	const MAX_QUANTITY =
		Number(updateMaterialTrx?.stock) +
		Number(updateMaterialTrx?.trx_quantity);
	const schema = {
		...MATERIAL_STOCK_SCHEMA,
		trx_quantity: MATERIAL_STOCK_SCHEMA.trx_quantity.max(MAX_QUANTITY),
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
	} = useRHF(schema, MATERIAL_STOCK_NULL);

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data]);

	const onClose = () => {
		setUpdateMaterialTrx((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(MATERIAL_STOCK_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateMaterialTrx?.uuid !== null) {
			const updatedData = {
				...data,
				material_name: updateMaterialTrx?.material_name,
				updated_at: GetDateTime(),
				updated_by: user?.uuid,
			};

			await updateData.mutateAsync({
				url: `/material/trx/${updateMaterialTrx?.uuid}`,
				uuid: updateMaterialTrx?.uuid,
				updatedData,
				onClose,
			});

			invalidateMaterialInfo();
			invalidateCommonTapeRM();
			invalidateLabDipRM();
			invalidateSliderAssemblyRM();
			invalidateDieCastingRM();

			return;
		}
	};

	const transactionArea = getTransactionArea();

	return (
		<AddModal
			id={modalId}
			title={`Log of ${updateMaterialTrx?.material_name}`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<FormField label='trx_to' title='Trx to' errors={errors}>
				<Controller
					name={'trx_to'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Transaction Area'
								options={transactionArea}
								value={transactionArea?.find(
									(item) => item.value == getValues('trx_to')
								)}
								onChange={(e) => onChange(e.value)}
								isDisabled={updateMaterialTrx?.uuid !== null}
							/>
						);
					}}
				/>
			</FormField>

			<JoinInput
				title='trx_quantity'
				label={`trx_quantity`}
				sub_label={`Max: ${MAX_QUANTITY}`}
				unit={
					material?.find(
						(inItem) => inItem.value == getValues(`material_uuid`)
					)?.unit
				}
				register={register}
			/>

			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
