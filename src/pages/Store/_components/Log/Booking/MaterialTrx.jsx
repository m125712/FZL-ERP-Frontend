import { useAuth } from '@/context/auth';
import { useCommonTapeRM } from '@/state/Common';
import { useLabDipRM } from '@/state/LabDip';
import { useSliderAssemblyRM, useSliderDieCastingRM } from '@/state/Slider';
import { useMaterialInfo } from '@/state/Store';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, ReactSelect } from '@/ui';

import nanoid from '@/lib/nanoid';
import { MATERIAL_STOCK_NULL, MATERIAL_STOCK_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';
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
	const { invalidateQuery: invalidateLabDipRM } = useLabDipRM();
	const { invalidateQuery: invalidateSliderAssemblyRM } =
		useSliderAssemblyRM();
	const { invalidateQuery: invalidateDieCastingRM } = useSliderDieCastingRM();

	const schema = {
		...MATERIAL_STOCK_SCHEMA,
		trx_quantity: MATERIAL_STOCK_SCHEMA.trx_quantity
			.moreThan(0, "Quantity can't be zero.")
			.max(updateMaterialDetails?.quantity, 'Quantity Exceeds Stock'),
	};

	const {
		register,
		handleSubmit,
		errors,
		control,
		Controller,
		getValues,
		reset,
		context,
	} = useRHF(schema, MATERIAL_STOCK_NULL);

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
				material_uuid: updateMaterialDetails.material_uuid,
				booking_uuid: updateMaterialDetails?.uuid,
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
			title={'Material Trx of ' + updateMaterialDetails?.name}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<FormField label='trx_to' title='Transfer To' errors={errors}>
				<Controller
					name={'trx_to'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Transaction Area'
								options={transactionArea}
								value={transactionArea?.filter(
									(item) => item.value === getValues('trx_to')
								)}
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
				sub_label={`Max: ${updateMaterialDetails?.quantity}`}
				placeholder={`Max: ${updateMaterialDetails?.quantity}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
