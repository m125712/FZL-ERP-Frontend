import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import { useRHF, useUpdateFunc } from "@/hooks";
import { Input, JoinInput } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { SFG_TRX_NULL, SFG_TRX_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setDyeingAndIronProd,
	updateDyeingAndIronProd = {
		id: null,
		name: "",
		dying_and_iron_stock: null,
		dying_and_iron_prod: null,
		order_entry_id: null,
		order_number: null,
		item_description: "",
		order_description: "",
		stopper_type_name: "",
	},
	setUpdateDyeingAndIronProd,
}) {
	const { user } = useAuth();
	const schema = {
		trx_quantity: SFG_TRX_SCHEMA.trx_quantity
			.moreThan(0)
			.max(updateDyeingAndIronProd?.dying_and_iron_prod),
	};
	const { register, handleSubmit, errors, reset } = useRHF(
		schema,
		SFG_TRX_NULL
	);

	const onClose = () => {
		setUpdateDyeingAndIronProd((prev) => ({
			...prev,
			id: null,
			name: "",
			dying_and_iron_stock: null,
			dying_and_iron_prod: null,
			order_entry_id: null,
			item_description: null,
			total_trx_quantity: null,
			order_number: null,
			item_description: "",
			order_description: "",
			stopper_type_name: "",
		}));
		reset(SFG_TRX_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		var updatedData = {
			...data,
			name: updateDyeingAndIronProd?.item_description,
			order_number: updateDyeingAndIronProd?.order_number,
			item_description: updateDyeingAndIronProd?.item_description,
			order_description: updateDyeingAndIronProd?.order_description,
			order_entry_id: updateDyeingAndIronProd?.order_entry_id,
			dying_and_iron_stock: updateDyeingAndIronProd?.dying_and_iron_stock,
			dying_and_iron_prod:
				updateDyeingAndIronProd?.dying_and_iron_prod -
				data.trx_quantity,
			total_trx_quantity:
				updateDyeingAndIronProd?.total_trx_quantity + data.trx_quantity,
			trx_from: "dying_and_iron_prod",
			trx_to:
				updateDyeingAndIronProd?.item_name == "nylon"
					? "finishing_stock"
					: "teeth_molding_stock",
			issued_by: user?.id,
			issued_by_name: user?.name,
			created_at: GetDateTime(),
		};

		await useUpdateFunc({
			uri: `/sfg/trx`,
			itemId: updateDyeingAndIronProd?.id,
			data: data,
			updatedData: updatedData,
			setItems: setDyeingAndIronProd,
			onClose: onClose,
		});
	};

	let title = "Teeth Molding";
	if (updateDyeingAndIronProd?.item_name == "nylon") {
		if (updateDyeingAndIronProd?.stopper_type_name == "plastic") {
			title = "Plastic Finishing";
		} else {
			title = "Metallic Finishing";
		}
	}

	return (
		<AddModal
			id="DyeingAndIronTrxModal"
			title={
				updateDyeingAndIronProd?.id !== null &&
				`Dyeing And Iron ⇾ ${title}`
			}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<JoinInput
				label="trx_quantity"
				unit="KG"
				max={updateDyeingAndIronProd?.dying_and_iron_prod}
				placeholder={`Max: ${updateDyeingAndIronProd?.dying_and_iron_prod}`}
				{...{ register, errors }}
			/>
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
