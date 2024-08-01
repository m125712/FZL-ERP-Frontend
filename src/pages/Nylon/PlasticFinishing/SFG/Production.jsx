import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import { useRHF, useUpdateFunc } from "@/hooks";
import { Input, JoinInput } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { SFG_PRODUCTION_NULL, SFG_PRODUCTION_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setFinishingProd,
	updateFinishingProd = {
		id: null,
		name: "",
		coloring_prod: null,
		finishing_stock: null,
		finishing_prod: null,
		order_entry_id: null,
		item_description: null,
		total_trx_quantity: null,
		order_number: "",
		order_description: "",
		quantity: null,
	},
	setUpdateFinishingProd,
}) {
	const { user } = useAuth();
	const MAX_SLIDER_PRODUCTION_QUANTITY = updateFinishingProd?.coloring_prod;
	const MAX_USED_QUANTITY =
		updateFinishingProd?.finishing_stock -
		updateFinishingProd?.total_trx_quantity;

	const schema = {
		...SFG_PRODUCTION_SCHEMA,
		used_quantity: SFG_PRODUCTION_SCHEMA.production_quantity
			.moreThan(0)
			.max(MAX_USED_QUANTITY),
		production_quantity: SFG_PRODUCTION_SCHEMA.production_quantity.max(
			MAX_SLIDER_PRODUCTION_QUANTITY
		),
	};
	const { register, handleSubmit, errors, reset, watch } = useRHF(
		schema,
		SFG_PRODUCTION_NULL
	);

	const onClose = () => {
		setUpdateFinishingProd((prev) => ({
			...prev,
			id: null,
			name: "",
			finishing_stock: null,
			finishing_prod: null,
			coloring_prod: null,
			order_entry_id: null,
			item_description: null,
			total_trx_quantity: null,
			end_type_name: "",
			order_number: "",
			order_description: "",
			quantity: null,
		}));
		reset(SFG_PRODUCTION_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			name: updateFinishingProd?.name,
			order_entry_id: updateFinishingProd?.order_entry_id,
			order_number: updateFinishingProd?.order_number,
			order_description: updateFinishingProd?.order_description,
			item_description: updateFinishingProd?.item_description,
			coloring_prod:
				MAX_SLIDER_PRODUCTION_QUANTITY - data.production_quantity,
			finishing_stock:
				updateFinishingProd?.finishing_stock -
				(data.used_quantity + data.wastage),
			finishing_prod:
				updateFinishingProd?.finishing_prod + data.production_quantity,
			total_trx_quantity: updateFinishingProd?.total_trx_quantity,
			end_type_name: updateFinishingProd?.end_type_name,
			section: "finishing",
			quantity: updateFinishingProd?.quantity,
			issued_by: user?.id,
			created_at: GetDateTime(),
		};

		if (updatedData.production_quantity > 0) {
			await useUpdateFunc({
				uri: `/sfg/production`,
				itemId: updateFinishingProd?.id,
				data: data,
				updatedData: updatedData,
				setItems: setFinishingProd,
				onClose: onClose,
			});
		} else {
			alert("Quantity should be less than stock quantity");
			return;
		}
	};

	return (
		<AddModal
			id="FinishingProdModal"
			title={"Finishing Production"}
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
			/>
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
