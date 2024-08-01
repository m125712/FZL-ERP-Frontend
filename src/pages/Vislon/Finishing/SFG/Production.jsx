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
	},
	setUpdateFinishingProd,
}) {
	const { user } = useAuth();
	const MAX_SLIDER_PRODUCTION_QUANTITY = Math.min(
		updateFinishingProd?.coloring_prod,
		updateFinishingProd?.finishing_stock
	);

	const schema = {
		...SFG_PRODUCTION_SCHEMA,
		production_quantity: SFG_PRODUCTION_SCHEMA.production_quantity
			.moreThan(0)
			.max(MAX_SLIDER_PRODUCTION_QUANTITY),
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
				updateFinishingProd?.coloring_prod - data.production_quantity,
			finishing_stock:
				updateFinishingProd?.finishing_stock -
				(data.production_quantity + data.wastage),
			finishing_prod:
				updateFinishingProd?.finishing_prod + data.production_quantity,
			total_trx_quantity: updateFinishingProd?.total_trx_quantity,
			used_quantity: 0,
			quantity: updateFinishingProd?.quantity,
			section: "finishing",
			issued_by: user?.id,
			created_at: GetDateTime(),
		};

		await useUpdateFunc({
			uri: `/sfg/production`,
			itemId: updateFinishingProd?.id,
			data: data,
			updatedData: updatedData,
			setItems: setFinishingProd,
			onClose: onClose,
		});
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
				label="production_quantity"
				unit="PCS"
				placeholder={`Max: ${MAX_SLIDER_PRODUCTION_QUANTITY}`}
				{...{ register, errors }}
			/>
			<JoinInput
				title="Wastage (Tape)"
				label="wastage"
				unit="PCS"
				placeholder={`Max: ${MAX_SLIDER_PRODUCTION_QUANTITY - watch("production_quantity")}`}
				{...{ register, errors }}
			/>
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
