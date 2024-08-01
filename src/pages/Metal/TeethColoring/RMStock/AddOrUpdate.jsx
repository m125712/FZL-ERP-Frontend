import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import { useFetchForRhfReset, useRHF, useUpdateFunc } from "@/hooks";
import { Input, JoinInput } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { RM_MATERIAL_USED_NULL, RM_MATERIAL_USED_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setTeethColoring,
	updateTeethColoring = {
		id: null,
		section: "",
		quantity: null,
		unit: null,
	},
	setUpdateTeethColoring,
}) {
	const { user } = useAuth();

	const schema = {
		remaining: RM_MATERIAL_USED_SCHEMA.remaining.max(
			updateTeethColoring?.quantity
		),
		wastage: RM_MATERIAL_USED_SCHEMA.wastage.max(
			updateTeethColoring?.quantity
		),
	};

	const { register, handleSubmit, errors, reset, watch } = useRHF(
		schema,
		RM_MATERIAL_USED_NULL
	);

	useFetchForRhfReset(
		`/material/stock/${updateTeethColoring?.id}`,
		updateTeethColoring?.id,
		reset
	);

	const onClose = () => {
		setUpdateTeethColoring((prev) => ({
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
				updateTeethColoring?.quantity - data.remaining - data.wastage,
			quantity: data.remaining,
			material_stock_id: updateTeethColoring?.id,
			section: updateTeethColoring?.section,
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
			itemId: updateTeethColoring?.id,
			data: data,
			updatedData: updatedData,
			setItems: setTeethColoring,
			onClose: onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={updateTeethColoring?.id !== null && "Material Usage Entry"}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<JoinInput
				label="remaining"
				unit={updateTeethColoring?.unit}
				max={updateTeethColoring?.quantity}
				placeholder={`Max: ${updateTeethColoring?.quantity}`}
				{...{ register, errors }}
			/>
			<JoinInput
				label="wastage"
				unit={updateTeethColoring?.unit}
				placeholder={`Max: ${(
					updateTeethColoring?.quantity - watch("remaining")
				).toFixed(2)}`}
				{...{ register, errors }}
			/>
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
