import { AddModal } from "@/components/Modal";
import { useRHF, useUpdateFunc } from "@/hooks";
import { Input, JoinInput } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import {
	TAPE_OR_COIL_PRODUCTION_LOG_NULL,
	TAPE_OR_COIL_PRODUCTION_LOG_SCHEMA,
} from "@util/Schema";

export default function Index({
	modalId = "",
	setTapeLog,
	updateTapeLog = {
		id: null,
		type_of_zipper: null,
		tape_or_coil_stock_id: null,
		prod_quantity: null,
		tape_prod: null,
		coil_stock: null,
		wastage: null,
		issued_by_name: null,
	},
	setUpdateTapeLog,
}) {
	const MIN_QUANTITY =
		Number(updateTapeLog?.tape_prod) -
			Number(updateTapeLog?.prod_quantity) <
		0
			? Number(updateTapeLog?.prod_quantity)
			: 0;
	const schema = {
		...TAPE_OR_COIL_PRODUCTION_LOG_SCHEMA,
		prod_quantity:
			TAPE_OR_COIL_PRODUCTION_LOG_SCHEMA.prod_quantity.min(MIN_QUANTITY),
	};

	const { register, handleSubmit, errors, reset } = useRHF(
		schema,
		TAPE_OR_COIL_PRODUCTION_LOG_NULL
	);

	// useFetchForRhfReset(
	// 	`tape-or-coil-prod/by-id/${updateTapeLog?.id}`,
	// 	updateTapeLog?.id,
	// 	reset
	// );

	const onClose = () => {
		setUpdateTapeLog((prev) => ({
			...prev,
			id: null,
			type_of_zipper: null,
			tape_or_coil_stock_id: null,
			prod_quantity: null,
			tape_prod: null,
			coil_stock: null,
			wastage: null,
			issued_by_name: null,
		}));
		reset(TAPE_OR_COIL_PRODUCTION_LOG_NULL);
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
				uri: `/tape-or-coil-prod/${updateTapeLog?.id}/${updateTapeLog?.type_of_zipper}`,
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
			title={`Update Production Log of ${updateTapeLog?.type_of_zipper}`}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<JoinInput
				title="Production Quantity"
				label="prod_quantity"
				sub_label={`Min: ${MIN_QUANTITY}`}
				unit="KG"
				placeholder={`Min: ${MIN_QUANTITY}`}
				{...{ register, errors }}
			/>
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
