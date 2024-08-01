import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import { useFetchForRhfReset, useRHF, useUpdateFunc } from "@/hooks";
import { Input, JoinInput } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { RM_MATERIAL_USED_NULL, RM_MATERIAL_USED_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setDyeingAndIron,
	updateDyeingAndIron = {
		id: null,
		quantity: null,
		unit: null,
	},
	setUpdateDyeingAndIron,
}) {
	const { user } = useAuth();

	const schema = {
		remaining: RM_MATERIAL_USED_SCHEMA.remaining.max(
			updateDyeingAndIron?.quantity
		),
		wastage: RM_MATERIAL_USED_SCHEMA.wastage.max(
			updateDyeingAndIron?.quantity
		),
	};

	const { register, handleSubmit, errors, reset, watch } = useRHF(
		schema,
		RM_MATERIAL_USED_NULL
	);

	useFetchForRhfReset(
		`/material/stock/${updateDyeingAndIron?.id}`,
		updateDyeingAndIron?.id,
		reset
	);

	const onClose = () => {
		setUpdateDyeingAndIron((prev) => ({
			...prev,
			id: null,
			quantity: null,
		}));
		reset(RM_MATERIAL_USED_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			used_quantity:
				updateDyeingAndIron?.quantity - data.remaining - data.wastage,
			quantity: data.remaining,
			material_stock_id: updateDyeingAndIron?.id,
			section: "dying_and_iron",
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
			itemId: updateDyeingAndIron?.id,
			data: data,
			updatedData: updatedData,
			setItems: setDyeingAndIron,
			onClose: onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={updateDyeingAndIron?.id !== null && "Material Usage Entry"}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<JoinInput
				label="remaining"
				unit={updateDyeingAndIron?.unit}
				max={updateDyeingAndIron?.quantity}
				placeholder={`Max: ${updateDyeingAndIron?.quantity}`}
				{...{ register, errors }}
			/>
			<JoinInput
				label="wastage"
				unit={updateDyeingAndIron?.unit}
				placeholder={`Max: ${(
					updateDyeingAndIron?.quantity - watch("remaining")
				).toFixed(2)}`}
				{...{ register, errors }}
			/>
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
