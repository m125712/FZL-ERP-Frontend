import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useRHF } from '@/hooks';
import nanoid from '@/lib/nanoid';
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
import { useMaterialInfo, useMaterialTrx } from '@/state/Store';
import { useVislonFinishingRM, useVislonTMRM } from '@/state/Vislon';
import { FormField, Input, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { MATERIAL_STOCK_NULL, MATERIAL_STOCK_SCHEMA } from '@util/Schema';
import getTransactionArea from '@/util/TransactionArea';
export default function Index({
	modalId = '',
	updateMaterialDetails = {
		uuid: null,
		stock: 0,
	},
	setUpdateMaterialDetails,
}) {
	const { user } = useAuth();
	const { postData } = useMaterialInfo();
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
	const { invalidateQuery: invalidateMaterialTrx } = useMaterialTrx();

	const schema = {
		...MATERIAL_STOCK_SCHEMA,
		trx_quantity: MATERIAL_STOCK_SCHEMA.trx_quantity
			.moreThan(0, "Quantity can't be zero.")
			.max(updateMaterialDetails?.stock, 'Quantity Exceeds Stock'),
	};

	const { register, handleSubmit, errors, control, Controller, reset } =
		useRHF(schema, MATERIAL_STOCK_NULL);

	const onClose = () => {
		setUpdateMaterialDetails((prev) => ({
			...prev,
			uuid: null,
			stock: 0,
		}));
		reset(MATERIAL_STOCK_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Create Item
		if (updateMaterialDetails?.uuid !== null) {
			const updatedData = {
				...data,
				material_uuid: updateMaterialDetails.uuid,
				created_by: user?.uuid,
				uuid: nanoid(),
				created_at: GetDateTime(),
			};

			await postData.mutateAsync({
				url: '/material/trx',
				newData: updatedData,
				onClose,
			});
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
			invalidateMaterialTrx();

			return;
		}
	};

	const transactionArea = getTransactionArea();

	return (
		<AddModal
			id={`MaterialTrx`}
			title={'Material Trx of ' + updateMaterialDetails?.name}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<FormField label='trx_to' title='Transfer To' errors={errors}>
				<Controller
					name={'trx_to'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Transaction Area'
								options={transactionArea}
								onChange={(e) => {
									onChange(e.value);
								}}
							/>
						);
					}}
				/>
			</FormField>

			<Input
				label='trx_quantity'
				sub_label={`Max: ${updateMaterialDetails?.stock}`}
				placeholder={`Max: ${updateMaterialDetails?.stock}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
