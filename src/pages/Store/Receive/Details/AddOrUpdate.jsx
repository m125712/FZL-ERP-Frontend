import { AddModal } from "@/components/Modal";
import {
	useFetch,
	useFetchForRhfReset,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from "@/hooks";
import {
	DynamicField,
	FormField,
	Input,
	ReactSelect,
	RemoveButton,
	Select,
} from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { PURCHASE_NULL, PURCHASE_SCHEMA } from "@util/Schema";
import { useState } from "react";

export default function Index({
	modalId = "",
	setPurchase,
	updatePurchase = {
		id: null,
		vendor_id: null,
		material_id: null,
		section_id: null,
		unit: null,
		is_local: null,
	},
	setUpdatePurchase,
}) {
	const [unit, setUnit] = useState([]);
	const {
		register,
		handleSubmit,
		errors,
		reset,
		Controller,
		control,
		useFieldArray,
		getValues,
	} = useRHF(PURCHASE_SCHEMA, PURCHASE_NULL);

	useFetchForRhfReset(
		`/purchase/${updatePurchase?.id}`,
		updatePurchase?.id,
		reset
	);

	const { value: vendor } = useFetch("/vendor/value/label");
	const { value: material } = useFetch("/material/value/label/unit/quantity");
	const { value: section } = useFetch(
		"/material-section/value/label/by/material/filter"
	);

	const onClose = () => {
		reset(PURCHASE_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const received_quantity = 0;
		const vendor_name = vendor?.find(
			(item) => item.value == data?.vendor_id
		)?.label;
		const material_info = material?.find(
			(item) => item.value == data?.material_id
		);
		const material_name = material_info?.label;

		// Update item
		if (updatePurchase?.id !== null) {
			const updatedData = {
				...data,
				vendor_name,
				material_name,
				updated_at: GetDateTime(),
			};

			const filterUrl =
				updatePurchase?.id +
				"/" +
				updatedData?.material_name
					.replace(/#/g, "")
					.replace(/\//g, "-");
			const uri =
				updatedData.is_local == 1
					? `/purchase/${filterUrl}`
					: `/purchase/lc/${filterUrl}`;
			await useUpdateFunc({
				uri: uri,
				itemId: updatePurchase.id,
				data: data,
				updatedData: updatedData,
				setItems: setPurchase,
				onClose: onClose,
			});

			return;
		}

		// Add new item
		const updatedData = data.purchase.map((item) => {
			const sectionItem = section?.find(
				(inItem) => inItem.material_id == item.material_id
			);
			const materialItem = material?.find(
				(inItem) => inItem.value == item.material_id
			);
			return {
				...data,
				section_id: sectionItem?.value,
				section_name: sectionItem?.label,
				received_quantity,
				vendor_name,
				material_name: materialItem?.label,
				material_id: item.material_id,
				unit: materialItem?.unit,
				quantity: item.quantity,
				price: item.price,
				created_at: GetDateTime(),
			};
		});
		// batch add
		let promises = updatedData.map((item) => {
			return usePostFunc({
				uri: "/purchase",
				data: item,
				setItems: setPurchase,
				onClose: onClose,
			});
		});

		await Promise.all(promises);
	};

	const purchaseOptions = [
		{ label: "LC", value: 0 },
		{ label: "Local", value: 1 },
	];

	// For Multi Entry
	const {
		fields: purchaseField,
		append: purchaseAppend,
		remove: purchaseRemove,
	} = useFieldArray({
		control,
		name: "purchase",
	});

	const handlePurchaseRemove = (index) => {
		purchaseRemove(index);
	};

	const handelPurchaseAppend = () => {
		purchaseAppend({
			material_id: "",
			quantity: "",
			price: "",
		});
	};

	return (
		<AddModal
			id={modalId}
			title={updatePurchase?.id !== null ? "Update Purchase" : "Purchase"}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
		>
			<div className="mb-4 flex flex-col gap-2 rounded-md bg-primary/30 p-2 md:flex-row">
				<FormField label="vendor_id" title="Vendor" errors={errors}>
					<Controller
						name={"vendor_id"}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder="Select Vendor"
									options={vendor}
									value={vendor?.find(
										(item) =>
											item.value ==
											updatePurchase?.vendor_id
									)}
									onChange={(e) => {
										onChange(parseInt(e.value));
									}}
									isDisabled={updatePurchase?.id !== null}
								/>
							);
						}}
					/>
				</FormField>
				<Select
					label="is_local"
					title="LC or Local"
					type="select"
					option={purchaseOptions}
					{...{ register, errors }}
				/>
				<Input label="remarks" {...{ register, errors }} />
			</div>
			{updatePurchase?.id == null ? (
				<DynamicField
					title="Material Info"
					handelAppend={
						updatePurchase?.id !== null ? "" : handelPurchaseAppend
					}
					tableHead={
						<tr className="font-semibold capitalize text-secondary-content">
							<th scope="col">Material</th>
							<th scope="col">Quantity</th>
							<th scope="col">Price</th>
						</tr>
					}
				>
					{purchaseField.map((item, index) => (
						<tr
							key={item.id}
							className="flex flex-col px-1.5 md:flex-row"
						>
							<td>
								<FormField
									label={`purchase[${index}].material_id`}
									title="Material"
									is_title_needed="false"
									errors={errors}
								>
									<Controller
										name={`purchase[${index}].material_id`}
										control={control}
										render={({ field: { onChange } }) => {
											return (
												<ReactSelect
													placeholder="Select Material"
													options={material}
													value={material?.find(
														(inItem) =>
															inItem.value ==
															getValues(
																`purchase[${index}].material_id`
															)
													)}
													onChange={(e) => {
														onChange(
															parseInt(e.value)
														);
														setUnit((prev) => {
															return [...prev, e];
														});
													}}
													isDisabled={
														updatePurchase?.id !==
														null
													}
												/>
											);
										}}
									/>
								</FormField>
							</td>
							<td>
								<Input
									title={`quantity`}
									label={`purchase[${index}].quantity`}
									is_title_needed="false"
									{...{ register, errors }}
								/>
							</td>
							<td>
								<Input
									title={`price`}
									label={`purchase[${index}].price`}
									is_title_needed="false"
									{...{ register, errors }}
								/>
								<RemoveButton
									onClick={() => handlePurchaseRemove(index)}
									showButton={purchaseField.length > 1}
								/>
							</td>

							{/* {updatePurchase.is_local == 0 && ( ----- )}*/}
						</tr>
					))}
				</DynamicField>
			) : (
				<div className="mb-4 flex flex-col gap-2 rounded-md bg-primary/30 p-2 md:flex-row">
					<FormField
						label={`material_id`}
						title="Material"
						errors={errors}
					>
						<Controller
							name={`material_id`}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder="Select Material"
										options={material}
										value={material?.find(
											(inItem) =>
												inItem.value ==
												getValues(`material_id`)
										)}
										onChange={(e) => {
											onChange(parseInt(e.value));
											setUnit((prev) => {
												return [...prev, e];
											});
										}}
										isDisabled={updatePurchase?.id !== null}
									/>
								);
							}}
						/>
					</FormField>
					<Input label="quantity" {...{ register, errors }} />
					<Input label="price" {...{ register, errors }} />
				</div>
			)}
		</AddModal>
	);
}
