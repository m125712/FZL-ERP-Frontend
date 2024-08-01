import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import { useFetchForRhfReset, useRHF, useUpdateFunc } from "@/hooks";
import { FormField, Input, ReactSelect } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import {
	RM_MATERIAL_USED_EDIT_NULL,
	RM_MATERIAL_USED_EDIT_SCHEMA,
} from "@util/Schema";

export default function Index({
	modalId = "",
	setFinishingLog,
	updateFinishingLog = {
		id: null,
		section: null,
		material_name: null,
		m_gapping: null,
		m_teeth_cleaning: null,
		m_sealing: null,
		m_stopper: null,
		used_quantity: null,
	},
	setUpdateFinishingLog,
}) {
	const { user } = useAuth();
	// m_gapping  m_teeth_cleaning  m_sealing  m_stopper
	const MAX_QUANTITY =
		(updateFinishingLog?.section === "m_gapping"
			? updateFinishingLog?.m_gapping
			: updateFinishingLog?.section === "m_teeth_cleaning"
				? updateFinishingLog?.m_teeth_cleaning
				: updateFinishingLog?.section === "m_sealing"
					? updateFinishingLog?.m_sealing
					: updateFinishingLog?.m_stopper) +
		updateFinishingLog?.used_quantity;
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
	} = useRHF(schema, RM_MATERIAL_USED_EDIT_NULL);

	useFetchForRhfReset(
		`material/used/${updateFinishingLog?.id}`,
		updateFinishingLog?.id,
		reset
	);

	const onClose = () => {
		setUpdateFinishingLog((prev) => ({
			...prev,
			id: null,
			section: null,
			material_name: null,
			m_gapping: null,
			m_teeth_cleaning: null,
			m_sealing: null,
			m_stopper: null,
			used_quantity: null,
		}));
		reset(RM_MATERIAL_USED_EDIT_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateFinishingLog?.id !== null) {
			const updatedData = {
				...data,
				material_name: updateFinishingLog?.material_name,
				updated_at: GetDateTime(),
			};

			await useUpdateFunc({
				uri: `/material/used/${
					updateFinishingLog?.id
				}/${updateFinishingLog?.material_name.replace(/[#&/]/g, "")}`,
				itemId: updateFinishingLog?.id,
				data: data,
				updatedData: updatedData,
				setItems: setFinishingLog,
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
		{
			label: "Metal Teeth Molding",
			value: "m_teeth_molding",
		},
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
			title={`Finishing Log of ${updateFinishingLog?.material_name}`}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<FormField label="section" title="Section" errors={errors}>
				<Controller
					name={"section"}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder="Select Section"
								options={transactionArea}
								value={transactionArea?.find(
									(item) => item.value == getValues("section")
								)}
								onChange={(e) => onChange(e.value)}
								isDisabled={updateFinishingLog?.id !== null}
							/>
						);
					}}
				/>
			</FormField>
			<Input
				label="used_quantity"
				sub_label={`Max: ${MAX_QUANTITY}`}
				placeholder={`Max: ${MAX_QUANTITY}`}
				{...{ register, errors }}
			/>
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
