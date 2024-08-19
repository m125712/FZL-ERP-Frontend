import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';
import { useCommonMaterialUsed, useCommonTapeRM } from '@/state/Common';
import { useSliderColoringRM } from '@/state/Slider';

import { FormField, Input, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import {
	RM_MATERIAL_USED_EDIT_NULL,
	RM_MATERIAL_USED_EDIT_SCHEMA,
} from '@util/Schema';

export default function Index({
	modalId = '',
	updateSliderColoringRMLog = {
		uuid: null,
		section: null,
		used_quantity: null,
		coloring: null,
	},
	setUpdateSliderColoringRMLog,
}) {
	const { url, updateData } = useCommonMaterialUsed();
	const { invalidateQuery: invalidateSliderColoringRM } =
		useSliderColoringRM();

	const MAX_QUANTITY =
		Number(updateSliderColoringRMLog?.coloring) +
		Number(updateSliderColoringRMLog?.used_quantity);
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
		wa,
	} = useRHF(schema, RM_MATERIAL_USED_EDIT_NULL);

	useFetchForRhfReset(
		`${url}/${updateSliderColoringRMLog?.uuid}`,
		updateSliderColoringRMLog?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateSliderColoringRMLog((prev) => ({
			...prev,
			uuid: null,
			section: null,
			used_quantity: null,
			coloring: null,
		}));
		reset(RM_MATERIAL_USED_EDIT_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateSliderColoringRMLog?.uuid !== null) {
			const updatedData = {
				...data,
				material_name: updateSliderColoringRMLog?.material_name,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateSliderColoringRMLog?.uuid}`,
				uuid: updateSliderColoringRMLog?.uuid,
				updatedData,
				onClose,
			});
			invalidateSliderColoringRM();

			return;
		}
	};

	const transactionArea = [
		{ label: 'Tape Making', value: 'tape_making' },
		{ label: 'Coil Forming', value: 'coil_forming' },
		{ label: 'Dying and Iron', value: 'dying_and_iron' },
		{ label: 'Slider Gapping', value: 'm_gapping' },
		{ label: 'Slider Gapping', value: 'v_gapping' },
		{ label: 'Slider Teeth Molding', value: 'coloring' },
		{
			label: 'Slider Teeth Molding',
			value: 'coloring',
		},
		{
			label: 'Teeth Assembling and Polishing',
			value: 'teeth_assembling_and_polishing',
		},
		{ label: 'Slider Teeth Cleaning', value: 'm_teeth_cleaning' },
		{ label: 'Slider Teeth Cleaning', value: 'v_teeth_cleaning' },
		{ label: 'Plating and Iron', value: 'plating_and_iron' },
		{ label: 'Slider Sealing', value: 'm_sealing' },
		{ label: 'Slider Sealing', value: 'v_sealing' },
		{ label: 'Nylon T Cutting', value: 'n_t_cutting' },
		{ label: 'Slider T Cutting', value: 'v_t_cutting' },
		{ label: 'Slider Stopper', value: 'm_stopper' },
		{ label: 'Vislon Stopper', value: 'v_stopper' },
		{ label: 'Nylon Stopper', value: 'n_stopper' },
		{ label: 'Cutting', value: 'cutting' },
		{ label: 'QC and Packing', value: 'qc_and_packing' },
		{ label: 'Die Casting', value: 'coloring' },
		{
			label: 'coloring Coloring',
			value: 'coloring_Coloring',
		},
		{ label: 'Coloring', value: 'coloring' },
		{ label: 'Lab Dip', value: 'lab_dip' },
	];

	return (
		<AddModal
			id={modalId}
			title={`Teeth Coloring Log of ${updateSliderColoringRMLog?.material_name}`}
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
				sub_label={`Max: ${Number(updateSliderColoringRMLog?.coloring) + Number(updateSliderColoringRMLog?.used_quantity)}`}
				placeholder={`Max: ${Number(updateSliderColoringRMLog?.coloring) + Number(updateSliderColoringRMLog?.used_quantity)}`}
				{...{ register, errors }}
			/>
			<Input
				label='wastage'
				sub_label={`Max: ${Number(updateSliderColoringRMLog?.coloring) + Number(updateSliderColoringRMLog?.used_quantity)}`}
				placeholder={`Max: ${Number(updateSliderColoringRMLog?.coloring) + Number(updateSliderColoringRMLog?.used_quantity)}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
