import { DeleteModal } from "@/components/Modal";
import {
	useAccess,
	useFetch,
	useFetchForRhfResetForOrder,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from "@/hooks";
import {
	DynamicField,
	FormField,
	Input,
	JoinInput,
	ReactSelect,
	RemoveButton,
} from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { nanoid } from "@/util/nanoid";
import { useAuth } from "@context/auth";
import {
	SLIDER_DIE_CASTING_NULL,
	SLIDER_DIE_CASTING_SCHEMA,
} from "@util/Schema";
import { Suspense, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// UPDATE IS NOT WORKING
export default function Index() {
	const r_saveBtn = useRef();
	const { slider_die_casting_uuid } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();

	const haveAccess = useAccess("slider__die_casting_entry");

	useEffect(() => {
		slider_die_casting_uuid !== undefined
			? (document.title = "Update Die Casting Entry")
			: (document.title = "Die Casting Entry");
	}, []);

	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		Controller,
		useFieldArray,
		getValues,
		watch,
	} = useRHF(SLIDER_DIE_CASTING_SCHEMA, SLIDER_DIE_CASTING_NULL);

	useFetchForRhfResetForOrder(
		`/slider/die-casting/details/by/${slider_die_casting_uuid}/array`,
		slider_die_casting_uuid,
		reset
	);

	const { value: slider_item_name } = useFetch(
		"/slider-item-library/value/label/die_casting"
	);

	//
	const {
		fields: sliderDieCastingEntryField,
		append: sliderDieCastingAppend,
		remove: sliderDieCastingRemove,
	} = useFieldArray({
		control,
		name: "slider_die_casting_details",
	});

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const handleSliderDieCastingRemove = (index) => {
		if (getValues(`${index}.id`) !== undefined) {
			setDeleteItem({
				itemId: getValues(`slider_die_casting_details[${index}].id`),
				itemName: getValues(`slider_die_casting_details[${index}].id`),
			});
			window["slider_entry_modal_delete"].showModal();
		}
		sliderDieCastingRemove(index);
	};

	const handleSliderDieCastingAppend = () => {
		sliderDieCastingAppend({
			mc_no: "",
			slider_item_id: "",
			item_type: "",
			cavity_goods: "",
			cavity_reject: "",
			push_value: "",
			order_number: "",
			weight: "",
			remarks: "",
		});
	};
	const onClose = () => reset(SLIDER_DIE_CASTING_NULL);
	const isUpdate = slider_die_casting_uuid !== undefined;
	// Submit
	const onSubmit = async (data) => {
		const issued_by = user?.id;

		var slider_die_casting_uuid_old_or_new = isUpdate
			? slider_die_casting_uuid
			: nanoid();
		const { slider_die_casting_details } = data;
		const slider_die_casting = slider_die_casting_details.map((item) => {
			return {
				...item,
				slider_die_casting_uuid: slider_die_casting_uuid_old_or_new,
				issued_by: issued_by,
			};
		});
		// console.log(slider_die_casting, "slider_die_casting");

		if (isUpdate) {
			let promises = slider_die_casting.map(async (item) => {
				if (item.id === undefined) {
					item.slider_die_casting_uuid =
						slider_die_casting_uuid_old_or_new;
					item.created_at = GetDateTime();
					return await usePostFunc({
						uri: "/slider/die-casting/entry",
						data: item,
					}).catch((err) => console.error(`Error: ${err}`));
				}

				const updatedData = {
					...item,
					updated_at: GetDateTime(),
				};
				return await useUpdateFunc({
					uri: `/slider/die-casting/entry/${item?.id}/${updatedData?.slider_die_casting_uuid}`,
					itemId: item.id,
					data: item,
					updatedData: updatedData,
					onClose: onClose,
				}).catch((err) => console.error(`Error updating data: ${err}`));
			});

			try {
				await Promise.all([...promises]).then(() =>
					reset(Object.assign({}, SLIDER_DIE_CASTING_NULL))
				);
				navigate(`/slider/die-casting/production`);
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}

			return;
		}

		let promise = [
			...slider_die_casting.map((item) =>
				usePostFunc({ uri: "/slider/die-casting/entry", data: item })
			),
		];

		Promise.all(promise)
			.then(() => {
				reset(SLIDER_DIE_CASTING_NULL);
				navigate(`/slider/die-casting/production`);
			})
			.catch((err) => console.log(err));
	};

	const ItemTypeOptions = [
		{ value: "body", label: "Body" },
		{ value: "cap", label: "Cap" },
		{ value: "puller", label: "Puller" },
		{ value: "link", label: "Link" },
		{ value: "h-bottom", label: "H-Bottom" },
		{ value: "u-top", label: "U-Top" },
	];

	return (
		<div className="container mx-auto mb-6 mt-6 px-2 pb-2 md:px-4">
			<form
				onSubmit={handleSubmit(onSubmit)}
				noValidate
				className="flex flex-col gap-4"
			>
				<DynamicField
					title={
						slider_die_casting_uuid == null
							? `Entry Details`
							: "Update Details"
					}
					handelAppend={handleSliderDieCastingAppend}
					tableHead={[
						"MC NO",
						"Item Name",
						"Item Type",
						"Cavity Goods",
						"Cavity Defect",
						"Push",
						"Order Number",
						"Weight",
						"Remarks",
					].map((item) => (
						<th key={item} scope="col">
							{item}
						</th>
					))}
				>
					{sliderDieCastingEntryField.map((item, index) => (
						<tr key={item.id}>
							<td className="w-16">
								<Input
									label={`slider_die_casting_details[${index}].mc_no`}
									defaultValue={item.mc_no}
									is_title_needed="false"
									register={register}
									dynamicerror={
										errors?.slider_die_casting_details
											?.mc_no
									}
								/>
							</td>
							<td className="w-32">
								<FormField
									label={`slider_die_casting_details[${index}].slider_item_id`}
									is_title_needed="false"
									register={register}
									dynamicerror={
										errors?.slider_die_casting_details
											?.slider_item_id
									}
								>
									<Controller
										name={`slider_die_casting_details[${index}].slider_item_id`}
										control={control}
										render={({ field: { onChange } }) => {
											return (
												<ReactSelect
													placeholder="Select Material"
													options={slider_item_name}
													value={slider_item_name?.find(
														(inItem) =>
															inItem.value ==
															getValues(
																`slider_die_casting_details[${index}].slider_item_id`
															)
													)}
													onChange={(e) => {
														onChange(e.value);
													}}
													menuPortalTarget={
														document.body
													}
												/>
											);
										}}
									/>
								</FormField>
							</td>
							<td className="w-40">
								<FormField
									label={`slider_die_casting_details[${index}].item_type`}
									is_title_needed="false"
									register={register}
									dynamicerror={
										errors?.slider_die_casting_details
											?.item_type
									}
								>
									<Controller
										name={`slider_die_casting_details[${index}].item_type`}
										control={control}
										render={({ field: { onChange } }) => {
											return (
												<ReactSelect
													placeholder="Select Material"
													options={ItemTypeOptions}
													value={ItemTypeOptions?.find(
														(inItem) =>
															inItem.value ==
															getValues(
																`slider_die_casting_details[${index}].item_type`
															)
													)}
													onChange={(e) => {
														onChange(e.value);
													}}
													menuPortalTarget={
														document.body
													}
												/>
											);
										}}
									/>
								</FormField>
							</td>
							<td className="w-32">
								<Input
									label={`slider_die_casting_details[${index}].cavity_goods`}
									defaultValue={item.cavity_goods}
									is_title_needed="false"
									register={register}
									dynamicerror={
										errors?.slider_die_casting_details
											?.cavity_goods
									}
								/>
							</td>
							<td className="w-32">
								<Input
									label={`slider_die_casting_details[${index}].cavity_reject`}
									defaultValue={item.cavity_reject}
									is_title_needed="false"
									register={register}
									dynamicerror={
										errors?.slider_die_casting_details
											?.cavity_reject
									}
								/>
							</td>
							<td className="w-32">
								<Input
									label={`slider_die_casting_details[${index}].push_value`}
									defaultValue={item.push_value}
									is_title_needed="false"
									register={register}
									dynamicerror={
										errors?.slider_die_casting_details
											?.push_value
									}
								/>
							</td>
							<td className="w-32">
								<Input
									label={`slider_die_casting_details[${index}].order_number`}
									defaultValue={item.order_number}
									is_title_needed="false"
									register={register}
									dynamicerror={
										errors?.slider_die_casting_details
											?.order_number
									}
								/>
							</td>
							<td className="w-40">
								<JoinInput
									label={`slider_die_casting_details[${index}].weight`}
									defaultValue={item.weight}
									is_title_needed="false"
									unit="KG"
									register={register}
									dynamicerror={
										errors?.slider_die_casting_details
											?.weight
									}
								/>
							</td>
							<td>
								<Input
									label={`slider_die_casting_details[${index}].remarks`}
									defaultValue={item.remarks}
									is_title_needed="false"
									register={register}
									dynamicerror={
										errors?.slider_die_casting_details
											?.remarks
									}
								/>
							</td>
							<RemoveButton
								onClick={() =>
									handleSliderDieCastingRemove(index)
								}
								showButton={
									sliderDieCastingEntryField.length > 1
								}
							/>
						</tr>
					))}
				</DynamicField>
				<div className="modal-action">
					<button
						type="submit"
						className="text-md btn btn-primary btn-block"
						ref={r_saveBtn}
						// onKeyDown={keyDown}
					>
						Save
					</button>
				</div>
			</form>
			<Suspense>
				<DeleteModal
					modalId={"slider_entry_modal_delete"}
					title={"Order Entry"}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={sliderDieCastingEntryField}
					uri={`/order/entry`}
				/>
			</Suspense>
		</div>
	);
}
