import { DeleteModal } from "@/components/Modal";
import {
	useDeleteFunc,
	useFetch,
	useFetchForRhfResetForOrder,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from "@/hooks";
import { DynamicDeliveryField, Input } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { useAuth } from "@context/auth";
import { CHALLAN_NULL, CHALLAN_SCHEMA } from "@util/Schema";
import { customAlphabet } from "nanoid";
import { Suspense, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import Header from "./Header";

const alphabet =
	"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 10);

// UPDATE IS NOT WORKING
export default function Index() {
	const { challan_number, challan_uuid } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();
	const { value: order_info_id } = useFetch("/order/info/value/label");

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
	} = useRHF(CHALLAN_SCHEMA, CHALLAN_NULL);

	// challan_entry
	const { fields: challanEntryField } = useFieldArray({
		control,
		name: "challan_entry",
	});

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const onClose = () => reset(CHALLAN_NULL);
	const isUpdate = challan_uuid !== undefined;

	isUpdate
		? useFetchForRhfResetForOrder(
				`/challan/details/update/by/${challan_uuid}`,
				challan_uuid,
				reset
			)
		: useFetchForRhfResetForOrder(
				`/challan/details/by/order-info-id/${watch("order_info_id")}`,
				watch("order_info_id"),
				reset
			);

	useEffect(() => {
		document.title = isUpdate
			? `Delivery: Challan (U): ${challan_number}`
			: "Delivery: Challan Entry";
	}, [watch("order_info_id")]);

	// Submit
	const onSubmit = async (data) => {
		// Update
		if (isUpdate) {
			// challan
			const challan_data = {
				...data,
				updated_at: GetDateTime(),
			};

			let challan_promise = useUpdateFunc({
				uri: `/challan/${data?.id}/${challan_number}`,
				itemId: data.id,
				data: data,
				updatedData: challan_data,
				onClose: onClose,
			}).catch((err) => console.error(`Error updating data: ${err}`));

			// challan entry
			let challan_entry_promises = data.challan_entry
				.filter((item) => item.delivery_quantity > 0)
				.map(async (item) => {
					// Add item
					if (item.id === null) {
						const updateData = {
							...item,
							challan_uuid,
							created_at: GetDateTime(),
						};

						return await usePostFunc({
							uri: "/challan-entry",
							data: updateData,
						}).catch((err) => console.error(`Error: ${err}`));
					}

					// Update item
					if (item.id) {
						const updatedData = {
							...item,
							updated_at: GetDateTime(),
							remarks: null,
						};

						return await useUpdateFunc({
							uri: `/challan-entry/${item?.id}/${challan_uuid}`,
							itemId: item.id,
							data: item,
							updatedData: updatedData,
							onClose: onClose,
						}).catch((err) =>
							console.error(`Error Updating: ${err}`)
						);
					}
					return null;
				});

			// let challan_entry_delete_promises = data.challan_entry
			// 	.filter((item) => item.id && item.delivery_quantity === 0)
			// 	.map(async (item) => {
			// 		return await useDeleteFunc({
			// 			uri: `${uri}/${item?.id}/${item?.challan_uuid}`,
			// 			itemId: item?.id,
			// 			onClose: onClose,
			// 		}).catch((err) => console.error(`Error: ${err}`));
			// 	});

			try {
				await Promise.all([challan_promise, ...challan_entry_promises])
					.then(() => reset(Object.assign({}, CHALLAN_NULL)))
					.then(() =>
						navigate(`/delivery/challan/details/${challan_number}`)
					);
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}

			return;
		}

		// Add
		var new_challan_uuid = nanoid();
		const created_at = GetDateTime();

		const challan = {
			...data,
			challan_uuid: new_challan_uuid,
			created_at,
			issued_by: user.id,
		};

		const challan_entry = [...data.challan_entry]
			.filter((item) => item.delivery_quantity > 0)
			.map((item) => ({
				...item,
				challan_uuid: new_challan_uuid,
				created_at,
			}));

		if (challan_entry.length === 0) {
			alert("Must Not be 0");
		} else {
			await usePostFunc({
				uri: "/challan",
				data: challan,
			});

			let promises = [
				...challan_entry.map((item) =>
					usePostFunc({
						uri: "/challan-entry",
						data: item,
					})
				),
			];
			await Promise.all(promises)
				.then(() => reset(Object.assign({}, CHALLAN_NULL)))
				.then(() => navigate(`/delivery/challan`))
				.catch((err) => console.log(err));
		}
	};

	// Check if order_info_id is valid
	if (getValues("quantity") === null) return <Navigate to="/not-found" />;
	const rowClass =
		"group px-3 py-2 whitespace-nowrap text-left text-sm font-normal tracking-wide";

	const isDisabled = (index) => {
		const getVal = (name) => getValues(`challan_entry[${index}].${name}`);

		const hasReceived = getValues("receive_status") === 1;
		const hasBalance = getVal("balance_quantity") > 0;
		const hasStock = Number(getVal("warehouse")) > 0;

		if (getVal("delivery_quantity") > 0) return false;

		return hasReceived || !hasBalance || !hasStock;
	};

	return (
		<div className="container mx-auto mt-4 px-2 pb-2 md:px-4">
			<form
				onSubmit={handleSubmit(onSubmit)}
				noValidate
				className="flex flex-col gap-4"
			>
				<Header
					{...{
						order_info_id,
						register,
						errors,
						control,
						getValues,
						Controller,
						watch,
					}}
				/>
				<DynamicDeliveryField
					title="Details"
					tableHead={[
						"Item Description",
						"Style",
						"Color",
						"Size (CM)",
						"QTY (PCS)",
						"Warehouse",
						"Delivery QTY",
						"Total Delivered",
						"Balance QTY",
					].map((item) => (
						<th
							key={item}
							scope="col"
							className="group cursor-pointer select-none whitespace-nowrap bg-secondary px-3 py-2 text-left font-semibold tracking-wide text-secondary-content transition duration-300"
						>
							{item}
						</th>
					))}
				>
					{challanEntryField.map((item, index) => (
						<tr
							key={item.id}
							className="cursor-pointer transition-colors duration-300 ease-in even:bg-primary/10 hover:bg-primary/30 focus:bg-primary/30"
						>
							<td className={`w-32 ${rowClass}`}>
								{getValues(
									`challan_entry[${index}].item_description`
								)}
							</td>
							<td className={`w-32 ${rowClass}`}>
								{getValues(`challan_entry[${index}].style`)}
							</td>
							<td className={`w-32 ${rowClass}`}>
								{getValues(`challan_entry[${index}].color`)}
							</td>
							<td className={`${rowClass}`}>
								{getValues(`challan_entry[${index}].size`)}
							</td>
							<td className={`${rowClass}`}>
								{getValues(`challan_entry[${index}].quantity`)}
							</td>
							<td className={`${rowClass}`}>
								{getValues(`challan_entry[${index}].warehouse`)}
							</td>
							<td className={`w-32 ${rowClass}`}>
								<Input
									label={`challan_entry[${index}].delivery_quantity`}
									is_title_needed="false"
									height="h-8"
									dynamicerror={
										errors?.challan_entry?.[index]
											?.delivery_quantity
									}
									sub_label={`MAX: ${getValues(`challan_entry[${index}].warehouse`) + getValues(`challan_entry[${index}].delivery_quantity`)}`}
									disabled={isDisabled(index)}
									{...{ register, errors }}
								/>
							</td>
							<td className={`${rowClass}`}>
								{getValues(`challan_entry[${index}].delivered`)}
							</td>
							<td className={`${rowClass}`}>
								{getValues(
									`challan_entry[${index}].balance_quantity`
								)}
							</td>
						</tr>
					))}
				</DynamicDeliveryField>
				<div className="modal-action">
					<button
						type="submit"
						className="text-md btn btn-primary btn-block"
					>
						Save
					</button>
				</div>
			</form>

			<Suspense>
				<DeleteModal
					modalId="challan_entry_delete"
					title="Challan Entry"
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={challanEntryField}
					uri={`/challan/entry`}
				/>
			</Suspense>
		</div>
	);
}
