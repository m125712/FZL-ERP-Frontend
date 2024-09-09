import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import { useFetchForRhfReset, useRHF, useUpdateFunc } from "@/hooks";
import { Input } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { SWATCH_NULL, SWATCH_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setSwatch,
	updateSwatch = {
		id: null,
		order_entry_id: null,
		style: "",
		remarks: "",
	},
	setUpdateSwatch,
}) {
	const { user } = useAuth();
	const { register, handleSubmit, errors, reset, context } = useRHF(
		SWATCH_SCHEMA,
		SWATCH_NULL
	);

	useFetchForRhfReset(
		`/order/swatch/${updateSwatch?.order_entry_id}`,
		updateSwatch?.order_entry_id,
		reset
	);

	const onClose = () => {
		setUpdateSwatch((prev) => ({
			...prev,
			id: null,
			order_entry_id: null,
			style: "",
			remarks: "",
		}));
		reset(SWATCH_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		console.log("Data", data);
		// Update item
		const updatedData = {
			...data,
			style: updateSwatch?.style,
			updated_at: GetDateTime(),
		};

		await useUpdateFunc({
			uri: `/order/swatch/remarks/${updatedData?.order_entry_id}/${updatedData?.remarks}/${updatedData?.style.replace(/[#&/]/g, "")}`,
			itemId: updateSwatch?.id,
			data: data,
			updatedData: updatedData,
			setItems: setSwatch((prevSwatch) =>
				prevSwatch.map((item) =>
					item.order_entry_id === updatedData?.order_entry_id
						? { ...item, ...updatedData }
						: item
				)
			),
			onClose: onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={`Update Swatch Remarks`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
