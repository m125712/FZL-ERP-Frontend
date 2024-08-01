import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import {
	useFetch,
	useFetchForRhfReset,
	useFetchFunc,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from "@/hooks";
import { FormField, Input, JoinInput, ReactSelect } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { GetData } from "@/util/Need";
import { COIL_STOCK_NULL, COIL_STOCK_SCHEMA } from "@util/Schema";
import { useEffect, useState } from "react";

export default function Index({
	modalId = "",
	setCoilProd,
	updateCoilProd = {
		id: null,
		name: null,
		quantity_in_coil: null,
		type: null,
		zipper_number: null,
	},
	setUpdateCoilProd,
}) {
	const { user } = useAuth();
	const [orderID, setOrderID] = useState(null);
	const [orderInfo, setOrderInfo] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (orderID) {
			useFetchFunc(
				`/order/description/from/${orderID}/filter/nylon`,
				setOrderInfo,
				setLoading,
				setError
			);
		}
	}, [orderID]);

	const getMaxQuantity = () => {
		if (orderInfo === null) return 0;
		let need =
			GetData({
				item: updateCoilProd?.type,
				stopper_type: orderInfo[0]?.stopper_type_name,
				zipper_number: updateCoilProd?.zipper_number,
				end_type: orderInfo[0]?.end_type_name,
				size: orderInfo[0]?.size,
				pcs: orderInfo[0]?.quantity,
			}).TAPE_NEED - orderInfo[0]?.given_tape;
		return need == null || undefined ? 0 : need.toFixed(3);
	};

	const {
		register,
		handleSubmit,
		control,
		Controller,
		errors,
		reset,
		watch,
	} = useRHF(COIL_STOCK_SCHEMA, COIL_STOCK_NULL);

	useFetchForRhfReset(
		`/tape-or-coil-stock/${updateCoilProd?.id}`,
		updateCoilProd?.id,
		reset
	);

	const { value: sfg } = useFetch(
		`/sfg/value/label/by/nylon/${updateCoilProd?.zipper_number}`,
		[updateCoilProd?.zipper_number]
	);

	const onClose = () => {
		setUpdateCoilProd((prev) => ({
			...prev,
			id: null,
			name: null,
			quantity_in_coil: null,
			type: null,
			zipper_number: null,
		}));
		reset(COIL_STOCK_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		if (data?.trx_quantity > updateCoilProd?.quantity_in_coil) {
			return alert("Quantity can't be more than stock");
		}
		const quantity_in_coil =
			updateCoilProd?.quantity_in_coil - data?.trx_quantity;
		// Update item
		const updatedData = {
			...data,
			trx_from: "coil_forming",
			trx_to: "dying_and_iron_stock",
			issued_by: user?.id,
			issued_by_name: user?.name,
			name: updateCoilProd?.name,
			quantity_in_coil,
			created_at: GetDateTime(),
		};

		await useUpdateFunc({
			uri: `/sfg/trx`,
			itemId: updateCoilProd.id,
			data: data,
			updatedData: updatedData,
			setItems: setCoilProd,
			onClose: onClose,
		});
	};

	watch();

	return (
		<AddModal
			id={modalId}
			title={updateCoilProd?.id !== null && "Transfer Coil"}
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
					name="order_entry_id"
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder="Select Order Entry ID"
								options={sfg}
								value={sfg?.find(
									(item) => item.value == updateCoilProd?.id
								)}
								onChange={(e) => {
									onChange(parseInt(e.value));
									setOrderID(parseInt(e.value));
								}}
								// isDisabled={updateCoilProd?.id !== null}
							/>
						);
					}}
				/>
			</FormField>
			<JoinInput
				label="trx_quantity"
				sub_label={`Maximum For this Order: ${getMaxQuantity()}`}
				unit="KG"
				placeholder={`Max: ${
					getMaxQuantity() < updateCoilProd?.quantity_in_coil
						? getMaxQuantity()
						: updateCoilProd?.quantity_in_coil
				}`}
				{...{ register, errors }}
			/>
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
