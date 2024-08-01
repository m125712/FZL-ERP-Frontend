import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import { useFetchForRhfReset, useRHF, useUpdateFunc } from "@/hooks";
import { FormField, Input, JoinInput, ReactSelect } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { TAPE_TO_COIL_TRX_NULL, TAPE_TO_COIL_TRX_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setTapeLog,
	updateTapeLog = {
		id: null,
		type_of_zipper: null,
		tape_or_coil_stock_id: null,
		tape_prod: null,
		coil_stock: null,
		trx_quantity: null,
	},
	setUpdateTapeLog,
}) {
	const MAX_QUANTITY =
		Number(updateTapeLog?.tape_prod) + Number(updateTapeLog?.trx_quantity);
	const MIN_QUANTITY =
		Number(updateTapeLog?.coil_stock) - Number(updateTapeLog?.trx_quantity);
	const schema = {
		...TAPE_TO_COIL_TRX_SCHEMA,
		trx_quantity: TAPE_TO_COIL_TRX_SCHEMA.trx_quantity
			.min(MIN_QUANTITY)
			.max(MAX_QUANTITY),
	};

	const { register, handleSubmit, errors, reset } = useRHF(
		schema,
		TAPE_TO_COIL_TRX_NULL
	);

	useFetchForRhfReset(
		`tape-to-coil-trx/${updateTapeLog?.id}`,
		updateTapeLog?.id,
		reset
	);

	const onClose = () => {
		setUpdateTapeLog((prev) => ({
			...prev,
			id: null,
			type_of_zipper: null,
			tape_or_coil_stock_id: null,
			tape_prod: null,
			coil_stock: null,
			trx_quantity: null,
		}));
		reset(TAPE_TO_COIL_TRX_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateTapeLog?.id !== null) {
			const updatedData = {
				...data,
				type_of_zipper: updateTapeLog?.type_of_zipper,
				updated_at: GetDateTime(),
			};

			await useUpdateFunc({
				uri: `/tape-to-coil-trx/${updateTapeLog?.id}/${updateTapeLog?.type_of_zipper}`,
				itemId: updateTapeLog?.id,
				data: data,
				updatedData: updatedData,
				setItems: setTapeLog,
				onClose: onClose,
			});

			return;
		}
	};

	return (
		<AddModal
			id={modalId}
			title={`Tape Log of ${updateTapeLog?.type_of_zipper}`}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<JoinInput
				label="trx_quantity"
				sub_label={`Max: ${MAX_QUANTITY}, Min: ${MIN_QUANTITY}`}
				unit="KG"
				placeholder={`Max: ${MAX_QUANTITY}, Min: ${MIN_QUANTITY}`}
				{...{ register, errors }}
			/>
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
