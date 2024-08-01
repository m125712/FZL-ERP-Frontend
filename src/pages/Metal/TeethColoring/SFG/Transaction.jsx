import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import { useRHF, useUpdateFunc } from "@/hooks";
import { Input, JoinInput } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { SFG_TRX_NULL, SFG_TRX_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setTeethColoringProd,
	updateTeethColoringProd = {
		id: null,
		name: "",
		teeth_coloring_stock: null,
		teeth_coloring_prod: null,
		order_entry_id: null,
		item_description: null,
		order_number: "",
		order_description: "",
	},
	setUpdateTeethColoringProd,
}) {
	const { user } = useAuth();
	const schema = {
		trx_quantity: SFG_TRX_SCHEMA.trx_quantity.max(
			updateTeethColoringProd?.teeth_coloring_prod
		),
	};
	const { register, handleSubmit, errors, reset, watch } = useRHF(
		schema,
		SFG_TRX_NULL
	);

	const onClose = () => {
		setUpdateTeethColoringProd((prev) => ({
			...prev,
			id: null,
			name: "",
			teeth_coloring_stock: null,
			teeth_coloring_prod: null,
			order_entry_id: null,
			item_description: null,
			total_trx_quantity: null,
			order_number: "",
			order_description: "",
		}));
		reset(SFG_TRX_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			name: updateTeethColoringProd?.name,
			order_number: updateTeethColoringProd?.order_number,
			order_description: updateTeethColoringProd?.order_description,
			item_description: updateTeethColoringProd?.item_description,
			order_entry_id: updateTeethColoringProd?.order_entry_id,
			teeth_coloring_stock: updateTeethColoringProd?.teeth_coloring_stock,
			teeth_coloring_prod:
				updateTeethColoringProd?.teeth_coloring_prod -
				data.trx_quantity,
			total_trx_quantity:
				updateTeethColoringProd?.total_trx_quantity + data.trx_quantity,
			trx_from: "teeth_coloring_prod",
			trx_to: "finishing_stock",
			name: updateTeethColoringProd?.name,
			issued_by: user?.id,
			issued_by_name: user?.name,
			created_at: GetDateTime(),
		};
		if (updatedData.trx_quantity > 0) {
			await useUpdateFunc({
				uri: `/sfg/trx`,
				itemId: updateTeethColoringProd?.id,
				data: data,
				updatedData: updatedData,
				setItems: setTeethColoringProd,
				onClose: onClose,
			});
		} else {
			alert("Remaining trx_quantity should be greater than 0");
			return;
		}
	};

	return (
		<AddModal
			id="TeethColoringTrxModal"
			title={"Teeth Coloring ⇾ Finishing"}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<JoinInput
				label="trx_quantity"
				unit="PCS"
				max={updateTeethColoringProd?.teeth_coloring_prod}
				placeholder={`Max: ${updateTeethColoringProd?.teeth_coloring_prod}`}
				{...{ register, errors }}
			/>
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
