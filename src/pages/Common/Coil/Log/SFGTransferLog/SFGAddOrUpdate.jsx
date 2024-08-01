import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import {
	useFetchForRhfReset,
	useFetchFunc,
	useRHF,
	useUpdateFunc,
} from "@/hooks";
import { FormField, Input, ReactSelect } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { Need } from "@/util/Need";
import { SFG_TRANSFER_LOG_NULL, SFG_TRANSFER_LOG_SCHEMA } from "@util/Schema";
import { set } from "date-fns";
import { useEffect, useState } from "react";

export default function Index({
	modalId = "",
	setCoil,
	updateCoilLog = {
		id: null,
		trx_from: null,
		trx_to: null,
		item_name: null,
		trx_quantity: null,
		order_description: null,
		order_quantity: null,
		coil_stock: null,
		dying_and_iron_stock: null,
		finishing_stock: null,
		order_entry_id: null,
		zipper_number_name: null,
	},
	setUpdateCoilLog,
}) {
	const [orderInfo, setOrderInfo] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const MAX_QUANTITY =
		updateCoilLog?.coil_stock + updateCoilLog?.dying_and_iron_stock;
	const schema = {
		...SFG_TRANSFER_LOG_SCHEMA,
		trx_quantity: SFG_TRANSFER_LOG_SCHEMA.trx_quantity.max(MAX_QUANTITY),
	};

	const { user } = useAuth();
	const {
		register,
		handleSubmit,
		errors,
		control,
		Controller,
		reset,
		getValues,
	} = useRHF(schema, SFG_TRANSFER_LOG_NULL);

	useFetchForRhfReset(
		`/sfg/trx/by/id/${updateCoilLog?.id}`,
		updateCoilLog?.id,
		reset
	);

	useEffect(() => {
		useFetchFunc(
			`/order/description/from/${updateCoilLog?.order_entry_id}`,
			setOrderInfo,
			setLoading,
			setError
		);
	}, [updateCoilLog?.order_entry_id]);

	const getMaxQuantity = () => {
		if (orderInfo === null) return 0;
		let need =
			Need({
				item: updateCoilLog?.item_name,
				stopper_type: orderInfo[0]?.stopper_type_name,
				zipper_number: updateCoilLog?.zipper_number_name,
				end_type: orderInfo[0]?.end_type_name,
				size: parseFloat(orderInfo[0]?.size),
				pcs: orderInfo[0]?.quantity,
			}) - orderInfo[0]?.given_tape_for_coil;
		return need == null || undefined ? 0 : need.toFixed(3);
	};

	const onClose = () => {
		setUpdateCoilLog((prev) => ({
			...prev,
			id: null,
			trx_from: null,
			trx_to: null,
			item_name: null,
			trx_quantity: null,
			order_description: null,
			order_quantity: null,
			coil_stock: null,
			dying_and_iron_stock: null,
			order_entry_id: null,
			zipper_number_name: null,
		}));
		reset(SFG_TRANSFER_LOG_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateCoilLog?.id !== null) {
			const updatedData = {
				...data,
				order_entry_id: updateCoilLog?.order_entry_id,
				updated_at: GetDateTime(),
			};

			await useUpdateFunc({
				uri: `/sfg/trx/${updateCoilLog?.id}/${updateCoilLog?.order_description.replace(/[#&/]/g, "")}`,
				itemId: updateCoilLog?.id,
				data: data,
				updatedData: updatedData,
				setItems: setCoil,
				onClose: onClose,
			});

			return;
		}
	};

	const transactionArea = [
		{ label: "Dying and Iron", value: "dying_and_iron_stock" },
		{ label: "Teeth Molding", value: "teeth_molding_stock" },
		{ label: "Teeth Cleaning", value: "teeth_cleaning_stock" },
		{ label: "Finishing", value: "finishing_stock" },
		{ label: "Slider Assembly", value: "slider_assembly_stock" },
		{ label: "Coloring", value: "coloring_stock" },
	];

	return (
		<AddModal
			id={modalId}
			title={`Coil SFG Transfer Log`}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<FormField label="trx_to" title="Trx to" errors={errors}>
				<Controller
					name={"trx_to"}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder="Select Transaction Area"
								options={transactionArea}
								value={transactionArea?.find(
									(item) => item.value == getValues("trx_to")
								)}
								onChange={(e) => onChange(e.value)}
								isDisabled={updateCoilLog?.id !== null}
							/>
						);
					}}
				/>
			</FormField>
			<Input
				label="trx_quantity"
				sub_label={`Max: ${MAX_QUANTITY}, Max For This Order: ${getMaxQuantity()}`}
				{...{ register, errors }}
			/>
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
