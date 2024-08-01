import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import { useFetchForRhfReset, useRHF, useUpdateFunc } from "@/hooks";
import { Input, JoinInput } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { RM_MATERIAL_USED_NULL, RM_MATERIAL_USED_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setTeethMolding,
	updateTeethMolding = {
		id: null,
		quantity: null,
		unit: null,
	},
	setUpdateTeethMolding,
}) {
	const { user } = useAuth();

	const schema = {
		remaining: RM_MATERIAL_USED_SCHEMA.remaining.max(
			updateTeethMolding?.quantity
		),
		wastage: RM_MATERIAL_USED_SCHEMA.wastage.max(
			updateTeethMolding?.quantity
		),
	};

	const { register, handleSubmit, errors, reset, watch } = useRHF(
		schema,
		RM_MATERIAL_USED_NULL
	);

	useFetchForRhfReset(
		`/material/stock/${updateTeethMolding?.id}`,
		updateTeethMolding?.id,
		reset
	);

	const onClose = () => {
		setUpdateTeethMolding((prev) => ({
			...prev,
			id: null,
			quantity: null,
			unit: null,
		}));
		reset(RM_MATERIAL_USED_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			used_quantity:
				updateTeethMolding?.quantity - data.remaining - data.wastage,
			quantity: data.remaining,
			material_stock_id: updateTeethMolding?.id,
			section: "m_teeth_molding",
			issued_by: user?.id,
			issued_by_name: user?.name,
			created_at: GetDateTime(),
		};

		if (updatedData?.used_quantity < 0) {
			alert("Wastage can't be greater than remaining");
			return;
		}

		await useUpdateFunc({
			uri: "/material/used",
			itemId: updateTeethMolding?.id,
			data: data,
			updatedData: updatedData,
			setItems: setTeethMolding,
			onClose: onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={updateTeethMolding?.id !== null && "Material Usage Entry"}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<JoinInput
				label="remaining"
				unit={updateTeethMolding?.unit}
				max={updateTeethMolding?.quantity}
				placeholder={`Max: ${updateTeethMolding?.quantity}`}
				{...{ register, errors }}
			/>
			<JoinInput
				label="wastage"
				unit={updateTeethMolding?.unit}
				placeholder={`Max: ${(
					updateTeethMolding?.quantity - watch("remaining")
				).toFixed(2)}`}
				{...{ register, errors }}
			/>
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
