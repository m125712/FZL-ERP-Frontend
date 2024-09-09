import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';
import { useCommonMaterialUsed, useCommonTapeRM } from '@/state/Common';
import { useMetalTCRM } from '@/state/Metal';

import { FormField, Input, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import getTransactionArea from '@/util/TransactionArea';
import {
	RM_MATERIAL_USED_EDIT_NULL,
	RM_MATERIAL_USED_EDIT_SCHEMA,
} from '@util/Schema';
export default function Index({
	modalId = '',
	updateMetalTCRMLog = {
		uuid: null,
		section: null,
		used_quantity: null,

		teeth_assembling_and_polishing: null,
		plating_and_iron: null,
	},
	setUpdateMetalTCRMLog,
}) {
	const { url, updateData } = useCommonMaterialUsed();
	const { invalidateQuery: invalidateMetalTCRM } = useMetalTCRM();

	const MAX_QUANTITY =
		Number(
			updateMetalTCRMLog?.section === 'teeth_assembling_and_polishing'
				? updateMetalTCRMLog?.teeth_assembling_and_polishing
				: updateMetalTCRMLog?.plating_and_iron
		) + Number(updateMetalTCRMLog?.used_quantity);
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
		context,
	} = useRHF(schema, RM_MATERIAL_USED_EDIT_NULL);

	useFetchForRhfReset(
		`${url}/${updateMetalTCRMLog?.uuid}`,
		updateMetalTCRMLog?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateMetalTCRMLog((prev) => ({
			...prev,
			uuid: null,
			section: null,
			used_quantity: null,
			teeth_assembling_and_polishing: null,
			plating_and_iron: null,
		}));
		reset(RM_MATERIAL_USED_EDIT_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateMetalTCRMLog?.uuid !== null) {
			const updatedData = {
				...data,
				material_name: updateMetalTCRMLog?.material_name,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateMetalTCRMLog?.uuid}`,
				uuid: updateMetalTCRMLog?.uuid,
				updatedData,
				onClose,
			});
			invalidateMetalTCRM();

			return;
		}
	};

	const transactionArea = getTransactionArea();

	return (
		<AddModal
			id={modalId}
			title={`Teeth Coloring RM Log of ${updateMetalTCRMLog?.material_name}`}
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
