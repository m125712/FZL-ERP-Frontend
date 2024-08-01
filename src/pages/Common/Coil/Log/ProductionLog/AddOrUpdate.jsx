import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import { useRHF, useUpdateFunc } from "@/hooks";
import { Input, JoinInput } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import {
	TAPE_OR_COIL_PRODUCTION_LOG_NULL,
	TAPE_OR_COIL_PRODUCTION_LOG_SCHEMA,
} from "@util/Schema";

export default function Index({
	modalId = "",
	setCoilLog,
	updateCoilLog = {
		id: null,
		type_of_zipper: null,
		tape_or_coil_stock_id: null,
		prod_quantity: null,
		coil_stock: null,
		coil_prod: null,
		wastage: null,
		issued_by_name: null,
	},
	setUpdateCoilLog,
}) {
	const { user } = useAuth();
	const MIN_QUANTITY = 0;
	const MAX_QUANTITY =
		updateCoilLog?.coil_stock + updateCoilLog?.prod_quantity;
	const schema = {
		...TAPE_OR_COIL_PRODUCTION_LOG_SCHEMA,
		prod_quantity: TAPE_OR_COIL_PRODUCTION_LOG_SCHEMA.prod_quantity
			.min(MIN_QUANTITY)
			.max(MAX_QUANTITY),
	};

	const { register, handleSubmit, errors, reset } = useRHF(
		schema,
		TAPE_OR_COIL_PRODUCTION_LOG_NULL
	);

	// useFetchForRhfReset(
	// 	`tape-or-coil-prod/by-id/${updateCoilLog?.id}`,
	// 	updateCoilLog?.id,
	// 	reset
	// );

	const onClose = () => {
		setUpdateCoilLog((prev) => ({
			...prev,
			id: null,
			type_of_zipper: null,
			tape_or_coil_stock_id: null,
			prod_quantity: null,
			coil_stock: null,
			coil_prod: null,
			wastage: null,
			issued_by_name: null,
		}));
		reset(TAPE_OR_COIL_PRODUCTION_LOG_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateCoilLog?.id !== null) {
			const updatedData = {
				...data,
				type_of_zipper: updateCoilLog?.type_of_zipper,
				wastage: updateCoilLog?.wastage,
				issued_by_name: updateCoilLog?.issued_by_name,
				issued_by: user?.id,
				updated_at: GetDateTime(),
			};

			await useUpdateFunc({
				uri: `/tape-or-coil-prod/${updateCoilLog?.id}/${updateCoilLog?.type_of_zipper}`,
				itemId: updateCoilLog?.id,
				data: data,
				updatedData: updatedData,
				setItems: setCoilLog,
				onClose: onClose,
			});

			return;
		}
	};

	return (
		<AddModal
			id={modalId}
			title={`Update Production Log of ${updateCoilLog?.type_of_zipper}`}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<JoinInput
				title="Production Quantity"
				label="prod_quantity"
				sub_label={`Max: ${MAX_QUANTITY}, Min: ${MIN_QUANTITY}`}
				unit="KG"
				placeholder={`Max: ${MAX_QUANTITY}, Min: ${MIN_QUANTITY}`}
				{...{ register, errors }}
			/>
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
