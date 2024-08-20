import { AddModal } from '@/components/Modal';
import { useFetchForRhfReset, useRHF } from '@/hooks';
import { useMaterialInfo, useMaterialStockToSFG } from '@/state/Store';
import { FormField, Input, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import {
	MATERIAL_TRX_AGAINST_ORDER_NULL,
	MATERIAL_TRX_AGAINST_ORDER_SCHEMA,
} from '@util/Schema';

export default function Index({
	modalId = '',
	updateMaterialTrxToOrder = {
		uuid: null,
		material_name: null,
		trx_quantity: null,
		stock: null,
	},
	setUpdateMaterialTrxToOrder,
}) {
	const { url, updateData } = useMaterialStockToSFG();
	const { invalidateQuery: invalidateMaterialInfo } = useMaterialInfo();
	const schema = {
		...MATERIAL_TRX_AGAINST_ORDER_SCHEMA,
		trx_quantity: MATERIAL_TRX_AGAINST_ORDER_SCHEMA.trx_quantity.max(
			updateMaterialTrxToOrder?.stock
		),
	};
	const {
		register,
		handleSubmit,
		errors,
		control,
		Controller,
		reset,
		getValues,
	} = useRHF(schema, MATERIAL_TRX_AGAINST_ORDER_NULL);

	useFetchForRhfReset(
		`/material/stock-to-sfg/${updateMaterialTrxToOrder?.uuid}`,
		updateMaterialTrxToOrder?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateMaterialTrxToOrder((prev) => ({
			...prev,
			uuid: null,
			material_name: null,
			trx_quantity: null,
			stock: null,
		}));
		reset(MATERIAL_TRX_AGAINST_ORDER_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateMaterialTrxToOrder?.uuid !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};
			await updateData.mutateAsync({
				url: `${url}/${updateMaterialTrxToOrder?.uuid}`,
				uuid: updateMaterialTrxToOrder?.uuid,
				updatedData,
				onClose,
			});

			invalidateMaterialInfo();

			return;
		}
	};

	const transactionArea = [
		{ label: 'Dying and Iron', value: 'dying_and_iron' },
		{ label: 'Teeth Molding', value: 'teeth_molding' },
		{ label: 'Teeth Cleaning', value: 'teeth_coloring' },
		{ label: 'Finishing', value: 'finishing' },
		{ label: 'Slider Assembly', value: 'slider_assembly' },
		{ label: 'Coloring', value: 'coloring' },
	];

	return (
		<AddModal
			id={modalId}
			title={`Against Order Log of ${updateMaterialTrxToOrder?.material_name}`}
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
								isDisabled={
									updateMaterialTrxToOrder?.uuid !== null
								}
							/>
						);
					}}
				/>
			</FormField>
			<Input
				label='trx_quantity'
				sub_label={`Max: ${updateMaterialTrxToOrder?.stock}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
