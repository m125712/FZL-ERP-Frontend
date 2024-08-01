import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import { useRHF, useUpdateFunc } from "@/hooks";
import { Input, JoinInput } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { SFG_PRODUCTION_NULL, SFG_PRODUCTION_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setDyeingAndIronProd,
	updateDyeingAndIronProd = {
		id: null,
		name: "",
		dying_and_iron_stock: null,
		dying_and_iron_prod: null,
		order_entry_id: null,
		total_trx_quantity: null,
		order_number: null,
		item_description: "",
		order_description: "",
	},
	setUpdateDyeingAndIronProd,
}) {
	const { user } = useAuth();
	const schema = {
		...SFG_PRODUCTION_SCHEMA,
		production_quantity: SFG_PRODUCTION_SCHEMA.production_quantity
			.moreThan(0)
			.max(updateDyeingAndIronProd?.dying_and_iron_stock),
	};
	const { register, handleSubmit, errors, reset, watch } = useRHF(
		schema,
		SFG_PRODUCTION_NULL
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
			order_description: "",
		}));
		reset(SFG_PRODUCTION_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			name: updateDyeingAndIronProd?.item_description,
			order_entry_id: updateDyeingAndIronProd?.order_entry_id,
			order_number: updateDyeingAndIronProd?.order_number,
			item_description: updateDyeingAndIronProd?.item_description,
			order_description: updateDyeingAndIronProd?.order_description,
			dying_and_iron_stock:
				Number(updateDyeingAndIronProd?.dying_and_iron_stock) -
				(Number(data.production_quantity) + Number(data.wastage)),
			dying_and_iron_prod:
				Number(updateDyeingAndIronProd?.dying_and_iron_prod) +
				Number(data.production_quantity),
			total_trx_quantity: updateDyeingAndIronProd?.total_trx_quantity,
			used_quantity: 0,
			section: "dying_and_iron",
			issued_by: user?.id,
			created_at: GetDateTime(),
		};

		await useUpdateFunc({
			uri: `/sfg/production`,
			itemId: updateDyeingAndIronProd?.id,
			data: data,
			updatedData: updatedData,
			setItems: setDyeingAndIronProd,
			onClose: onClose,
		});
	};

	return (
		<AddModal
			id="DyeingAndIronProdModal"
			title={
				updateDyeingAndIronProd?.id !== null &&
				"Dyeing and Iron Production"
			}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<JoinInput
				label="production_quantity"
				unit="KG"
				max={updateDyeingAndIronProd?.dying_and_iron_stock}
				placeholder={`Max: ${updateDyeingAndIronProd?.dying_and_iron_stock}`}
				{...{ register, errors }}
			/>
			<JoinInput
				label="wastage"
				unit="KG"
				max={updateDyeingAndIronProd?.dying_and_iron_stock}
				placeholder={`Max: ${(
					updateDyeingAndIronProd?.dying_and_iron_stock -
					watch("production_quantity")
				).toFixed(2)}`}
				{...{ register, errors }}
			/>
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
