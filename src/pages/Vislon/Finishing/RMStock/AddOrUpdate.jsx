import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import { useFetchForRhfReset, useRHF, useUpdateFunc } from "@/hooks";
import { FormField, Input, JoinInput } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { RM_MATERIAL_USED_NULL, RM_MATERIAL_USED_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setFinishing,
	updateFinishing = {
		id: null,
		section: "",
		quantity: null,
		unit: "",
	},
	setUpdateFinishing,
}) {
	const { user } = useAuth();
	const schema = {
		remaining: RM_MATERIAL_USED_SCHEMA.remaining.max(
			updateFinishing?.quantity
		),
		wastage: RM_MATERIAL_USED_SCHEMA.wastage.max(updateFinishing?.quantity),
	};

	const { register, handleSubmit, errors, reset, watch } = useRHF(
		schema,
		RM_MATERIAL_USED_NULL
	);

	useFetchForRhfReset(
		`/material/stock/${updateFinishing?.id}`,
		updateFinishing?.id,
		reset
	);

	const onClose = () => {
		setUpdateFinishing((prev) => ({
			...prev,
			id: null,
			section: "",
			quantity: null,
			unit: "",
		}));
		reset(RM_MATERIAL_USED_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			used_quantity:
				updateFinishing?.quantity - data.remaining - data.wastage,
			quantity: data.remaining,
			material_stock_id: updateFinishing?.id,
			section: updateFinishing?.section,
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
			itemId: updateFinishing?.id,
			data: data,
			updatedData: updatedData,
			setItems: setFinishing,
			onClose: onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={updateFinishing?.id !== null && "Material Usage Entry"}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<JoinInput
				label="remaining"
				max={updateFinishing?.quantity}
				unit={updateFinishing?.unit}
				placeholder={`Max: ${updateFinishing?.quantity}`}
				{...{ register, errors }}
			/>
			<JoinInput
				label="wastage"
				unit={updateFinishing?.unit}
				placeholder={`Max: ${(
					updateFinishing?.quantity - watch("remaining")
				).toFixed(2)}`}
				{...{ register, errors }}
			/>
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
