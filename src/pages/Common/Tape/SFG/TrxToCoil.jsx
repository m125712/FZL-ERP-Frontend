import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import { useFetchForRhfReset, useRHF, useUpdateFunc } from "@/hooks";
import { Input, JoinInput } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { COIL_STOCK_NULL, NUMBER_REQUIRED } from "@util/Schema";

export default function Index({
	modalId = "",
	setTapeProd,
	updateTapeProd = {
		id: null,
		name: null,
		type: null,
		quantity: null,
		zipper_number: null,
		type_of_zipper: null,
	},
	setUpdateTapeProd,
}) {
	const { user } = useAuth();
	const schema = {
		trx_quantity: NUMBER_REQUIRED.max(updateTapeProd?.quantity).moreThan(0),
	};

	const { register, handleSubmit, errors, reset } = useRHF(
		schema,
		COIL_STOCK_NULL
	);

	useFetchForRhfReset(
		`/tape-or-coil-stock/${updateTapeProd?.id}`,
		updateTapeProd?.id,
		reset
	);

	const onClose = () => {
		setUpdateTapeProd((prev) => ({
			...prev,
			id: null,
			type: null,
			quantity: null,
			zipper_number: null,
			type_of_zipper: null,
		}));
		reset(COIL_STOCK_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const tape_or_coil_stock_id = updateTapeProd?.id;
		const issued_by = user?.id;

		const issued_by_name = user?.name;
		const quantity = updateTapeProd?.quantity - data?.trx_quantity;

		//  tape_or_coil_stock_id, trx_quantity, issued_by, created_at;

		const updatedData = {
			...data,
			quantity: updateTapeProd?.quantity - data?.trx_quantity,
			type: updateTapeProd?.type,
			zipper_number: updateTapeProd?.zipper_number,
			type_of_zipper: updateTapeProd?.type_of_zipper,
			tape_or_coil_stock_id,
			trx_quantity: data?.trx_quantity,
			name: updateTapeProd?.name,
			issued_by,
			issued_by_name,
			quantity,
			created_at: GetDateTime(),
		};

		await useUpdateFunc({
			uri: `/tape-to-coil-trx`,
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
			title={updateTapeProd?.id !== null && "Tape to Coil"}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<JoinInput
				label="trx_quantity"
				unit="KG"
				placeholder={`Max: ${updateTapeProd?.quantity}`}
				{...{ register, errors }}
			/>
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
