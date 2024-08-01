import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import { useFetch, useFetchForRhfReset, useRHF, useUpdateFunc } from "@/hooks";
import { FormField, Input, ReactSelect } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import {
	MATERIAL_TRX_AGAINST_ORDER_NULL,
	MATERIAL_TRX_AGAINST_ORDER_SCHEMA,
} from "@util/Schema";

export default function Index({
	modalId = "",
	setMaterialDetails,
	updateMaterialDetails = {
		id: null,
		section_id: null,
		section_name: null,
		type_id: null,
		type_name: null,
		name: null,
		threshold: null,
		stock: null,
		unit: null,
		description: null,
		remarks: null,
		material_stock_id: null,
	},
	setUpdateMaterialDetails,
}) {
	const { user } = useAuth();

	const schema = {
		...MATERIAL_TRX_AGAINST_ORDER_SCHEMA,
		trx_quantity: MATERIAL_TRX_AGAINST_ORDER_SCHEMA.trx_quantity
			.moreThan(0)
			.max(updateMaterialDetails?.stock),
	};

	const { value: order } = useFetch(`/order/entry/value/label`);

	const { register, handleSubmit, errors, control, Controller, reset } =
		useRHF(schema, MATERIAL_TRX_AGAINST_ORDER_NULL);

	useFetchForRhfReset(
		`/material/stock/${updateMaterialDetails?.material_stock_id}`,
		updateMaterialDetails?.material_stock_id,
		reset
	);

	const onClose = () => {
		setUpdateMaterialDetails((prev) => ({
			...prev,
			id: null,
			section_id: null,
			section_name: null,
			type_id: null,
			type_name: null,
			name: null,
			threshold: null,
			stock: null,
			unit: null,
			description: null,
			remarks: null,
			material_stock_id: null,
		}));
		reset(MATERIAL_TRX_AGAINST_ORDER_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateMaterialDetails?.material_stock_id !== null) {
			const updatedData = {
				...data,
				...updateMaterialDetails,
				material_stock_id: updateMaterialDetails.material_stock_id,
				name: updateMaterialDetails?.name.replace(/[#&/]/g, ""),
				stock: updateMaterialDetails.stock - data.trx_quantity,
				issued_by: user?.id,
				created_at: GetDateTime(),
			};

			await useUpdateFunc({
				uri: `/material/trx-to/sfg`,
				itemId: updateMaterialDetails?.id,
				data: data,
				updatedData: updatedData,
				setItems: setMaterialDetails,
				onClose: onClose,
			});

			return;
		}
	};

	const transactionArea = [
		{ label: "Dying and Iron", value: "dying_and_iron" },
		{ label: "Teeth Molding", value: "teeth_molding" },
		{ label: "Teeth Cleaning", value: "teeth_coloring" },
		{ label: "Finishing", value: "finishing" },
		{ label: "Slider Assembly", value: "slider_assembly" },
		{ label: "Coloring", value: "coloring" },
	];

	return (
		<AddModal
			id={`MaterialTrxAgainstOrder`}
			title={
				"Material Trx Against Order of " + updateMaterialDetails?.name
			}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<FormField label="order_entry_id" title="Order" errors={errors}>
				<Controller
					name={"order_entry_id"}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder="Select Order"
								options={order}
								onChange={(e) => {
									onChange(parseInt(e.value));
								}}
							/>
						);
					}}
				/>
			</FormField>

			<FormField label="trx_to" title="Transfer To" errors={errors}>
				<Controller
					name={"trx_to"}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder="Select Transaction Area"
								options={transactionArea}
								onChange={(e) => onChange(e.value)}
							/>
						);
					}}
				/>
			</FormField>

			<Input
				label="trx_quantity"
				sub_label={`Max: ${updateMaterialDetails?.stock}`}
				placeholder={`Max: ${updateMaterialDetails?.stock}`}
				{...{ register, errors }}
			/>
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
