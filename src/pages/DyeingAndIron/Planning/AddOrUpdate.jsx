import { AddModal } from "@/components/Modal";
import {
	useFetchForRhfReset,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from "@/hooks";
import { FormField, Input, ReactSelect } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { STRING } from "@util/Schema";

export default function Index({
	modalId = "",
	setOrder,
	updateOrder = {
		order_number: null,
		order_description_uuid: null,
	},
	setUpdateOrder,
}) {
	const schema = {
		factory_priority: STRING.required(),
	};
	const schema_null = {
		factory_priority: "",
	};
	const {
		register,
		handleSubmit,
		errors,
		reset,
		Controller,
		control,
		getValues,
	} = useRHF(schema, schema_null);

	useFetchForRhfReset(
		`order/planning/factory-priority/${updateOrder?.order_description_uuid}`,
		updateOrder?.order_description_uuid,
		reset
	);

	const onClose = () => {
		setUpdateOrder((prev) => ({
			...prev,
			order_number: null,
			order_description_uuid: null,
		}));
		reset(schema_null);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			updated_at: GetDateTime(),
			name: updateOrder?.order_number,
		};

		useUpdateFunc({
			uri: `/order/description/factory-priority/${updateOrder?.order_description_uuid}/${updatedData?.factory_priority}/${updatedData?.updated_at}/${updatedData?.name}`,
			itemId: updateOrder.id,
			data: data,
			updatedData: updatedData,
			setItems: setOrder,
			onClose: onClose,
		});
	};

	const priorityOptions = [
		{ value: "FIFO", label: "FIFO" },
		{ value: "URGENT", label: "URGENT" },
	];

	return (
		<AddModal
			id="FactoryPriorityModal"
			title={updateOrder?.id !== null ? "Update Order " : "Order "}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<FormField
				label="factory_priority"
				title="Factory Priority"
				errors={errors}
			>
				<Controller
					name={"factory_priority"}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder="Select Priority"
								options={priorityOptions}
								value={priorityOptions?.filter(
									(item) =>
										getValues("factory_priority") ==
										item.value
								)}
								onChange={(e) => onChange(e.value)}
								// isDisabled={updateOrder?.id !== null}
							/>
						);
					}}
				/>
			</FormField>
		</AddModal>
	);
}
