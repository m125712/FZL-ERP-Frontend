import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import { useFetchForRhfReset, useRHF, useUpdateFunc } from "@/hooks";
import { FormField, Input, ReactSelect } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { MATERIAL_STOCK_NULL, MATERIAL_STOCK_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setMaterialTrx,
	updateMaterialTrx = {
		id: null,
		material_name: null,
		stock: null,
	},
	setUpdateMaterialTrx,
}) {
	const { user } = useAuth();
	const MAX_QUANTITY = updateMaterialTrx?.stock;
	const schema = {
		...MATERIAL_STOCK_SCHEMA,
		quantity: MATERIAL_STOCK_SCHEMA.quantity.max(MAX_QUANTITY),
	};
	const {
		register,
		handleSubmit,
		errors,
		control,
		Controller,
		reset,
		getValues,
	} = useRHF(schema, MATERIAL_STOCK_NULL);

	useFetchForRhfReset(
		`/material/trx/${updateMaterialTrx?.id}`,
		updateMaterialTrx?.id,
		reset
	);

	const onClose = () => {
		setUpdateMaterialTrx((prev) => ({
			...prev,
			id: null,
		}));
		reset(MATERIAL_STOCK_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateMaterialTrx?.id !== null) {
			const updatedData = {
				...data,
				material_name: updateMaterialTrx?.material_name,
				updated_at: GetDateTime(),
			};

			await useUpdateFunc({
				uri: `/material/trx/${
					updateMaterialTrx?.id
				}/${updateMaterialTrx?.material_name.replace(/[#&/]/g, "")}`,
				itemId: updateMaterialTrx?.id,
				data: data,
				updatedData: updatedData,
				setItems: setMaterialTrx,
				onClose: onClose,
			});

			return;
		}
	};

	const transactionArea = [
		{ label: "Tape Making", value: "tape_making" },
		{ label: "Coil Forming", value: "coil_forming" },
		{ label: "Dying and Iron", value: "dying_and_iron" },
		{ label: "Metal Gapping", value: "m_gapping" },
		{ label: "Vislon Gapping", value: "v_gapping" },
		{ label: "Vislon Teeth Molding", value: "v_teeth_molding" },
		{ label: "Metal Teeth Molding", value: "m_teeth_molding" },
		{
			label: "Teeth Assembling and Polishing",
			value: "teeth_assembling_and_polishing",
		},
		{ label: "Metal Teeth Cleaning", value: "m_teeth_cleaning" },
		{ label: "Vislon Teeth Cleaning", value: "v_teeth_cleaning" },
		{ label: "Plating and Iron", value: "plating_and_iron" },
		{ label: "Metal Sealing", value: "m_sealing" },
		{ label: "Vislon Sealing", value: "v_sealing" },
		{ label: "Nylon T Cutting", value: "n_t_cutting" },
		{ label: "Vislon T Cutting", value: "v_t_cutting" },
		{ label: "Metal Stopper", value: "m_stopper" },
		{ label: "Vislon Stopper", value: "v_stopper" },
		{ label: "Nylon Stopper", value: "n_stopper" },
		{ label: "Cutting", value: "cutting" },
		{ label: "QC and Packing", value: "qc_and_packing" },
		{ label: "Die Casting", value: "die_casting" },
		{ label: "Slider Assembly", value: "slider_assembly" },
		{ label: "Coloring", value: "coloring" },
	];

	return (
		<AddModal
			id={modalId}
			title={`Log of ${updateMaterialTrx?.material_name}`}
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
								isDisabled={updateMaterialTrx?.id !== null}
							/>
						);
					}}
				/>
			</FormField>

			<Input
				label="quantity"
				sub_label={`Max: ${MAX_QUANTITY}`}
				placeholder={`Max: ${MAX_QUANTITY}`}
				{...{ register, errors }}
			/>

			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
