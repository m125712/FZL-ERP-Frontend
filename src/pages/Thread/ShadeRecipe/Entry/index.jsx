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
	JoinInput,
	ReactSelect,
} from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { useAuth } from "@context/auth";
import {
	THREAD_SHADE_RECIPE_NULL,
	THREAD_SHADE_RECIPE_SCHEMA,
} from "@util/Schema";
import { Suspense, useCallback, useEffect, useState } from "react";
import { HotKeys, configure } from "react-hotkeys";
import { Navigate, useNavigate, useParams } from "react-router-dom";

const alphabet =
	"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 10);

import { customAlphabet } from "nanoid";
import Header from "./Header";

export default function Index() {
	const { id, thread_shade_recipe_uuid } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();
	const isUpdate = thread_shade_recipe_uuid !== undefined && id !== undefined;
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
	} = useRHF(THREAD_SHADE_RECIPE_SCHEMA, THREAD_SHADE_RECIPE_NULL);

	const [unit, setUnit] = useState({});

	useEffect(() => {
		id !== undefined
			? (document.title = `Thread Shade Recipe: Update ${id}`)
			: (document.title = "Thread Shade Recipe: Entry");
	}, []);

	const { value: material } = useFetch(
		`/material/section/value/label/unit/quantity/Dyeing`
	);

	if (isUpdate)
		useFetchForRhfResetForOrder(
			`/thread/shade-recipe/by/thread_shade_recipe_uuid/${thread_shade_recipe_uuid}`,
			thread_shade_recipe_uuid,
			reset
		);

	// thread_shade_recipe_entry
	const {
		fields: threadShadeRecipeEntryField,
		append: threadShadeRecipeEntryAppend,
		remove: threadShadeRecipeEntryRemove,
	} = useFieldArray({
		control,
		name: "thread_shade_recipe_entry",
	});

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const handleThreadShadeRecipeEntryRemove = (index) => {
		if (getValues(`thread_shade_recipe_entry[${index}].id`) !== undefined) {
			setDeleteItem({
				itemId: getValues(`thread_shade_recipe_entry[${index}].id`),
				itemName: getValues(`thread_shade_recipe_entry[${index}].id`),
			});
			window["thread_shade_recipe_entry_delete"].showModal();
		}
		threadShadeRecipeEntryRemove(index);
	};

	const handleThreadShadeRecipeEntryAppend = () => {
		threadShadeRecipeEntryAppend({
			material_id: "",
			quantity: "",
			remarks: "",
		});
	};
	const onClose = () => reset(THREAD_SHADE_RECIPE_NULL);

	// Submit
	const onSubmit = async (data) => {
		// Update
		if (isUpdate) {
			// order description
			const thread_shade_recipe_data = {
				...data,
				updated_at: GetDateTime(),
			};

			let order_description_promise = await useUpdateFunc({
				uri: `/thread/shade-recipe/${data?.id}/${data?.name.replace(/[#&/]/g, "")}`,
				itemId: data.id,
				data: data,
				updatedData: thread_shade_recipe_data,
				onClose: onClose,
			}).catch((err) => console.error(`Error updating data: ${err}`));

			// order entry
			let thread_shade_recipe_entry_promises =
				data.thread_shade_recipe_entry.map(async (item) => {
					if (item.id === undefined) {
						item.thread_shade_recipe_uuid =
							thread_shade_recipe_uuid;
						item.created_at = GetDateTime();
						return await usePostFunc({
							uri: "/thread/shade-recipe-entry",
							data: item,
						}).catch((err) => console.error(`Error: ${err}`));
					}
					const updatedData = {
						...item,
						updated_at: GetDateTime(),
					};

					return await useUpdateFunc({
						// replace style brackets, /, #, & with space
						uri: `/thread/shade-recipe-entry/${item?.id}/${item?.material_id}`,
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
					order_description_promise,
					...thread_shade_recipe_entry_promises,
				])
					.then(() =>
						reset(Object.assign({}, THREAD_SHADE_RECIPE_NULL))
					)
					.then(() => navigate(`/thread/shade-recipe/details`));
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}

			return;
		}

		// Add
		const new_thread_shade_recipe_uuid = nanoid();
		const created_at = GetDateTime();

		const order_description = {
			...data,
			id,
			thread_shade_recipe_uuid: new_thread_shade_recipe_uuid,
			created_at,
			issued_by: user.id,
		};
		const order_description_promise = await usePostFunc({
			uri: "/thread/shade-recipe",
			data: order_description,
		});

		const thread_shade_recipe_entry = [
			...data.thread_shade_recipe_entry,
		].map((item) => ({
			...item,
			thread_shade_recipe_uuid: new_thread_shade_recipe_uuid,
			created_at,
		}));
		let thread_shade_recipe_entry_promises = [
			...thread_shade_recipe_entry.map((item) =>
				usePostFunc({
					uri: "/thread/shade-recipe-entry",
					data: item,
				})
			),
		];

		await Promise.all([
			order_description_promise,
			...thread_shade_recipe_entry_promises,
		])
			.then(() => reset(Object.assign({}, THREAD_SHADE_RECIPE_NULL)))
			.then(() => navigate(`/order/details/${id}`))
			.catch((err) => console.error(err));
	};

	// Check if id is valid
	if (getValues("quantity") === null) return <Navigate to="/not-found" />;

	const handelDuplicateDynamicField = useCallback(
		(index) => {
			const item = getValues(`thread_shade_recipe_entry[${index}]`);
			threadShadeRecipeEntryAppend({ ...item, id: undefined });
		},
		[getValues, threadShadeRecipeEntryAppend]
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
		NEW_ROW: handleThreadShadeRecipeEntryAppend,
		COPY_LAST_ROW: () =>
			handelDuplicateDynamicField(threadShadeRecipeEntryField.length - 1),
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
						handelAppend={handleThreadShadeRecipeEntryAppend}
						tableHead={[
							"Material",
							"Quantity",
							"Remarks",
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
						{threadShadeRecipeEntryField.map((item, index) => (
							<tr key={item.id}>
								<td className={`pl-1 ${rowClass}`}>
									<FormField
										label={`thread_shade_recipe_entry[${index}].material_id`}
										title="Material"
										is_title_needed="false"
										errors={errors}
									>
										<Controller
											name={`thread_shade_recipe_entry[${index}].material_id`}
											control={control}
											render={({
												field: { onChange },
											}) => {
												return (
													<ReactSelect
														placeholder="Select Material"
														options={material}
														value={material?.find(
															(inItem) =>
																inItem.value ==
																getValues(
																	`thread_shade_recipe_entry[${index}].material_id`
																)
														)}
														onChange={(e) => {
															onChange(
																parseInt(
																	e.value
																)
															);
															setUnit({
																...unit,
																[index]: e.unit,
															});
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
								<td className={rowClass}>
									<JoinInput
										title="quantity"
										label={`thread_shade_recipe_entry[${index}].quantity`}
										is_title_needed="false"
										unit={unit[index]}
										dynamicerror={
											errors?.thread_shade_recipe_entry?.[
												index
											]?.quantity
										}
										register={register}
									/>
								</td>
								<td className={`w-40 ${rowClass}`}>
									<Input
										title="remarks"
										label={`thread_shade_recipe_entry[${index}].remarks`}
										is_title_needed="false"
										dynamicerror={
											errors?.thread_shade_recipe_entry?.[
												index
											]?.remarks
										}
										register={register}
									/>
								</td>
								<td
									className={`w-16 ${rowClass} border-l-4 border-l-primary`}
								>
									<ActionButtons
										duplicateClick={() =>
											handelDuplicateDynamicField(index)
										}
										removeClick={() =>
											handleThreadShadeRecipeEntryRemove(
												index
											)
										}
										showRemoveButton={
											threadShadeRecipeEntryField.length >
											1
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
					modalId={"thread_shade_recipe_entry_delete"}
					title={"Thread Shade Recipe Entry"}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={threadShadeRecipeEntryField}
					uri={`/order/entry`}
				/>
			</Suspense>
		</div>
	);
}
