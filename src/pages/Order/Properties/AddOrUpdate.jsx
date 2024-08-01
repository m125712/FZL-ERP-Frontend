import { AddModal } from "@/components/Modal";
import {
	useFetchForRhfReset,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from "@/hooks";
import { FormField, Input, ReactSelect } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { PROPERTIES_NULL, PROPERTIES_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setOrderProperties,
	updateOrderProperties = {
		id: null,
	},
	setUpdateOrderProperties,
}) {
	const {
		register,
		handleSubmit,
		errors,
		reset,
		Controller,
		control,
		getValues,
	} = useRHF(PROPERTIES_SCHEMA, PROPERTIES_NULL);

	useFetchForRhfReset(
		`/order/properties/${updateOrderProperties?.id}`,
		updateOrderProperties?.id,
		reset
	);

	const onClose = () => {
		setUpdateOrderProperties((prev) => ({
			...prev,
			id: null,
		}));
		reset(PROPERTIES_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateOrderProperties?.id !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};
			useUpdateFunc({
				uri: `/order/properties/${updateOrderProperties?.id}/${data?.name}`,
				itemId: updateOrderProperties.id,
				data: data,
				updatedData: updatedData,
				setItems: setOrderProperties,
				onClose: onClose,
			});

			return;
		}
		const updatedData = {
			...data,
			created_at: GetDateTime(),
		};

		usePostFunc({
			uri: "/order/properties",
			data: updatedData,
			setItems: setOrderProperties,
			onClose: onClose,
		});
	};

	const typeOptions = [
		{ value: "end_type", label: "End Type" },
		{ value: "lock_type", label: "Lock Type" },
		{ value: "item", label: "Item" },
		{ value: "zipper_number", label: "Zipper Number" },
		{ value: "puller_type", label: "Puller Type" },
		{ value: "hand", label: "Hand" },
		{ value: "special_requirement", label: "Special Requirement" },
		{ value: "color", label: "Color" },
		{ value: "stopper_type", label: "Stopper Type" },
		{ value: "coloring_type", label: "Coloring Type" },
		{ value: "slider", label: "Slider" },
		{ value: "top_stopper", label: "Top Stopper" },
		{ value: "bottom_stopper", label: "Bottom Stopper" },
		{ value: "logo_type", label: "Logo Type" },
	];

	return (
		<AddModal
			id={modalId}
			title={
				updateOrderProperties?.id !== null
					? "Update Order Properties"
					: "Order Properties"
			}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<FormField label="type" title="Type" errors={errors}>
				<Controller
					name={"type"}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder="Select Type"
								options={typeOptions}
								value={typeOptions?.filter((item) =>
									getValues("type").includes(item.value)
								)}
								onChange={(e) => {
									onChange(e.value);
								}}
								isDisabled={updateOrderProperties?.id !== null}
							/>
						);
					}}
				/>
			</FormField>
			<Input label="name" {...{ register, errors }} />
			<Input label="short_name" {...{ register, errors }} />
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
