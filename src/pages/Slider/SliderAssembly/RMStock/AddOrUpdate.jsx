import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import { useFetchForRhfReset, useRHF, useUpdateFunc } from "@/hooks";
import { Input, JoinInput } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { RM_MATERIAL_USED_NULL, RM_MATERIAL_USED_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setSliderAssembly,
	updateSliderAssembly = {
		id: null,
		quantity: null,
		unit: null,
	},
	setUpdateSliderAssembly,
}) {
	const { user } = useAuth();

	const schema = {
		remaining: RM_MATERIAL_USED_SCHEMA.remaining.max(
			updateSliderAssembly?.quantity
		),
		wastage: RM_MATERIAL_USED_SCHEMA.wastage.max(
			updateSliderAssembly?.quantity
		),
	};

	const { register, handleSubmit, errors, reset, watch } = useRHF(
		schema,
		RM_MATERIAL_USED_NULL
	);

	useFetchForRhfReset(
		`/material/stock/${updateSliderAssembly?.id}`,
		updateSliderAssembly?.id,
		reset
	);

	const onClose = () => {
		setUpdateSliderAssembly((prev) => ({
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
				updateSliderAssembly?.quantity - data.remaining - data.wastage,
			quantity: data.remaining,
			material_stock_id: updateSliderAssembly?.id,
			section: "slider_assembly",
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
			itemId: updateSliderAssembly?.id,
			data: data,
			updatedData: updatedData,
			setItems: setSliderAssembly,
			onClose: onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={"Material Usage Entry"}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<JoinInput
				label="remaining"
				max={updateSliderAssembly?.quantity}
				unit={updateSliderAssembly?.unit}
				placeholder={`Max: ${updateSliderAssembly?.quantity}`}
				{...{ register, errors }}
			/>
			<JoinInput
				label="wastage"
				unit={updateSliderAssembly?.unit}
				placeholder={`Max: ${(
					updateSliderAssembly?.quantity - watch("remaining")
				).toFixed(2)}`}
				{...{ register, errors }}
			/>
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
