import { DeleteModal } from "@/components/Modal";
import {
	useFetch,
	useFetchForRhfResetForOrder,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from "@/hooks";
import {
	ActionButtons,
	DynamicField,
	FormField,
	Input,
	ReactSelect,
} from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { useAuth } from "@context/auth";
import {
	THREAD_ORDER_INFO_ENTRY_NULL,
	THREAD_ORDER_INFO_ENTRY_SCHEMA,
} from "@util/Schema";
import { customAlphabet } from "nanoid";
import { Suspense, useCallback, useEffect, useState } from "react";
import { HotKeys, configure } from "react-hotkeys";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Header from "./Header";

const alphabet =
	"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 10);

export default function Index() {
	const { id, thread_order_info_uuid } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();
	const isUpdate = thread_order_info_uuid !== undefined || id !== undefined;
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
	} = useRHF(THREAD_ORDER_INFO_ENTRY_SCHEMA, THREAD_ORDER_INFO_ENTRY_NULL);

	useEffect(() => {
		id !== undefined
			? (document.title = `Thread Shade Recipe: Update ${id}`)
			: (document.title = "Thread Shade Recipe: Entry");
	}, []);

	const { value: countLength } = useFetch(`/thread/count-length/value/label`);
	const { value: shadeRecipe } = useFetch(`/thread/shade-recipe/value/label`);

	if (isUpdate)
		useFetchForRhfResetForOrder(
			`/thread/order-info-entry/by/thread_order_info_uuid/${thread_order_info_uuid}`,
			thread_order_info_uuid,
			reset
		);

	// thread_order_info_entry
	const {
		fields: threadOrderInfoEntryField,
		append: threadOrderInfoEntryAppend,
		remove: threadOrderInfoEntryRemove,
	} = useFieldArray({
		control,
		name: "thread_order_info_entry",
	});

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const handleThreadOrderInfoEntryRemove = (index) => {
		if (getValues(`thread_order_info_entry[${index}].id`) !== undefined) {
			setDeleteItem({
				itemId: getValues(`thread_order_info_entry[${index}].id`),
				itemName: getValues(`thread_order_info_entry[${index}].id`),
			});
			window["thread_order_info_entry_delete"].showModal();
		}
		threadOrderInfoEntryRemove(index);
	};

	const handleThreadOrderInfoEntryAppend = () => {
		threadOrderInfoEntryAppend({
			thread_order_info_uuid: null,
			lab_ref: "",
			po: "",
			shade_id: null,
			style: "",
			color: "",
			count_length_id: null,
			type: "",
			quantity: null,
			company_price: 0,
			party_price: 0,
			swatch_status: "",
			swatch_approval_date: "",
			remarks: "",
		});
	};
	const onClose = () => reset(THREAD_ORDER_INFO_ENTRY_NULL);

	// Submit
	const onSubmit = async (data) => {
		// Update
		if (isUpdate) {
			// order description
			const thread_order_info_data = {
				...data,
				is_sample: isSample ? 1 : 0,
				is_bill: isBill ? 1 : 0,
				updated_at: GetDateTime(),
			};

			let thread_order_info_promise = await useUpdateFunc({
				uri: `/thread/order-info/${data?.id}/${thread_order_info_uuid}`,
				itemId: data.id,
				data: data,
				updatedData: thread_order_info_data,
				onClose: onClose,
			}).catch((err) => console.error(`Error updating data: ${err}`));

			// order entry
			let thread_order_info_entry_promises =
				data.thread_order_info_entry.map(async (item) => {
					if (item.id === undefined) {
						item.thread_order_info_uuid = thread_order_info_uuid;
						item.created_at = GetDateTime();
						return await usePostFunc({
							uri: "/thread/order-entry",
							data: item,
						}).catch((err) => console.error(`Error: ${err}`));
					}
					const updatedData = {
						...item,
						updated_at: GetDateTime(),
					};

					return await useUpdateFunc({
						// replace style brackets, /, #, & with space
						uri: `/thread/order-entry/${item?.id}/${item?.shade_id}`,
						itemId: item.id,
						data: item,
						updatedData: updatedData,
						onClose: onClose,
					}).catch((err) =>
						console.error(`Error updating data: ${err}`)
					);
				});

			try {
				await Promise.all([
					thread_order_info_promise,
					...thread_order_info_entry_promises,
				])
					.then(() =>
						reset(Object.assign({}, THREAD_ORDER_INFO_ENTRY_NULL))
					)
					.then(() => navigate(`/thread/order-info/details/${id}`));
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}

			return;
		}

		// Add
		const new_thread_order_info_uuid = nanoid();
		const created_at = GetDateTime();

		const order_info = {
			...data,
			is_sample: isSample ? 1 : 0,
			is_bill: isBill ? 1 : 0,
			thread_order_info_uuid: new_thread_order_info_uuid,
			created_at,
			issued_by: user.id,
		};
		const thread_order_info_promise = await usePostFunc({
			uri: "/thread/order-info",
			data: order_info,
		});

		const thread_order_info_entry = [...data.thread_order_info_entry].map(
			(item) => ({
				...item,
				thread_order_info_uuid: new_thread_order_info_uuid,
				created_at,
			})
		);
		let thread_order_info_entry_promises = [
			...thread_order_info_entry.map((item) =>
				usePostFunc({
					uri: "/thread/order-entry",
					data: item,
				})
			),
		];

		await Promise.all([
			thread_order_info_promise,
			...thread_order_info_entry_promises,
		])
			.then(() => reset(Object.assign({}, THREAD_ORDER_INFO_ENTRY_NULL)))
			.then(() => navigate(`/thread/order-info`))
			.catch((err) => console.log(err));
	};

	// Check if id is valid
	if (getValues("quantity") === null) return <Navigate to="/not-found" />;

	const handelDuplicateDynamicField = useCallback(
		(index) => {
			const item = getValues(`thread_order_info_entry[${index}]`);
			threadOrderInfoEntryAppend({ ...item, id: undefined });
		},
		[getValues, threadOrderInfoEntryAppend]
	);

	const handleEnter = (event) => {
		event.preventDefault();
		if (Object.keys(errors).length > 0) return;
	};

	const keyMap = {
		NEW_ROW: "alt+n",
		COPY_LAST_ROW: "alt+c",
		ENTER: "enter",
	};

	const handlers = {
		NEW_ROW: handleThreadOrderInfoEntryAppend,
		COPY_LAST_ROW: () =>
			handelDuplicateDynamicField(threadOrderInfoEntryField.length - 1),
		ENTER: (event) => handleEnter(event),
	};

	configure({
		ignoreTags: ["input", "select", "textarea"],
		ignoreEventsCondition: function () {},
	});

	const rowClass =
		"group whitespace-nowrap text-left text-sm font-normal tracking-wide";

	return (
		<div className="container mx-auto mt-2 px-2 pb-2 md:px-4">
			<HotKeys {...{ keyMap, handlers }}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					noValidate
					className="flex flex-col gap-4"
				>
					<Header
						{...{
							register,
							errors,
							control,
							getValues,
							Controller,
							watch,
						}}
					/>
					<DynamicField
						title="Details"
						handelAppend={handleThreadOrderInfoEntryAppend}
						tableHead={[
							"Lab Ref",
							"PO",
							"Shade",
							"Style",
							"Color",
							"Count Length",
							"Type",
							"Quantity",
							"Price (USD) (Com/Party)",
							"Swatch Status",
							// "Remarks",
							"Action",
						].map((item) => (
							<th
								key={item}
								scope="col"
								className="group cursor-pointer select-none whitespace-nowrap bg-secondary py-2 text-left font-semibold tracking-wide text-secondary-content transition duration-300 first:pl-2"
							>
								{item}
							</th>
						))}
					>
						{threadOrderInfoEntryField.map((item, index) => (
							<tr key={item.id}>
								<td className={`pl-1 ${rowClass}`}>
									<Input
										title="lab_ref"
										label={`thread_order_info_entry[${index}].lab_ref`}
										is_title_needed="false"
										dynamicerror={
											errors?.thread_order_info_entry?.[
												index
											]?.lab_ref
										}
										register={register}
									/>
								</td>
								<td className={rowClass}>
									<Input
										title="po"
										label={`thread_order_info_entry[${index}].po`}
										is_title_needed="false"
										dynamicerror={
											errors?.thread_order_info_entry?.[
												index
											]?.po
										}
										register={register}
									/>
								</td>
								<td className={rowClass}>
									<FormField
										label={`thread_order_info_entry[${index}].shade_id`}
										title="Shade"
										errors={errors}
										is_title_needed="false"
									>
										<Controller
											name={`thread_order_info_entry[${index}].shade_id`}
											control={control}
											render={({
												field: { onChange },
											}) => {
												return (
													<ReactSelect
														placeholder="Select Shade"
														options={shadeRecipe}
														value={shadeRecipe?.find(
															(item) =>
																item.value ==
																getValues(
																	`thread_order_info_entry[${index}].shade_id`
																)
														)}
														onChange={(e) => {
															onChange(
																parseInt(
																	e.value
																)
															);
														}}
														isDisabled={
															thread_order_info_uuid !==
															undefined
														}
														menuPortalTarget={
															document.body
														}
													/>
												);
											}}
										/>
									</FormField>
								</td>
								<td className={rowClass}>
									<Input
										title="style"
										label={`thread_order_info_entry[${index}].style`}
										is_title_needed="false"
										dynamicerror={
											errors?.thread_order_info_entry?.[
												index
											]?.style
										}
										register={register}
									/>
								</td>
								<td className={rowClass}>
									<Input
										title="color"
										label={`thread_order_info_entry[${index}].color`}
										is_title_needed="false"
										dynamicerror={
											errors?.thread_order_info_entry?.[
												index
											]?.color
										}
										register={register}
									/>
								</td>
								<td className={rowClass}>
									<FormField
										label={`thread_order_info_entry[${index}].count_length_id`}
										title="Count Length"
										errors={errors}
										is_title_needed="false"
									>
										<Controller
											name={`thread_order_info_entry[${index}].count_length_id`}
											control={control}
											render={({
												field: { onChange },
											}) => {
												return (
													<ReactSelect
														placeholder="Select Count Length"
														options={countLength}
														value={countLength?.find(
															(item) =>
																item.value ==
																getValues(
																	`thread_order_info_entry[${index}].count_length_id`
																)
														)}
														onChange={(e) => {
															onChange(
																parseInt(
																	e.value
																)
															);
														}}
														isDisabled={
															thread_order_info_uuid !==
															undefined
														}
														menuPortalTarget={
															document.body
														}
													/>
												);
											}}
										/>
									</FormField>
								</td>
								<td className={rowClass}>
									<Input
										title="type"
										label={`thread_order_info_entry[${index}].type`}
										is_title_needed="false"
										dynamicerror={
											errors?.thread_order_info_entry?.[
												index
											]?.type
										}
										register={register}
									/>
								</td>
								<td className={rowClass}>
									<Input
										title="quantity"
										label={`thread_order_info_entry[${index}].quantity`}
										is_title_needed="false"
										dynamicerror={
											errors?.thread_order_info_entry?.[
												index
											]?.quantity
										}
										register={register}
									/>
								</td>
								<td className={rowClass}>
									<div className="flex">
										<Input
											label={`thread_order_info_entry[${index}].company_price`}
											is_title_needed="false"
											dynamicerror={
												errors
													?.thread_order_info_entry?.[
													index
												]?.company_price
											}
											register={register}
										/>
										<Input
											label={`thread_order_info_entry[${index}].party_price`}
											is_title_needed="false"
											dynamicerror={
												errors
													?.thread_order_info_entry?.[
													index
												]?.party_price
											}
											register={register}
										/>
									</div>
								</td>
								<td className={rowClass}>
									<Input
										title="swatch_status"
										label={`thread_order_info_entry[${index}].swatch_status`}
										is_title_needed="false"
										dynamicerror={
											errors?.thread_order_info_entry?.[
												index
											]?.swatch_status
										}
										register={register}
									/>
								</td>
								{/* <td className={`w-40 ${rowClass}`}>
									<Input
										title="remarks"
										label={`thread_order_info_entry[${index}].remarks`}
										is_title_needed="false"
										dynamicerror={
											errors?.thread_order_info_entry?.[
												index
											]?.remarks
										}
										register={register}
									/>
								</td> */}
								<td
									className={`w-16 ${rowClass} border-l-4 border-l-primary`}
								>
									<ActionButtons
										duplicateClick={() =>
											handelDuplicateDynamicField(index)
										}
										removeClick={() =>
											handleThreadOrderInfoEntryRemove(
												index
											)
										}
										showRemoveButton={
											threadOrderInfoEntryField.length > 1
										}
									/>
								</td>
							</tr>
						))}
					</DynamicField>
					<div className="modal-action">
						<button
							type="submit"
							className="text-md btn btn-primary btn-block"
						>
							Save
						</button>
					</div>
				</form>
			</HotKeys>
			<Suspense>
				<DeleteModal
					modalId={"thread_order_info_entry_delete"}
					title={"Thread Shade Recipe Entry"}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={threadOrderInfoEntryField}
					uri={`/thread/order-info`}
				/>
			</Suspense>
		</div>
	);
}
