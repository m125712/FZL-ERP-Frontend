import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import { useFetchForRhfReset, useRHF, useUpdateFunc } from "@/hooks";
import { Input, JoinInput } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { RM_MATERIAL_USED_NULL, RM_MATERIAL_USED_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setDieCasting,
	updateDieCasting = {
		id: null,
		quantity: null,
		unit: null,
	},
	setUpdateDieCasting,
}) {
	const { user } = useAuth();
	const schema = {
		remaining: RM_MATERIAL_USED_SCHEMA.remaining.max(
			updateDieCasting?.quantity
		),
		wastage: RM_MATERIAL_USED_SCHEMA.wastage.max(
			updateDieCasting?.quantity
		),
	};

	const { register, handleSubmit, errors, reset, watch } = useRHF(
		schema,
		RM_MATERIAL_USED_NULL
	);

	useFetchForRhfReset(
		`/material/stock/${updateDieCasting?.id}`,
		updateDieCasting?.id,
		reset
	);

	const onClose = () => {
		setUpdateDieCasting((prev) => ({
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
				updateDieCasting?.quantity - data.remaining - data.wastage,
			quantity: data.remaining,
			material_stock_id: updateDieCasting?.id,
			section: "die_casting",
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
			itemId: updateDieCasting?.id,
			data: data,
			updatedData: updatedData,
			setItems: setDieCasting,
			onClose: onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={updateDieCasting?.id !== null && "Material Usage Entry"}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<JoinInput
				label="remaining"
				max={updateDieCasting?.quantity}
				unit={updateDieCasting?.unit}
				placeholder={`Max: ${updateDieCasting?.quantity}`}
				{...{ register, errors }}
			/>
			<JoinInput
				label="wastage"
				unit={updateDieCasting?.unit}
				placeholder={`Max: ${(
					updateDieCasting?.quantity - watch("remaining")
				).toFixed(2)}`}
				{...{ register, errors }}
			/>
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
