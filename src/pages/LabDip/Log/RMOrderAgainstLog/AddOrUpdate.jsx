import { AddModal } from '@/components/Modal';

import { useFetchForRhfReset, useRHF } from '@/hooks';
import { useCommonMaterialTrx } from '@/state/Common';
import {
	useMaterialInfo,
	useMaterialTrxAgainstOrderDescription,
} from '@/state/Store';
import { FormField, Input, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import getTransactionArea from '@/util/TransactionArea';
import {
	RM_MATERIAL_ORDER_AGAINST_EDIT_NULL,
	RM_MATERIAL_ORDER_AGAINST_EDIT_SCHEMA,
} from '@util/Schema';
export default function Index({
	modalId = '',
	updateLog = {
		uuid: null,
		trx_to: null,
		trx_quantity: null,
		stock: null,
	},
	setUpdateLog,
}) {
	const { url, updateData } = useCommonMaterialTrx();
	const { invalidateQuery: invalidateMaterialInfo } = useMaterialInfo();
	const { invalidateQuery: invalidateMaterialTrx } =
		useMaterialTrxAgainstOrderDescription();

	const MAX_QUANTITY =
		Number(updateLog?.stock) + Number(updateLog?.trx_quantity);
	const schema = {
		...RM_MATERIAL_ORDER_AGAINST_EDIT_SCHEMA,
		trx_quantity:
			RM_MATERIAL_ORDER_AGAINST_EDIT_SCHEMA.trx_quantity.max(
				MAX_QUANTITY
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
		context,
	} = useRHF(schema, RM_MATERIAL_ORDER_AGAINST_EDIT_NULL);

	useFetchForRhfReset(`${url}/${updateLog?.uuid}`, updateLog?.uuid, reset);

	const onClose = () => {
		setUpdateLog((prev) => ({
			...prev,
			uuid: null,
			trx_to: null,
			trx_quantity: null,
			stock: null,
		}));
		reset(RM_MATERIAL_ORDER_AGAINST_EDIT_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateLog?.uuid !== null) {
			const updatedData = {
				...data,
				material_name: updateLog?.material_name,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateLog?.uuid}`,
				uuid: updateLog?.uuid,
				updatedData,
				onClose,
			});
			invalidateMaterialInfo();
			invalidateMaterialTrx();
			return;
		}
	};

	const transactionArea = getTransactionArea();

	return (
		<AddModal
			id={modalId}
			title={`Lab Dip RM Log of ${updateLog?.material_name}`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<FormField label='trx_to' title='trx_to' errors={errors}>
				<Controller
					name={'trx_to'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select trx_to'
								options={transactionArea}
								value={transactionArea?.find(
									(item) => item.value == getValues('trx_to')
								)}
								onChange={(e) => onChange(e.value)}
								isDisabled='1'
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
