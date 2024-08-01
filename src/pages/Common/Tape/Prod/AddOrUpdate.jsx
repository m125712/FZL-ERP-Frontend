import { AddModal } from "@/components/Modal";
import {
	useFetchForRhfReset,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from "@/hooks";
import { Input } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { TAPE_STOCK_ADD_NULL, TAPE_STOCK_ADD_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setTapeProd,
	updateTapeProd = {
		id: null,
		type: "",
		zipper_number: null,
		quantity: null,
		trx_quantity_in_coil: null,
		quantity_in_coil: null,
		remarks: "",
	},
	setUpdateTapeProd,
}) {
	const { register, handleSubmit, errors, reset, watch } = useRHF(
		TAPE_STOCK_ADD_SCHEMA,
		TAPE_STOCK_ADD_NULL
	);

	const isUpdate = updateTapeProd?.id !== null;
	isUpdate &&
		useFetchForRhfReset(
			`/tape-or-coil-stock/${updateTapeProd?.id}`,
			updateTapeProd?.id,
			reset
		);

	const onClose = () => {
		setUpdateTapeProd((prev) => ({
			...prev,
			id: null,
			type: "",
			zipper_number: null,
			quantity: null,
			trx_quantity_in_coil: null,
			quantity_in_coil: null,
			remarks: "",
		}));
		reset(TAPE_STOCK_ADD_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		if (updateTapeProd?.id !== null) {
			const updatedData = {
				...data,
				quantity: 0,
				trx_quantity_in_coil: 0,
				quantity_in_coil: 0,
				updated_at: GetDateTime(),
			};
			useUpdateFunc({
				uri: `/tape-or-coil-stock/${updateTapeProd?.id}/${data?.type}`,
				itemId: updateTapeProd.id,
				data: data,
				updatedData: updatedData,
				setItems: setTapeProd,
				onClose: onClose,
			});

			return;
		}
		const updatedData = {
			...data,
			quantity: 0,
			trx_quantity_in_coil: 0,
			quantity_in_coil: 0,
			created_at: GetDateTime(),
		};

		usePostFunc({
			uri: "/tape-or-coil-stock",
			data: updatedData,
			setItems: setTapeProd,
			onClose: onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={
				updateTapeProd?.id !== undefined ? "Tape Add" : "Tape Update"
			}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<Input label="type" {...{ register, errors }} />
			<Input label="zipper_number" {...{ register, errors }} />
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
