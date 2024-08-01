import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import { useFetchForRhfReset, useRHF, useUpdateFunc } from "@/hooks";
import { FormField, Input, ReactSelect } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import {
	MATERIAL_TRX_AGAINST_ORDER_NULL,
	MATERIAL_TRX_AGAINST_ORDER_SCHEMA,
} from "@util/Schema";

export default function Index({
	modalId = "",
	setMaterialTrxToOrder,
	updateMaterialTrxToOrder = {
		id: null,
		material_name: null,
		trx_quantity: null,
		stock: null,
	},
	setUpdateMaterialTrxToOrder,
}) {
	const schema = {
		...MATERIAL_TRX_AGAINST_ORDER_SCHEMA,
		trx_quantity: MATERIAL_TRX_AGAINST_ORDER_SCHEMA.trx_quantity.max(
			updateMaterialTrxToOrder?.stock
		),
	};
	const { user } = useAuth();
	const {
		register,
		handleSubmit,
		errors,
		control,
		Controller,
		reset,
		getValues,
	} = useRHF(schema, MATERIAL_TRX_AGAINST_ORDER_NULL);

	useFetchForRhfReset(
		`/material/trx-to/sfg/${updateMaterialTrxToOrder?.id}`,
		updateMaterialTrxToOrder?.id,
		reset
	);

	const onClose = () => {
		setUpdateMaterialTrxToOrder((prev) => ({
			...prev,
			id: null,
			material_name: null,
			trx_quantity: null,
			stock: null,
		}));
		reset(MATERIAL_TRX_AGAINST_ORDER_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateMaterialTrxToOrder?.id !== null) {
			const updatedData = {
				...data,
				material_name: updateMaterialTrxToOrder?.material_name,
				updated_at: GetDateTime(),
			};

			await useUpdateFunc({
				uri: `/material/trx-to/sfg/${
					updateMaterialTrxToOrder?.id
				}/${updateMaterialTrxToOrder?.material_name.replace(/[#&/]/g, "")}`,
				itemId: updateMaterialTrxToOrder?.id,
				data: data,
				updatedData: updatedData,
				setItems: setMaterialTrxToOrder,
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
			id={modalId}
			title={`Against Order Log of ${updateMaterialTrxToOrder?.material_name}`}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<FormField label="trx_to" title="Trx to" errors={errors}>
				<Controller
					name={"trx_to"}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder="Select Transaction Area"
								options={transactionArea}
								value={transactionArea?.find(
									(item) => item.value == getValues("trx_to")
								)}
								onChange={(e) => onChange(e.value)}
								isDisabled={
									updateMaterialTrxToOrder?.id !== null
								}
							/>
						);
					}}
				/>
			</FormField>
			<Input
				label="trx_quantity"
				sub_label={`Max: ${updateMaterialTrxToOrder?.stock}`}
				{...{ register, errors }}
			/>
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
