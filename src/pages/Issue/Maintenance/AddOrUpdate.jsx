import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import {
	useFetch,
	useFetchForRhfReset,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from "@/hooks";
import { FormField, Input, JoinInput, ReactSelect, Textarea } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { MAINTENANCE_NULL } from "@util/Schema";
import { useState } from "react";
import * as yup from "yup";

export default function Index({
	modalId = "",
	setMaintenance,
	updateMaintenance = {
		id: null,
		material_id: null,
	},
	setUpdateMaintenance,
}) {
	const [stockQuantity, setStockQuantity] = useState(0);
	const [unit, setUnit] = useState(null);
	const { user } = useAuth();
	const SCHEMA = {
		quantity: yup
			.number()
			.required("Quantity is required")
			.positive("Quantity must be positive")
			.min(0, "Quantity must be greater than or equal to 0")
			.max(
				stockQuantity,
				"Quantity must be less than or equal to remaining quantity"
			)
			.typeError("Quantity must be a number")
			.required("Quantity is required"),
		material_id: yup
			.number()
			.required("Material is required")
			.typeError("Material must be a number")
			.required("Required"),
		description: yup.string().required("Description is required").trim(),
	};
	const { register, handleSubmit, errors, reset, Controller, control } =
		useRHF(SCHEMA, MAINTENANCE_NULL);

	useFetchForRhfReset(
		`/maintenance/${updateMaintenance?.id}`,
		updateMaintenance?.id,
		reset
	);

	const { value: material } = useFetch("/material/value/label/unit/quantity");

	const onClose = () => {
		setUpdateMaintenance((prev) => ({
			...prev,
			id: null,
			material_id: null,
		}));
		reset(MAINTENANCE_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const material_name = material?.find(
			(item) => item.value == data?.material_id
		)?.label;
		const unit = material?.find(
			(item) => item.value == data?.material_id
		)?.unit;
		// Update item
		if (updateMaintenance?.id !== null) {
			const updatedData = {
				...data,
				material_name,
				unit,
				user_id: user?.id,
				user_name: user?.name,
				updated_at: GetDateTime(),
			};
			useUpdateFunc({
				uri: `/maintenance/${updateMaintenance?.id}/
				${material_name.replace(/[#&/]/g, "").replace(/\//g, "-")}`,
				itemId: updateMaintenance.id,
				data: data,
				updatedData: updatedData,
				setItems: setMaintenance,
				onClose: onClose,
			});

			return;
		}
		const updatedData = {
			...data,
			material_name,
			user_id: user?.id,
			user_name: user?.name,
			unit,
			created_at: GetDateTime(),
		};

		usePostFunc({
			uri: "/maintenance",
			data: updatedData,
			setItems: setMaintenance,
			onClose: onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={
				updateMaintenance?.id !== null
					? "Update Maintenance"
					: "Maintenance"
			}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<FormField label="material_id" title="Material" errors={errors}>
				<Controller
					name={"material_id"}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder="Select Material"
								options={material}
								value={material?.find(
									(item) =>
										item.value ==
										updateMaintenance?.material_id
								)}
								onChange={(e) => {
									onChange(parseInt(e.value));
									setUnit(e.unit);
									setStockQuantity(e.quantity);
								}}
								isDisabled={updateMaintenance?.id !== null}
							/>
						);
					}}
				/>
			</FormField>
			<JoinInput
				label="quantity"
				sub_label={`Stock: ${stockQuantity} ${unit ?? "kg"}`}
				unit={unit ?? "kg"}
				placeholder={`Max: ${stockQuantity} ${unit ?? "kg"}`}
				{...{ register, errors }}
			/>
			<Input label="remarks" {...{ register, errors }} />
			<Textarea label="description" {...{ register, errors }} />
		</AddModal>
	);
}
