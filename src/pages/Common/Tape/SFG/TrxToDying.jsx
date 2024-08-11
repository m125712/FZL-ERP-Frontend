import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import {
	useFetch,
	useFetchForRhfReset,
	useFetchFunc,
	useRHF,
	useUpdateFunc,
} from "@/hooks";
import { FormField, Input, JoinInput, ReactSelect } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { Need } from "@/util/Need";
import {
	TAPE_STOCK_TRX_TO_DYING_NULL,
	TAPE_STOCK_TRX_TO_DYING_SCHEMA,
} from "@util/Schema";
import { useEffect, useState } from "react";

export default function Index({
	modalId = "",
	setTapeProd,
	updateTapeProd = {
		id: null,
		name: null,
		quantity: null,
		item_name: null,
		zipper_number: null,
		type: null,
	},
	setUpdateTapeProd,
}) {
	const [orderID, setOrderID] = useState(null);
	const [orderInfo, setOrderInfo] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (orderID) {
			useFetchFunc(
				`/order/description/from/${orderID}`,
				setOrderInfo,
				setLoading,
				setError
			);
		}
	}, [orderID]);

	const getMaxQuantity = () => {
		if (orderInfo === null) return 0;
		let need =
			Need({
				item: updateTapeProd?.item_name,
				stopper_type: orderInfo[0]?.stopper_type_name,
				zipper_number: updateTapeProd?.zipper_number,
				end_type: orderInfo[0]?.end_type_name,
				size: parseFloat(orderInfo[0]?.size),
				pcs: orderInfo[0]?.quantity,
			}) - orderInfo[0]?.given_tape;
		return need == null || undefined ? 0 : need.toFixed(3);
	};

	const { user } = useAuth();
	const schema = {
		...TAPE_STOCK_TRX_TO_DYING_SCHEMA,
		// trx_quantity: NUMBER_DOUBLE_REQUIRED.moreThan(0).max(
		// 	getMaxQuantity() < updateTapeProd?.quantity
		// 		? getMaxQuantity()
		// 		: updateTapeProd?.quantity
		// ),
	};

	const { register, handleSubmit, control, Controller, errors, reset } =
		useRHF(schema, TAPE_STOCK_TRX_TO_DYING_NULL);

	useFetchForRhfReset(
		`/tape-or-coil-stock/${updateTapeProd?.id}`,
		updateTapeProd?.id,
		reset
	);

	const { value: sfg } = useFetch(
		`/sfg/value/label/by/${updateTapeProd?.type}/${updateTapeProd?.zipper_number}`,
		[updateTapeProd?.type, updateTapeProd?.zipper_number]
	);

	const onClose = () => {
		setUpdateTapeProd((prev) => ({
			...prev,
			id: null,
			type: null,
			quantity: null,
			zipper_number: null,
			type_of_zipper: null,
			order_entry_id: null,
		}));
		reset(TAPE_STOCK_TRX_TO_DYING_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		if (data?.trx_quantity > updateTapeProd?.quantity) {
			return alert("Quantity can't be more than stock");
		}
		// order_entry_id, trx_from, trx_to, quantity, issued_by;
		const quantity = updateTapeProd?.quantity - data?.trx_quantity;

		const updatedData = {
			...data,
			trx_from: "tape_making",
			trx_to: "dying_and_iron_stock",
			type: updateTapeProd?.type,
			quantity: updateTapeProd?.quantity - data?.trx_quantity,
			zipper_number: updateTapeProd?.zipper_number,
			type_of_zipper: updateTapeProd?.type_of_zipper,
			issued_by: user?.id,
			name: updateTapeProd?.name,
			issued_by_name: user?.name,
			quantity,
			created_at: GetDateTime(),
		};

		await useUpdateFunc({
			uri: `/sfg/trx`,
			itemId: updateTapeProd.id,
			data: data,
			updatedData: updatedData,
			setItems: setTapeProd,
			onClose: onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={updateTapeProd?.id !== null && "Tape to Dying"}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<FormField
				label="order_entry_id"
				title="Order Entry ID"
				errors={errors}
			>
				<Controller
					name={"order_entry_id"}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder="Select Order Entry ID"
								options={sfg}
								value={sfg?.find(
									(item) => item.value == updateTapeProd?.id
								)}
								onChange={(e) => {
									onChange(parseInt(e.value));
									setOrderID(parseInt(e.value));
								}}
								// isDisabled={updateTapeProd?.id !== null}
							/>
						);
					}}
				/>
			</FormField>
			<JoinInput
				label="trx_quantity"
				unit="KG"
				sub_label={`Maximum For this Order: ${getMaxQuantity()}`}
				placeholder={`Max: ${
					getMaxQuantity() < updateTapeProd?.quantity
						? getMaxQuantity()
						: updateTapeProd?.quantity
				}`}
				{...{ register, errors }}
			/>
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
