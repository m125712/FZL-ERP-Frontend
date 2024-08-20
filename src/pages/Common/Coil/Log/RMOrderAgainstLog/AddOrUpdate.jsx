import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';
import { useCommonMaterialTrx } from '@/state/Common';
import { useMaterialInfo } from '@/state/Store';
import { FormField, Input, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
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
			return;
		}
	};

	const transactionArea = [
		{ label: 'Tape Making', value: 'tape_making' },
		{ label: 'Coil Forming', value: 'coil_forming' },
		{ label: 'Dying and Iron', value: 'dying_and_iron' },
		{ label: 'Metal Gapping', value: 'm_gapping' },
		{ label: 'Vislon Gapping', value: 'v_gapping' },
		{ label: 'Vislon Teeth Molding', value: 'v_teeth_molding' },
		{ label: 'Metal Teeth Molding', value: 'm_teeth_molding' },
		{
			label: 'Teeth Assembling and Polishing',
			value: 'teeth_assembling_and_polishing',
		},
		{ label: 'Metal Teeth Cleaning', value: 'm_teeth_cleaning' },
		{ label: 'Vislon Teeth Cleaning', value: 'v_teeth_cleaning' },
		{ label: 'Plating and Iron', value: 'plating_and_iron' },
		{ label: 'Metal Sealing', value: 'm_sealing' },
		{ label: 'Vislon Sealing', value: 'v_sealing' },
		{ label: 'Nylon T Cutting', value: 'n_t_cutting' },
		{ label: 'Vislon T Cutting', value: 'v_t_cutting' },
		{ label: 'Metal Stopper', value: 'm_stopper' },
		{ label: 'Vislon Stopper', value: 'v_stopper' },
		{ label: 'Nylon Stopper', value: 'n_stopper' },
		{ label: 'Cutting', value: 'cutting' },
		{ label: 'Metal QC and Packing', value: 'm_qc_and_packing' },
		{ label: 'Nylon QC and Packing', value: 'n_qc_and_packing' },
		{ label: 'Vislon QC and Packing', value: 'v_qc_and_packing' },
		{ label: 'Slider QC and Packing', value: 's_qc_and_packing' },
		{ label: 'Die Casting', value: 'die_casting' },
		{ label: 'Slider Assembly', value: 'slider_assembly' },
		{ label: 'Coloring', value: 'coloring' },
		{ label: 'Lab Dip', value: 'lab_dip' },
	];

	return (
		<AddModal
			id={modalId}
			title={`Coil Forming RM Log of ${updateLog?.material_name}`}
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
