import { AddModal } from "@/components/Modal";
import {
	useFetch,
	useFetchForRhfReset,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from "@/hooks";
import { FormField, Input, ReactSelect, Textarea } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { WASTAGE_NULL, WASTAGE_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setWastage,
	updateWastage = {
		id: null,
		order_uuid: null,
		material_id: null,
	},
	setUpdateWastage,
}) {
	const { register, handleSubmit, errors, reset, Controller, control } =
		useRHF(WASTAGE_SCHEMA, WASTAGE_NULL);

	useFetchForRhfReset(
		`/wastage/${updateWastage?.id}`,
		updateWastage?.id,
		reset
	);

	const { value: order_uuid } = useFetch("/order/description/value/label");
	const { value: material } = useFetch("/material/value/label/unit");

	const onClose = () => {
		setUpdateWastage((prev) => ({
			...prev,
			id: null,
			order_uuid: null,
			material_id: null,
		}));
		reset(WASTAGE_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const order_number = order_uuid?.find(
			(item) => item.value == data.order_uuid
		).label;
		const material_name = material?.find(
			(item) => item.value == data.material_id
		).label;
		const material_unit = material?.find(
			(item) => item.value == data.material_id
		).unit;
		// Update item
		if (updateWastage?.id !== null) {
			const updatedData = {
				...data,
				order_number,
				material_name,
				material_unit,
				updated_at: GetDateTime(),
			};
			useUpdateFunc({
				uri: `/wastage/${updateWastage?.id}/${order_number}`,
				itemId: updateWastage.id,
				data: data,
				updatedData: updatedData,
				setItems: setWastage,
				onClose: onClose,
			});

			return;
		}
		const updatedData = {
			...data,
			order_number,
			material_name,
			material_unit,
			created_at: GetDateTime(),
		};

		await usePostFunc({
			uri: "/wastage",
			data: updatedData,
			setItems: setWastage,
			onClose: onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={updateWastage?.id !== null ? "Update Wastage" : "Wastage"}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<FormField label="order_uuid" title="Order Number" errors={errors}>
				<Controller
					name={"order_uuid"}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder="Select Order Number"
								options={order_uuid}
								value={order_uuid?.find(
									(item) =>
										item.value == updateWastage?.order_uuid
								)}
								onChange={(e) => onChange(e.value)}
								isDisabled={updateWastage?.id !== null}
							/>
						);
					}}
				/>
			</FormField>
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
										item.value == updateWastage?.material_id
								)}
								onChange={(e) => onChange(parseInt(e.value))}
								isDisabled={updateWastage?.id !== null}
							/>
						);
					}}
				/>
			</FormField>
			<Input
				title="Quantity"
				label="assigned_quantity"
				{...{ register, errors }}
			/>
			<Textarea label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
