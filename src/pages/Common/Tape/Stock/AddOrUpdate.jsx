import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import { useFetchForRhfReset, useRHF, useUpdateFunc } from "@/hooks";
import { Input, JoinInput } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { RM_MATERIAL_USED_NULL, RM_MATERIAL_USED_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setTapeStock,
	updateTapeStock = {
		id: null,
		quantity: null,
		unit: null,
	},
	setUpdateTapeStock,
}) {
	const { user } = useAuth();

	const schema = {
		remaining: RM_MATERIAL_USED_SCHEMA.remaining.max(
			updateTapeStock?.quantity
		),
		wastage: RM_MATERIAL_USED_SCHEMA.wastage.max(updateTapeStock?.quantity),
	};

	const { register, handleSubmit, errors, reset, watch } = useRHF(
		schema,
		RM_MATERIAL_USED_NULL
	);

	useFetchForRhfReset(
		`/material/stock/${updateTapeStock?.id}`,
		updateTapeStock?.id,
		reset
	);

	const onClose = () => {
		setUpdateTapeStock((prev) => ({
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
			quantity: data.remaining,
			used_quantity:
				updateTapeStock?.quantity - data.remaining - data.wastage, // problem
			material_stock_id: updateTapeStock?.id,
			section: "tape_making",
			issued_by: user?.id,
			issued_by_name: user?.name,
			created_at: GetDateTime(),
		};

		if (updatedData?.used_quantity < 0) {
			alert("Wastage can't be greater than remaining");
			return;
		}

		await useUpdateFunc({
			uri: `/material/used`,
			itemId: updateTapeStock?.id,
			data: data,
			updatedData: updatedData,
			setItems: setTapeStock,
			onClose: onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={updateTapeStock?.id !== null && "Material Usage Entry"}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<JoinInput
				label="remaining"
				unit={updateTapeStock?.unit}
				max={updateTapeStock?.quantity}
				placeholder={`Max: ${updateTapeStock?.quantity}`}
				{...{ register, errors }}
			/>
			<JoinInput
				label="wastage"
				unit={updateTapeStock?.unit}
				placeholder={`Max: ${(
					updateTapeStock?.quantity - watch("remaining")
				).toFixed(2)}`}
				{...{ register, errors }}
			/>
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
