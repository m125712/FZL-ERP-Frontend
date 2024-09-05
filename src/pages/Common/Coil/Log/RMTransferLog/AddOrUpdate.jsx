import { AddModal } from '@/components/Modal';
import { useRHF } from '@/hooks';
import { useCommonCoilRM, useCommonMaterialUsedByUUID } from '@/state/Common';
import { FormField, Input, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import {
	RM_MATERIAL_USED_EDIT_NULL,
	RM_MATERIAL_USED_EDIT_SCHEMA,
} from '@util/Schema';
import getTransactionArea from '@/util/TransactionArea';
import { useEffect } from 'react';
export default function Index({
	modalId = '',
	updateCoilLog = {
		uuid: null,
		section: null,
		used_quantity: null,
	},
	setUpdateCoilLog,
}) {
	const { data, url, updateData } = useCommonMaterialUsedByUUID(
		updateCoilLog?.uuid
	);
	const { invalidateQuery: invalidateCommonCoilRM } = useCommonCoilRM();
	const MAX_QUANTITY =
		Number(updateCoilLog?.coil_forming) +
		Number(updateCoilLog?.used_quantity);
	const schema = {
		...RM_MATERIAL_USED_EDIT_SCHEMA,
		used_quantity:
			RM_MATERIAL_USED_EDIT_SCHEMA.used_quantity.max(MAX_QUANTITY),
	};

	const {
		register,
		handleSubmit,
		errors,
		control,
		Controller,
		reset,
		getValues,
	} = useRHF(schema, RM_MATERIAL_USED_EDIT_NULL);

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data]);

	const onClose = () => {
		setUpdateCoilLog((prev) => ({
			...prev,
			uuid: null,
			section: null,
			used_quantity: null,
		}));
		reset(RM_MATERIAL_USED_EDIT_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateCoilLog?.uuid !== null) {
			const updatedData = {
				...data,
				material_name: updateCoilLog?.material_name,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url,
				updatedData,
				onClose,
			});
			invalidateCommonCoilRM();
			return;
		}
	};

	const transactionArea = getTransactionArea();

	return (
		<AddModal
			id={modalId}
			title={`Coil Forming RM Log of ${updateCoilLog?.material_name}`}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
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
								isDisabled='1'
							/>
						);
					}}
				/>
			</FormField>
			<Input
				label='used_quantity'
				sub_label={`Max: ${MAX_QUANTITY}`}
				placeholder={`Max: ${MAX_QUANTITY}`}
				{...{ register, errors }}
			/>
			<Input
				label='wastage'
				sub_label={`Max: ${MAX_QUANTITY}`}
				placeholder={`Max: ${MAX_QUANTITY}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
