import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import {
	useFetch,
	useFetchForRhfReset,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from "@/hooks";
import { FormField, Input, ReactSelect } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { ORDER_ISSUE_NULL, ORDER_ISSUE_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setOrder,
	updateOrder = {
		id: null,
		order_uuid: null,
		material_id: null,
		isWastage: null,
	},
	setUpdateOrder,
}) {
	const { user } = useAuth();
	const { register, handleSubmit, errors, reset, Controller, control ,context} =
		useRHF(ORDER_ISSUE_SCHEMA, ORDER_ISSUE_NULL);

	useFetchForRhfReset(`/issue/${updateOrder?.id}`, updateOrder?.id, reset);

	const { value: order } = useFetch("/order/description/value/label");
	const { value: material } = useFetch("/material/value/label");

	const onClose = () => {
		setUpdateOrder((prev) => ({
			...prev,
			id: null,
			order_uuid: null,
			material_id: null,
			isWastage: null,
		}));
		reset(ORDER_ISSUE_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateOrder?.id !== null) {
			const updatedData = {
				...data,
				user_id: user?.id,
				user_name: user?.name,
				updated_at: GetDateTime(),
			};
			useUpdateFunc({
				uri: `/issue/${updateOrder?.id}/${data?.name}`,
				itemId: updateOrder.id,
				data: data,
				updatedData: updatedData,
				setItems: setOrder,
				onClose: onClose,
			});

			return;
		}
		const updatedData = {
			...data,
			user_id: user?.id,
			user_name: user?.name,
			created_at: GetDateTime(),
		};

		await usePostFunc({
			uri: "/issue",
			data: updatedData,
			setItems: setOrder,
			onClose: onClose,
		});
	};
	const wastageOptions = [
		{ label: "NO", value: "0" },
		{ label: "YES", value: "1" },
	];

	return (
		<AddModal
			id={modalId}
			title={
				updateOrder?.id !== null ? "Update Issue Order" : "Issue Order"
			}
			formContext={context}
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
								options={order}
								value={order?.find(
									(item) =>
										item.value == updateOrder?.order_uuid
								)}
								onChange={(e) => {
									onChange(parseInt(e.value));
								}}
								isDisabled={updateOrder?.id !== null}
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
										item.value == updateOrder?.material_id
								)}
								onChange={(e) => {
									onChange(parseInt(e.value));
								}}
								isDisabled={updateOrder?.id !== null}
							/>
						);
					}}
				/>
			</FormField>
			<Input label="quantity" {...{ register, errors }} />
			<FormField label="isWastage" title="Wastage" errors={errors}>
				<Controller
					name={"isWastage"}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								label="isWastage"
								options={wastageOptions}
								value={wastageOptions?.find(
									(item) =>
										item.value == updateOrder?.isWastage
								)}
								onChange={(e) => {
									onChange(parseInt(e.value));
								}}
								{...{ register, errors }}
							/>
						);
					}}
				/>
			</FormField>
		</AddModal>
	);
}
