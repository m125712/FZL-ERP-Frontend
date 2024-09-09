import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';
import { useCommonMaterialUsed, useCommonTapeRM } from '@/state/Common';

import { useMetalFinishingRM } from '@/state/Metal';

import { FormField, Input, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import getTransactionArea from '@/util/TransactionArea';
import {
	RM_MATERIAL_USED_EDIT_NULL,
	RM_MATERIAL_USED_EDIT_SCHEMA,
} from '@util/Schema';
export default function Index({
	modalId = '',
	updateFinishingRMLog = {
		uuid: null,
		section: null,
		used_quantity: null,
		m_teeth_cleaning: null,
		m_gapping: null,
		m_sealing: null,
		m_stopper: null,
	},
	setUpdateFinishingRMLog,
}) {
	const { url, updateData } = useCommonMaterialUsed();
	const { invalidateQuery: invalidateFinishingRM } = useMetalFinishingRM();

	const MAX_QUANTITY =
		Number(
			updateFinishingRMLog?.section === 'm_gapping'
				? updateFinishingRMLog?.m_gapping
				: updateFinishingRMLog?.section === 'm_teeth_cleaning'
					? updateFinishingRMLog?.m_teeth_cleaning
					: updateFinishingRMLog?.section === 'm_sealing'
						? updateFinishingRMLog?.m_sealing
						: updateFinishingRMLog?.m_stopper
		) + Number(updateFinishingRMLog?.used_quantity);
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
		`${url}/${updateFinishingRMLog?.uuid}`,
		updateFinishingRMLog?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateFinishingRMLog((prev) => ({
			...prev,
			uuid: null,
			section: null,
			used_quantity: null,
			m_teeth_cleaning: null,
			m_gapping: null,
			m_sealing: null,
			m_stopper: null,
		}));
		reset(RM_MATERIAL_USED_EDIT_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateFinishingRMLog?.uuid !== null) {
			const updatedData = {
				...data,
				material_name: updateFinishingRMLog?.material_name,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateFinishingRMLog?.uuid}`,
				uuid: updateFinishingRMLog?.uuid,
				updatedData,
				onClose,
			});
			invalidateFinishingRM();

			return;
		}
	};

	const transactionArea = getTransactionArea();

	return (
		<AddModal
			id={modalId}
			title={`Material Finishing RM Log of ${updateFinishingRMLog?.material_name}`}
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
