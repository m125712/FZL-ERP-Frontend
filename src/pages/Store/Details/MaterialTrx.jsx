import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useMaterialInfo } from '@/state/Store';
import { FormField, Input, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { MATERIAL_STOCK_NULL, MATERIAL_STOCK_SCHEMA } from '@util/Schema';

export default function Index({
	modalId = '',
	updateMaterialDetails = {
		uuid: null,
		section_uuid: null,
		section_name: null,
		type_uuid: null,
		type_name: null,
		name: null,
		threshold: null,
		stock: null,
		unit: null,
		description: null,
		remarks: null,
	},
	setUpdateMaterialDetails,
}) {
	const { postData } = useMaterialInfo();
	const { user } = useAuth();

	const schema = {
		...MATERIAL_STOCK_SCHEMA,
		trx_quantity: MATERIAL_STOCK_SCHEMA.trx_quantity
			.moreThan(0, "Quantity can't be zero.")
			.max(updateMaterialDetails?.stock, 'Quantity Exceeds Stock'),
	};

	const { register, handleSubmit, errors, control, Controller, reset } =
		useRHF(schema, MATERIAL_STOCK_NULL);

	useFetchForRhfReset(
		`/material/stock/${updateMaterialDetails?.material_stock_uuid}`,
		updateMaterialDetails?.material_stock_uuid,
		reset
	);

	const onClose = () => {
		setUpdateMaterialDetails((prev) => ({
			...prev,
			uuid: null,
			section_uuid: null,
			section_name: null,
			type_uuid: null,
			type_name: null,
			name: null,
			threshold: null,
			stock: null,
			unit: null,
			description: null,
			remarks: null,
			material_stock_uuid: null,
		}));
		reset(MATERIAL_STOCK_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Create Item
		if (updateMaterialDetails?.uuid !== null) {
			const updatedData = {
				...data,
				...updateMaterialDetails,
				material_uuid: updateMaterialDetails.uuid,
				material_name: updateMaterialDetails?.name.replace(
					/[#&/]/g,
					''
				),

				stock: updateMaterialDetails.stock - data?.quantity,
				[`${data.trx_to}`]:
					updateMaterialDetails[`${data.trx_to}`] + data?.quantity,
				created_by: user?.uuid,
				uuid: nanoid(),
				created_at: GetDateTime(),
			};

			await postData.mutateAsync({
				url: '/material/trx',
				newData: updatedData,
				onClose,
			});

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
		{ label: 'QC and Packing', value: 'qc_and_packing' },
		{ label: 'Die Casting', value: 'die_casting' },
		{ label: 'Slider Assembly', value: 'slider_assembly' },
		{ label: 'Coloring', value: 'coloring' },
	];

	return (
		<AddModal
			id={`MaterialTrx`}
			title={'Material Trx of ' + updateMaterialDetails?.name}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<FormField label='trx_to' title='Transfer To' errors={errors}>
				<Controller
					name={'trx_to'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Transaction Area'
								options={transactionArea}
								onChange={(e) => {
									onChange(e.value);
								}}
							/>
						);
					}}
				/>
			</FormField>

			<Input
				label='trx_quantity'
				sub_label={`Max: ${updateMaterialDetails?.stock}`}
				placeholder={`Max: ${updateMaterialDetails?.stock}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
