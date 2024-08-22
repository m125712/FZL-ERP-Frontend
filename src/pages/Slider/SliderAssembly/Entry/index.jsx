import { DeleteModal } from "@/components/Modal";
import {
	useAccess,
	useFetch,
	useFetchForRhfResetForOrder,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from "@/hooks";
import { NotFound } from "@/pages/Public/NoEntry";
import {
	DynamicField,
	FormField,
	Input,
	JoinInput,
	ReactSelect,
	RemoveButton,
} from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import nanoid from '@/lib/nanoid';
import { useAuth } from "@context/auth";
import {
	SLIDER_SLIDER_ASSEMBLY_NULL,
	SLIDER_SLIDER_ASSEMBLY_SCHEMA,
} from "@util/Schema";
import { Suspense, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// UPDATE IS NOT WORKING
export default function Index() {
	const r_saveBtn = useRef();
	const { slider_slider_assembly_uuid } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		slider_slider_assembly_uuid !== undefined
			? (document.title = "Update Assembly Entry")
			: (document.title = "Assembly Entry");
	}, []);

	const haveAccess = useAccess("slider__assembly_entry");

	const haveAccessUpdate = useAccess("slider__assembly_update");

	if (!haveAccess.includes("create")) {
		return <NotFound />;
	} else if (!haveAccessUpdate.includes("update")) {
		return <NotFound />;
	}

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
	} = useRHF(SLIDER_SLIDER_ASSEMBLY_SCHEMA, SLIDER_SLIDER_ASSEMBLY_NULL);

	useFetchForRhfResetForOrder(
		`/slider/slider-assembly/details/by/${slider_slider_assembly_uuid}/array`,
		slider_slider_assembly_uuid,
		reset
	);

	const { value: slider_item_name } = useFetch(
		"/slider-item-library/value/label/slider_assembly"
	);

	const {
		fields: sliderSliderAssemblyEntryField,
		append: sliderSliderAssemblyAppend,
		remove: sliderSliderAssemblyRemove,
	} = useFieldArray({
		control,
		name: "slider_slider_assembly_details",
	});

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const handleSliderSliderAssemblyRemove = (index) => {
		if (getValues(`${index}.id`) !== undefined) {
			setDeleteItem({
				itemId: getValues(
					`slider_slider_assembly_details[${index}].id`
				),
				itemName: getValues(
					`slider_slider_assembly_details[${index}].id`
				),
			});
			window["order_entry_delete"].showModal();
		}
		sliderSliderAssemblyRemove(index);
	};

	const handleSliderSliderAssemblyAppend = () => {
		sliderSliderAssemblyAppend({
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
	const onClose = () => reset(SLIDER_SLIDER_ASSEMBLY_NULL);
	const isUpdate = slider_slider_assembly_uuid !== undefined;
	// Submit
	const onSubmit = async (data) => {
		// console.log(data, "data");

		const issued_by = user?.id;

		var slider_slider_assembly_uuid_old_or_new = isUpdate
			? slider_slider_assembly_uuid
			: nanoid();
		const { slider_slider_assembly_details } = data;
		const slider_die_casting = slider_slider_assembly_details.map(
			(item) => {
				return {
					...item,
					slider_slider_assembly_uuid:
						slider_slider_assembly_uuid_old_or_new,
					issued_by: issued_by,
				};
			}
		);
		// console.log(slider_die_casting, "slider_die_casting");

		if (isUpdate) {
			let promises = slider_die_casting.map(async (item) => {
				if (item.id === undefined) {
					item.slider_slider_assembly_uuid =
						slider_slider_assembly_uuid_old_or_new;
					item.created_at = GetDateTime();
					return await usePostFunc({
						uri: "/slider/slider-assembly/entry",
						data: item,
					}).catch((err) => console.error(`Error: ${err}`));
				}

				const updatedData = {
					...item,
					updated_at: GetDateTime(),
				};
				return await useUpdateFunc({
					uri: `/slider/slider-assembly/entry/${item?.id}/${updatedData?.slider_slider_assembly_uuid}`,
					itemId: item.id,
					data: item,
					updatedData: updatedData,
					onClose: onClose,
				}).catch((err) => console.error(`Error updating data: ${err}`));
			});

			try {
				await Promise.all([...promises]).then(() =>
					reset(Object.assign({}, SLIDER_SLIDER_ASSEMBLY_NULL))
				);
				navigate(`/slider/slider-assembly/production`); // details changed to production
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}

			return;
		}

		let promise = [
			...slider_die_casting.map((item) =>
				usePostFunc({
					uri: "/slider/slider-assembly/entry",
					data: item,
				})
			),
		];

		Promise.all(promise)
			.then(() => {
				reset(SLIDER_SLIDER_ASSEMBLY_NULL);
				navigate(`/slider/slider-assembly/production`); // details changed to production
			})
			.catch((err) => console.log(err));
	};

	return (
		<div className="container mx-auto mt-4 px-2 pb-2 md:px-4">
			<form
				onSubmit={handleSubmit(onSubmit)}
				noValidate
				className="flex flex-col gap-4"
			>
				<DynamicField
					title={
						slider_slider_assembly_uuid == null
							? `Entry Details`
							: "Update Details"
					}
					handelAppend={handleSliderSliderAssemblyAppend}
					tableHead={[
						"Order Number",
						"Party",
						"Item Name",
						"Quantity",
						"Weight",
						"Remarks",
					].map((item) => (
						<th key={item} scope="col">
							{item}
						</th>
					))}
				>
					{sliderSliderAssemblyEntryField.map((item, index) => (
						<tr key={item.id}>
							<td>
								<Input
									label={`slider_slider_assembly_details[${index}].order_number`}
									defaultValue={item.order_number}
									is_title_needed="false"
									register={register}
									dynamicerror={
										errors?.slider_slider_assembly_details
											?.order_number
									}
								/>
							</td>
							<td>
								<Input
									label={`slider_slider_assembly_details[${index}].party`}
									defaultValue={item.party}
									is_title_needed="false"
									register={register}
									dynamicerror={
										errors?.slider_slider_assembly_details
											?.party
									}
								/>
							</td>
							<td>
								<FormField
									label={`slider_slider_assembly_details[${index}].slider_item_id`}
									is_title_needed="false"
									register={register}
									dynamicerror={
										errors?.slider_slider_assembly_details
											?.slider_item_id
									}
								>
									<Controller
										name={`slider_slider_assembly_details[${index}].slider_item_id`}
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
																`slider_slider_assembly_details[${index}].slider_item_id`
															)
													)}
													onChange={(e) => {
														onChange(e.value);
													}}
												/>
											);
										}}
									/>
								</FormField>
							</td>
							<td>
								<JoinInput
									label={`slider_slider_assembly_details[${index}].production_quantity`}
									defaultValue={item.production_quantity}
									is_title_needed="false"
									unit="PCS"
									register={register}
									dynamicerror={
										errors?.slider_slider_assembly_details
											?.production_quantity
									}
								/>
							</td>
							<td>
								<JoinInput
									label={`slider_slider_assembly_details[${index}].production_weight`}
									defaultValue={item.production_weight}
									is_title_needed="false"
									unit="KG"
									register={register}
									dynamicerror={
										errors?.slider_slider_assembly_details
											?.production_weight
									}
								/>
							</td>
							<td>
								<Input
									label={`slider_slider_assembly_details[${index}].remarks`}
									defaultValue={item.remarks}
									is_title_needed="false"
									register={register}
									dynamicerror={
										errors?.slider_slider_assembly_details
											?.remarks
									}
								/>
							</td>
							<RemoveButton
								onClick={() =>
									handleSliderSliderAssemblyRemove(index)
								}
								showButton={
									sliderSliderAssemblyEntryField.length > 1
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
					modalId={"order_entry_delete"}
					title={"Order Entry"}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={sliderSliderAssemblyEntryField}
					uri={`/order/entry`}
				/>
			</Suspense>
		</div>
	);
}
