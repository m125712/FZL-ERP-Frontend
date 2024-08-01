import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import { useRHF, useUpdateFunc } from "@/hooks";
import { Input, JoinInput } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { TAPE_PROD_NULL, TAPE_PROD_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setTapeProd,
	updateTapeProd = {
		id: null,
		type: null,
		quantity: null,
		zipper_number: null,
		type_of_zipper: null,
		tape_or_coil_stock_id: null,
	},
	setUpdateTapeProd,
}) {
	const { user } = useAuth();

	const { register, handleSubmit, errors, reset } = useRHF(
		TAPE_PROD_SCHEMA,
		TAPE_PROD_NULL
	);

	// useFetchForRhfReset(
	// 	`/tape-or-coil-prod/by-id/${updateTapeProd?.id}`,
	// 	updateTapeProd?.id,
	// 	reset
	// );

	const onClose = () => {
		setUpdateTapeProd((prev) => ({
			...prev,
			id: null,
			type: null,
			quantity: null,
			zipper_number: null,
			type_of_zipper: null,
			tape_or_coil_stock_id: null,
		}));
		reset(TAPE_PROD_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const section = "tape";
		const issued_by = user?.id;
		const issued_by_name = user?.name;
		// Update item

		const updatedData = {
			...data,
			section,
			tape_or_coil_stock_id: updateTapeProd?.tape_or_coil_stock_id,
			type: updateTapeProd?.type,
			zipper_number: updateTapeProd?.zipper_number,
			quantity: updateTapeProd?.quantity + data?.quantity,
			prod_quantity: data?.quantity,
			issued_by,
			issued_by_name,
			type_of_zipper: updateTapeProd?.type_of_zipper,
			updated_at: GetDateTime(),
		};
		await useUpdateFunc({
			uri: `/tape-or-coil-prod`,
			itemId: updateTapeProd.id,
			data: data,
			updatedData: updatedData,
			setItems: setTapeProd,
			onClose: onClose,
		});
	};

	return (
		<AddModal
			id={"TapeProdModal"}
			title={`Tape Production: ${
				updateTapeProd?.type_of_zipper
					? updateTapeProd?.type_of_zipper.toUpperCase()
					: ""
			} `}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<JoinInput label="quantity" unit="KG" {...{ register, errors }} />
			<JoinInput label="wastage" unit="KG" {...{ register, errors }} />
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
