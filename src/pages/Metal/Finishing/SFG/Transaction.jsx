import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import { useFetchForRhfReset, useRHF, useUpdateFunc } from "@/hooks";
import { Input } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { SFG_TRX_NULL, SFG_TRX_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setFinishingProd,
	updateFinishingProd = {
		id: null,
		name: "",
		finishing_stock: null,
		finishing_prod: null,
		order_entry_id: null,
		item_description: null,
		total_trx_quantity: null,
		end_type_name: "",
		order_number: "",
		order_description: "",
	},
	setUpdateFinishingProd,
}) {
	const { user } = useAuth();
	const schema = {
		trx_quantity: SFG_TRX_SCHEMA.trx_quantity.max(
			updateFinishingProd?.finishing_prod
		),
	};
	const { register, handleSubmit, errors, reset, watch } = useRHF(
		schema,
		SFG_TRX_NULL
	);

	const onClose = () => {
		setUpdateFinishingProd((prev) => ({
			...prev,
			id: null,
			name: "",
			finishing_stock: null,
			finishing_prod: null,
			order_entry_id: null,
			item_description: null,
			total_trx_quantity: null,
			end_type_name: "",
			order_number: "",
			order_description: "",
		}));
		reset(SFG_TRX_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			name: updateFinishingProd?.name,
			order_number: updateFinishingProd?.order_number,
			order_description: updateFinishingProd?.order_description,
			item_description: updateFinishingProd?.item_description,
			order_entry_id: updateFinishingProd?.order_entry_id,
			finishing_stock: updateFinishingProd?.finishing_stock,
			finishing_prod:
				updateFinishingProd?.finishing_prod - data.trx_quantity,
			total_trx_quantity:
				updateFinishingProd?.total_trx_quantity + data.trx_quantity,
			end_type_name: updateFinishingProd?.end_type_name,
			trx_from: "finishing_prod",
			trx_to: "warehouse",
			name: updateFinishingProd?.name,
			issued_by: user?.id,
			issued_by_name: user?.name,
			created_at: GetDateTime(),
		};
		if (updatedData.trx_quantity > 0) {
			await useUpdateFunc({
				uri: `/sfg/trx`,
				itemId: updateFinishingProd?.id,
				data: data,
				updatedData: updatedData,
				setItems: setFinishingProd,
				onClose: onClose,
			});
		} else {
			alert(
				"Remaining trx_quantity should be less than stock trx_quantity"
			);
			return;
		}
	};

	return (
		<AddModal
			id="FinishingTrxModal"
			title={"Finishing"}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<Input
				label="trx_quantity"
				max={updateFinishingProd?.finishing_prod}
				placeholder={`Max: ${updateFinishingProd?.finishing_prod}`}
				{...{ register, errors }}
			/>
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
