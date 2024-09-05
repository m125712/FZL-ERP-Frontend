import { AddModal } from '@/components/Modal';
import { useRHF } from '@/hooks';
import { useCommonCoilRM, useCommonTapeRM } from '@/state/Common';
import { useDeliveryRM } from '@/state/Delivery';
import { useDyeingRM } from '@/state/Dyeing';
import { useLabDipRM } from '@/state/LabDip';
import { useMetalFinishingRM, useMetalTCRM, useMetalTMRM } from '@/state/Metal';
import { useNylonMetallicFinishingRM } from '@/state/Nylon';
import {
	useSliderAssemblyRM,
	useSliderColoringRM,
	useSliderDieCastingRM,
} from '@/state/Slider';
import {
	useMaterialInfo,
	useMaterialTrx,
	useMaterialTrxByUUID,
} from '@/state/Store';
import { useVislonFinishingRM, useVislonTMRM } from '@/state/Vislon';
import { FormField, Input, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import getTransactionArea from '@/util/TransactionArea';
import { MATERIAL_STOCK_NULL, MATERIAL_STOCK_SCHEMA } from '@util/Schema';
import { useEffect } from 'react';

export default function Index({
	modalId = '',
	updateMaterialTrx = {
		uuid: null,
		material_name: null,
		stock: null,
	},
	setUpdateMaterialTrx,
}) {
	const { url, updateData } = useMaterialTrx();
	const { data } = useMaterialTrxByUUID(updateMaterialTrx?.uuid);
	const { invalidateQuery: invalidateMaterialInfo } = useMaterialInfo();
	const { invalidateQuery: invalidateCommonTapeRM } = useCommonTapeRM();
	const { invalidateQuery: invalidateCommonCoilRM } = useCommonCoilRM();
	const { invalidateQuery: invalidateLabDipRM } = useLabDipRM();
	const { invalidateQuery: invalidateDyeingRM } = useDyeingRM();
	const { invalidateQuery: invalidateFinishingRM } = useMetalFinishingRM();
	const { invalidateQuery: invalidateMetalTCRM } = useMetalTCRM();
	const { invalidateQuery: invalidateMetalTMRM } = useMetalTMRM();
	const { invalidateQuery: invalidateNylonMetallicFinishingRM } =
		useNylonMetallicFinishingRM();
	const { invalidateQuery: invalidateVislonFinishingRM } =
		useVislonFinishingRM();
	const { invalidateQuery: invalidateVislonTMRM } = useVislonTMRM();
	const { invalidateQuery: invalidateSliderAssemblyRM } =
		useSliderAssemblyRM();
	const { invalidateQuery: invalidateSliderColoringRM } =
		useSliderColoringRM();
	const { invalidateQuery: invalidateDieCastingRM } = useSliderDieCastingRM();
	const { invalidateQuery: invalidateDeliveryRM } = useDeliveryRM();

	const MAX_QUANTITY = updateMaterialTrx?.stock;
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
			};

			await updateData.mutateAsync({
				url: `${url}/${updateMaterialTrx?.uuid}`,
				uuid: updateMaterialTrx?.uuid,
				updatedData,
				onClose,
			});

			invalidateMaterialInfo();
			invalidateCommonTapeRM();
			invalidateCommonCoilRM();
			invalidateLabDipRM();
			invalidateDyeingRM();
			invalidateFinishingRM();
			invalidateMetalTCRM();
			invalidateMetalTMRM();
			invalidateNylonMetallicFinishingRM();
			invalidateVislonFinishingRM();
			invalidateVislonTMRM();
			invalidateSliderAssemblyRM();
			invalidateSliderColoringRM();
			invalidateDieCastingRM();
			invalidateDeliveryRM();

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
			isSmall={true}>
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

			<Input
				label='trx_quantity'
				sub_label={`Max: ${MAX_QUANTITY}`}
				placeholder={`Max: ${MAX_QUANTITY}`}
				{...{ register, errors }}
			/>

			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
