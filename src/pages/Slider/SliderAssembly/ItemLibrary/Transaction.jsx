import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import {
	useFetch,
	useFetchForRhfReset,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from "@/hooks";
import { FormField, Input, JoinInput, ReactSelect } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import {
	SLIDER_ITEM_TRANSACTION_NULL,
	SLIDER_ITEM_TRANSACTION_SCHEMA,
} from "@util/Schema";
import { useEffect, useState } from "react";

export default function Index({
	modalId = "",
	setItemLibrary,
	updateItemLibrary = {
		id: null,
		name: "",
		stock: null,
	},
	setUpdateItemLibrary,
}) {
	const { user } = useAuth();
	const [qty, setQty] = useState();
	const MAX_QUANTITY = Math.min(
		qty?.can_trf_quantity || 0,
		updateItemLibrary?.stock
	);
	var schema = {
		...SLIDER_ITEM_TRANSACTION_SCHEMA,
		trx_quantity: SLIDER_ITEM_TRANSACTION_SCHEMA.trx_quantity
			.moreThan(0)
			.max(MAX_QUANTITY),
	};

	const { register, handleSubmit, errors, reset, Controller, control, context } =
		useRHF(schema, SLIDER_ITEM_TRANSACTION_NULL);

	const { value: order } = useFetch(`/order/entry/value/label`);

	useFetchForRhfReset(
		`/item-library/${updateItemLibrary?.id}`,
		updateItemLibrary?.id,
		reset
	);

	const onClose = () => {
		setUpdateItemLibrary((prev) => ({
			...prev,
			id: null,
			name: "",
			stock: null,
		}));
		reset(SLIDER_ITEM_TRANSACTION_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			order_entry_id: data?.order_entry_id,
			trx_from: "slider_assembly_prod",
			trx_to: "coloring_stock",
			stock: updateItemLibrary?.stock - data?.trx_quantity,
			name: order?.find((e) => e.value === data?.order_entry_id)?.label,
			slider_item_id: updateItemLibrary?.id,
			issued_by: user?.id,
			created_at: GetDateTime(),
		};

		useUpdateFunc({
			uri: "/sfg/trx",
			itemId: updateItemLibrary.id,
			data: data,
			updatedData: updatedData,
			setItems: setItemLibrary,
			onClose: onClose,
		});
	};

	return (
		<AddModal
			id={"SliderAssemblyTransfer"}
			title={`Slider Assembly ⇾ Coloring`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<FormField label="order_entry_id" title="Order" errors={errors}>
				<Controller
					name={"order_entry_id"}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder="Select Order"
								options={order}
								onChange={(e) => {
									onChange(parseInt(e.value));
									setQty(e);
								}}
							/>
						);
					}}
				/>
			</FormField>
			<JoinInput
				label="trx_quantity"
				unit="PCS"
				sub_label={`Stock: ${updateItemLibrary?.stock}, Order QTY: ${qty?.quantity || 0}, Can TRF: ${MAX_QUANTITY}`}
				placeholder={`Max: ${MAX_QUANTITY}`}
				{...{ register, errors }}
			/>
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
