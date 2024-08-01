import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import { useRHF, useUpdateFunc } from "@/hooks";
import { Input, JoinInput } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { SFG_PRODUCTION_NULL, SFG_PRODUCTION_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setTeethMoldingProd,
	updateTeethMoldingProd = {
		id: null,
		name: "",
		teeth_molding_stock: null,
		teeth_molding_prod: null,
		order_entry_id: null,
		item_description: null,
		total_trx_quantity: null,
		order_number: "",
		order_description: "",
		quantity: null,
	},
	setUpdateTeethMoldingProd,
}) {
	const { user } = useAuth();
	const MAX_SLIDER_PRODUCTION_QUANTITY =
		updateTeethMoldingProd?.quantity -
		(updateTeethMoldingProd?.total_trx_quantity +
			updateTeethMoldingProd?.teeth_molding_prod);

	const MAX_USED_QUANTITY = updateTeethMoldingProd?.teeth_molding_stock;
	const schema = {
		...SFG_PRODUCTION_SCHEMA,
		production_quantity: SFG_PRODUCTION_SCHEMA.production_quantity.max(
			MAX_SLIDER_PRODUCTION_QUANTITY
		),
		used_quantity:
			SFG_PRODUCTION_SCHEMA.production_quantity.max(MAX_USED_QUANTITY),
	};
	const { register, handleSubmit, errors, reset, watch } = useRHF(
		schema,
		SFG_PRODUCTION_NULL
	);

	const onClose = () => {
		setUpdateTeethMoldingProd((prev) => ({
			...prev,
			id: null,
			name: "",
			teeth_molding_stock: null,
			teeth_molding_prod: null,
			order_entry_id: null,
			item_description: null,
			total_trx_quantity: null,
			order_number: "",
			order_description: "",
		}));
		reset(SFG_PRODUCTION_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			name: updateTeethMoldingProd?.name,
			order_entry_id: updateTeethMoldingProd?.order_entry_id,
			order_number: updateTeethMoldingProd?.order_number,
			order_description: updateTeethMoldingProd?.order_description,
			item_description: updateTeethMoldingProd?.item_description,
			teeth_molding_stock:
				updateTeethMoldingProd?.teeth_molding_stock -
				(data.used_quantity + data.wastage),
			teeth_molding_prod:
				updateTeethMoldingProd?.teeth_molding_prod +
				data.production_quantity,
			total_trx_quantity: updateTeethMoldingProd?.total_trx_quantity,
			section: "teeth_molding",
			quantity: updateTeethMoldingProd?.quantity,
			issued_by: user?.id,
			created_at: GetDateTime(),
		};

		if (updatedData.production_quantity > 0) {
			await useUpdateFunc({
				uri: `/sfg/production`,
				itemId: updateTeethMoldingProd?.id,
				data: data,
				updatedData: updatedData,
				setItems: setTeethMoldingProd,
				onClose: onClose,
			});
		} else {
			alert("Quantity should be less than stock quantity");
			return;
		}
	};

	return (
		<AddModal
			id="TeethMoldingProdModal"
			title={"Teeth Molding Production"}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<JoinInput
				label="used_quantity"
				unit="KG"
				placeholder={`Max: ${MAX_USED_QUANTITY}`}
				{...{ register, errors }}
			/>
			<JoinInput
				label="production_quantity"
				unit="PCS"
				placeholder={`Max: ${MAX_SLIDER_PRODUCTION_QUANTITY}`}
				{...{ register, errors }}
			/>
			<JoinInput
				label="wastage"
				unit="KG"
				placeholder={`Max: ${(
					MAX_USED_QUANTITY - watch("used_quantity")
				).toFixed(2)}`}
				{...{ register, errors }}
				{...{ register, errors }}
			/>
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
