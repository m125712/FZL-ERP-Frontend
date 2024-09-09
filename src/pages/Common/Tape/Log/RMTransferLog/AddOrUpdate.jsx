import { AddModal } from '@/components/Modal';
import { useRHF } from '@/hooks';
import { useCommonMaterialUsedByUUID, useCommonTapeRM } from '@/state/Common';
import { FormField, Input, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import getTransactionArea from '@/util/TransactionArea';
import {
	RM_MATERIAL_USED_EDIT_NULL,
	RM_MATERIAL_USED_EDIT_SCHEMA,
} from '@util/Schema';
import { useEffect } from 'react';

export default function Index({
	modalId = '',
	updateTapeLog = {
		uuid: null,
		section: null,
		used_quantity: null,
		tape_making: null,
	},
	setUpdateTapeLog,
}) {
	const { data, url, updateData } = useCommonMaterialUsedByUUID(
		updateTapeLog?.uuid
	);

	const { invalidateQuery: invalidateCommonTapeRM } = useCommonTapeRM();
	const MAX_QUANTITY =
		Number(updateTapeLog?.tape_making) +
		Number(updateTapeLog?.used_quantity);
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
		context
	} = useRHF(schema, RM_MATERIAL_USED_EDIT_NULL);

	useEffect(() => {
		if (data) {
			reset(data[0]);
		}
	}, [data]);

	const onClose = () => {
		setUpdateTapeLog((prev) => ({
			...prev,
			uuid: null,
			section: null,
			used_quantity: null,
			tape_making: null,
		}));
		reset(RM_MATERIAL_USED_EDIT_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateTapeLog?.uuid !== null) {
			const updatedData = {
				...data,
				material_name: updateTapeLog?.material_name,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url,
				updatedData,
				onClose,
			});
			invalidateCommonTapeRM();

			return;
		}
	};

	const transactionArea = getTransactionArea();

	return (
		<AddModal
			id={modalId}
			title={`Tape Making RM Log of ${updateTapeLog?.material_name}`}
			formContext={context}
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
				sub_label={`Max: ${Number(updateTapeLog?.tape_making) + Number(updateTapeLog?.used_quantity)}`}
				placeholder={`Max: ${Number(updateTapeLog?.tape_making) + Number(updateTapeLog?.used_quantity)}`}
				{...{ register, errors }}
			/>
			<Input
				label='wastage'
				sub_label={`Max: ${Number(updateTapeLog?.tape_making) + Number(updateTapeLog?.used_quantity)}`}
				placeholder={`Max: ${Number(updateTapeLog?.tape_making) + Number(updateTapeLog?.used_quantity)}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
