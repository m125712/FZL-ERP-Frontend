import { AddModal } from '@/components/Modal';
import { useFetchForRhfReset, useRHF } from '@/hooks';
import { useMaterialInfo, useMaterialTrx } from '@/state/Store';
import { FormField, Input, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import getTransactionArea from '@/util/TransactionArea';
import { MATERIAL_STOCK_NULL, MATERIAL_STOCK_SCHEMA } from '@util/Schema';

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
	const { invalidateQuery: invalidateMaterialInfo } = useMaterialInfo();
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
	} = useRHF(schema, MATERIAL_STOCK_NULL);

	useFetchForRhfReset(
		`/material/trx/${updateMaterialTrx?.uuid}`,
		updateMaterialTrx?.uuid,
		reset
	);

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

			return;
		}
	};

	const transactionArea = getTransactionArea();

	return (
		<AddModal
			id={modalId}
			title={`Log of ${updateMaterialTrx?.material_name}`}
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
