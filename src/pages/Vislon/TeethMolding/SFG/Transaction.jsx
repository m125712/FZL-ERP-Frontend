import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import { useFetchForRhfReset, useRHF, useUpdateFunc } from "@/hooks";
import { Input, JoinInput } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { SFG_TRX_NULL, SFG_TRX_SCHEMA } from "@util/Schema";

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
		order_number: "",
		order_description: "",
		quantity: null,
	},
	setUpdateTeethMoldingProd,
}) {
	const { user } = useAuth();
	const schema = {
		trx_quantity: SFG_TRX_SCHEMA.trx_quantity.max(
			updateTeethMoldingProd?.teeth_molding_prod
		),
	};
	const { register, handleSubmit, errors, reset, watch } = useRHF(
		schema,
		SFG_TRX_NULL
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
			quantity: null,
		}));
		reset(SFG_TRX_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			name: updateTeethMoldingProd?.name,
			order_number: updateTeethMoldingProd?.order_number,
			order_description: updateTeethMoldingProd?.order_description,
			item_description: updateTeethMoldingProd?.item_description,
			order_entry_id: updateTeethMoldingProd?.order_entry_id,
			teeth_molding_stock: updateTeethMoldingProd?.teeth_molding_stock,
			teeth_molding_prod:
				updateTeethMoldingProd?.teeth_molding_prod - data.trx_quantity,
			total_trx_quantity:
				updateTeethMoldingProd?.total_trx_quantity + data.trx_quantity,
			trx_from: "teeth_molding_prod",
			trx_to: "finishing_stock",
			quantity: updateTeethMoldingProd?.quantity,
			name: updateTeethMoldingProd?.name,
			issued_by: user?.id,
			issued_by_name: user?.name,
			created_at: GetDateTime(),
		};
		if (updatedData.trx_quantity > 0) {
			await useUpdateFunc({
				uri: `/sfg/trx`,
				itemId: updateTeethMoldingProd?.id,
				data: data,
				updatedData: updatedData,
				setItems: setTeethMoldingProd,
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
			id="TeethMoldingTrxModal"
			title="Teeth Molding ⇾ Finishing"
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<JoinInput
				label="trx_quantity"
				unit="PCS"
				max={updateTeethMoldingProd?.teeth_molding_prod}
				placeholder={`Max: ${updateTeethMoldingProd?.teeth_molding_prod}`}
				{...{ register, errors }}
			/>
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
