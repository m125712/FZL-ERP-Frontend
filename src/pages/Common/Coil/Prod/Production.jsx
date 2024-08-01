import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import { useRHF, useUpdateFunc } from "@/hooks";
import { Input, JoinInput } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import {
	COIL_PROD_NULL,
	COIL_PROD_SCHEMA,
	NUMBER_REQUIRED,
} from "@util/Schema";

export default function Index({
	modalId = "",
	setCoilProd,
	updateCoilProd = {
		id: null,
		type_of_zipper: null,
		type: null,
		zipper_number: null,
		trx_quantity_in_coil: null,
		quantity_in_coil: null,
		tape_or_coil_stock_id: null,
	},
	setUpdateCoilProd,
}) {
	const { user } = useAuth();

	const MAX_PRODUCTION_QTY = updateCoilProd?.trx_quantity_in_coil;
	const schema = {
		...COIL_PROD_SCHEMA,
		quantity: NUMBER_REQUIRED.max(MAX_PRODUCTION_QTY),
		wastage: NUMBER_REQUIRED.max(MAX_PRODUCTION_QTY),
	};

	const { register, handleSubmit, errors, reset, watch } = useRHF(
		schema,
		COIL_PROD_NULL
	);
	watch();

	const onClose = () => {
		setUpdateCoilProd((prev) => ({
			...prev,
			id: null,
			type_of_zipper: null,
			type: null,
			zipper_number: null,
			trx_quantity_in_coil: null,
			quantity_in_coil: null,
			tape_or_coil_stock_id: null,
		}));
		reset(COIL_PROD_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			type: updateCoilProd?.type,
			zipper_number: updateCoilProd?.zipper_number,
			prod_quantity: data?.quantity,
			trx_quantity_in_coil:
				updateCoilProd?.trx_quantity_in_coil - data?.quantity,
			quantity_in_coil: updateCoilProd?.quantity_in_coil + data?.quantity,
			section: "coil",
			tape_or_coil_stock_id: updateCoilProd?.tape_or_coil_stock_id,
			issued_by: user?.id,
			issued_by_name: user?.name,
			type_of_zipper: updateCoilProd?.type_of_zipper,
			created_at: GetDateTime(),
		};

		await useUpdateFunc({
			uri: "/tape-or-coil-prod",
			itemId: updateCoilProd.id,
			data: data,
			updatedData: updatedData,
			setItems: setCoilProd,
			onClose: onClose,
		});
	};

	return (
		<AddModal
			id={"CoilProdModal"}
			title={`Coil Production: ${
				updateCoilProd?.type_of_zipper
					? updateCoilProd.type_of_zipper.toUpperCase()
					: ""
			}`}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<JoinInput
				label="quantity"
				unit="KG"
				placeholder={`Max: ${MAX_PRODUCTION_QTY}`}
				{...{ register, errors }}
			/>
			<JoinInput
				label="wastage"
				unit="KG"
				placeholder={`Max: ${(
					MAX_PRODUCTION_QTY - watch("quantity")
				).toFixed(2)}`}
				{...{ register, errors }}
			/>
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
