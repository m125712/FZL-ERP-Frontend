import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import {
	useFetchForRhfReset,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from "@/hooks";
import { Input } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { SFG_PRODUCTION_NULL, SFG_PRODUCTION_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setDieCastingProd,
	updateDieCastingProd = {
		id: null,
		name: "",
		die_casting_prod: null,
		order_entry_id: null,
		total_trx_quantity: null,
		end_type_name: "",
		stopper_type_name: "",
		quantity: null,
		order_number: null,
		item_description: "",
		order_description: "",
	},
	setUpdateDieCastingProd,
}) {
	const { user } = useAuth();
	const schema = {
		...SFG_PRODUCTION_SCHEMA,
		production_quantity: SFG_PRODUCTION_SCHEMA.production_quantity.max(
			updateDieCastingProd?.quantity -
				updateDieCastingProd?.die_casting_prod
		),
	};
	const { register, handleSubmit, errors, reset, watch } = useRHF(
		schema,
		SFG_PRODUCTION_NULL
	);

	const onClose = () => {
		setUpdateDieCastingProd((prev) => ({
			...prev,
			id: null,
			name: "",
			die_casting_prod: null,
			order_entry_id: null,
			total_trx_quantity: null,
			end_type_name: "",
			stopper_type_name: "",
			quantity: null,
			order_number: null,
			item_description: "",
			order_description: "",
		}));
		reset(SFG_PRODUCTION_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			name: updateDieCastingProd?.name,
			order_entry_id: updateDieCastingProd?.order_entry_id,
			order_number: updateDieCastingProd?.order_number,
			item_description: updateDieCastingProd?.item_description,
			order_description: updateDieCastingProd?.order_description,
			die_casting_prod:
				updateDieCastingProd?.die_casting_prod +
				data.production_quantity,
			quantity: updateDieCastingProd?.quantity,
			total_trx_quantity: updateDieCastingProd?.total_trx_quantity,
			end_type_name: updateDieCastingProd?.end_type_name,
			stopper_type_name: updateDieCastingProd?.stopper_type_name,
			used_quantity: 0,
			section: "die_casting",
			issued_by: user?.id,
			created_at: GetDateTime(),
		};

		if (updatedData.production_quantity > 0) {
			await useUpdateFunc({
				uri: `/sfg/production`,
				itemId: updateDieCastingProd?.id,
				data: data,
				updatedData: updatedData,
				setItems: setDieCastingProd,
				onClose: onClose,
			});
		} else {
			alert("Quantity should be less than stock quantity");
			return;
		}
	};

	return (
		<AddModal
			id="DieCastingProdModal"
			title={"Die Casting Production"}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<Input
				label="production_quantity"
				placeholder={`Max: ${
					updateDieCastingProd?.quantity -
					updateDieCastingProd?.die_casting_prod
				}`}
				{...{ register, errors }}
			/>
			<Input label="wastage" {...{ register, errors }} />
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
