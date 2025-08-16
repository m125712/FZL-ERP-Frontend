import { useAuth } from '@/context/auth';
import { useCommonMaterialUsed } from '@/state/Common';
import { useOtherMaterial } from '@/state/Other';
import { useVislonFinishingRM } from '@/state/Vislon';
import { useFetchForRhfReset, useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { ShowLocalToast } from '@/components/Toast/ReactToastify';
import { FormField, Input, JoinInput, ReactSelect } from '@/ui';

import {
	RM_MATERIAL_USED_EDIT_NULL,
	RM_MATERIAL_USED_EDIT_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';
import getTransactionArea from '@/util/TransactionArea';

export default function Index({
	modalId = '',
	updateFinishingRMLog = {
		uuid: null,
		section: null,
		used_quantity: null,
		v_teeth_cleaning: null,
		v_gapping: null,
		v_sealing: null,
		v_t_cutting: null,
		v_stopper: null,
		wastage: null,
	},
	setUpdateFinishingRMLog,
}) {
	const { url, updateData } = useCommonMaterialUsed();
	const { invalidateQuery: invalidateFinishingRM } = useVislonFinishingRM();

	const { data: material } = useOtherMaterial();
	const { user } = useAuth();

	const MAX_QUANTITY = Number(
		updateFinishingRMLog?.section === 'v_gapping'
			? updateFinishingRMLog?.v_gapping
			: updateFinishingRMLog?.section === 'v_teeth_cleaning'
				? updateFinishingRMLog?.v_teeth_cleaning
				: updateFinishingRMLog?.section === 'v_sealing'
					? updateFinishingRMLog?.v_sealing
					: updateFinishingRMLog?.section === 'v_t_cutting'
						? updateFinishingRMLog?.v_t_cutting
						: updateFinishingRMLog?.v_stopper
	);
	// const schema = {
	// 	...RM_MATERIAL_USED_EDIT_SCHEMA,
	// 	used_quantity:
	// 		RM_MATERIAL_USED_EDIT_SCHEMA.used_quantity.max(MAX_QUANTITY),
	// };

	const {
		register,
		handleSubmit,
		errors,
		control,
		Controller,
		reset,
		getValues,
		context,
		watch,
	} = useRHF(RM_MATERIAL_USED_EDIT_SCHEMA, RM_MATERIAL_USED_EDIT_NULL);
	let MAX_PROD =
		MAX_QUANTITY +
		Number(updateFinishingRMLog?.used_quantity) +
		(Number(updateFinishingRMLog?.wastage) - watch('wastage'));
	let MAX_WASTAGE =
		MAX_QUANTITY +
		Number(updateFinishingRMLog?.wastage) +
		(Number(updateFinishingRMLog?.used_quantity) - watch('used_quantity'));

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
			v_teeth_cleaning: null,
			v_gapping: null,
			v_sealing: null,
			v_t_cutting: null,
			v_stopper: null,
			wastage: null,
		}));
		reset(RM_MATERIAL_USED_EDIT_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		if (
			MAX_WASTAGE < watch('wastage') &&
			MAX_PROD < watch('used_quantity')
		) {
			ShowLocalToast({
				type: 'error',
				message: 'Beyond Stock',
			});
			return;
		}
		// Update item
		if (updateFinishingRMLog?.uuid !== null) {
			const updatedData = {
				...data,
				material_name: updateFinishingRMLog?.material_name,
				updated_at: GetDateTime(),
				updated_by: user?.uuid,
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
			title={`Vislon RM Finishing Log of ${updateFinishingRMLog?.material_name}`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
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
			<JoinInput
				label='used_quantity'
				sub_label={`Max: ${MAX_PROD}`}
				unit={
					material?.find(
						(inItem) => inItem.value == getValues(`material_uuid`)
					)?.unit
				}
				{...{ register, errors }}
			/>
			<JoinInput
				label='wastage'
				sub_label={`Max: ${MAX_WASTAGE}`}
				unit={
					material?.find(
						(inItem) => inItem.value == getValues(`material_uuid`)
					)?.unit
				}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
