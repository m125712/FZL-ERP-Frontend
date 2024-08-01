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
	setMaterialStock,
	updateMaterialStock = {
		id: null,
		name: null,
		stock: null,
	},
	setUpdateMaterialStock,
}) {
	const { user } = useAuth();

	const schema = {
		...MATERIAL_TRX_AGAINST_ORDER_SCHEMA,
		trx_quantity: MATERIAL_TRX_AGAINST_ORDER_SCHEMA.trx_quantity
			.moreThan(0)
			.max(updateMaterialStock?.stock),
	};

	const { value: order } = useFetch(`/order/entry/value/label`);

	const { register, handleSubmit, errors, control, Controller, reset } =
		useRHF(schema, MATERIAL_TRX_AGAINST_ORDER_NULL);

	useFetchForRhfReset(
		`/material/stock/${updateMaterialStock?.id}`,
		updateMaterialStock?.id,
		reset
	);

	const onClose = () => {
		setUpdateMaterialStock((prev) => ({
			...prev,
			id: null,
			name: null,
			stock: null,
		}));
		reset(MATERIAL_TRX_AGAINST_ORDER_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// console.log(data);
		// Update item
		if (updateMaterialStock?.id !== null) {
			const updatedData = {
				...data,
				material_stock_id: updateMaterialStock.id,
				name: updateMaterialStock?.name.replace(/[#&/]/g, ""),
				stock: updateMaterialStock.stock - data.trx_quantity,
				issued_by: user?.id,
				created_at: GetDateTime(),
			};

			await useUpdateFunc({
				uri: `/material/trx-to/sfg`,
				itemId: updateMaterialStock?.id,
				data: data,
				updatedData: updatedData,
				setItems: setMaterialStock,
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
			title={"Material Trx Against Order of " + updateMaterialStock?.name}
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
				sub_label={`Max: ${updateMaterialStock?.stock}`}
				placeholder={`Max: ${updateMaterialStock?.stock}`}
				{...{ register, errors }}
			/>
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
