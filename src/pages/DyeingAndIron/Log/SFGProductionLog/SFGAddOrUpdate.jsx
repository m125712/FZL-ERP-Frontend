import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import { useFetchForRhfReset, useRHF, useUpdateFunc } from "@/hooks";
import { FormField, Input, ReactSelect } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import {
	SFG_PRODUCTION_LOG_NULL,
	SFG_PRODUCTION_LOG_SCHEMA,
} from "@util/Schema";

export default function Index({
	modalId = "",
	setDyeingAndIron,
	updateDyeingAndIronLog = {
		id: null,
		order_entry_id: null,
		order_description: null,
		item_description: null,
		order_number: null,
		section: null,
		production_quantity: null,
		dying_and_iron_stock: null,
		wastage: null,
	},
	setUpdateDyeingAndIronLog,
}) {
	const MAX_QUANTITY =
		updateDyeingAndIronLog?.dying_and_iron_stock +
		updateDyeingAndIronLog?.production_quantity;
	const schema = {
		...SFG_PRODUCTION_LOG_SCHEMA,
		production_quantity: SFG_PRODUCTION_LOG_SCHEMA.production_quantity
			.moreThan(0)
			.max(MAX_QUANTITY),
	};
	const { user } = useAuth();
	const { register, handleSubmit, errors, control, Controller, reset } =
		useRHF(schema, SFG_PRODUCTION_LOG_NULL);

	const onClose = () => {
		setUpdateDyeingAndIronLog((prev) => ({
			...prev,
			id: null,
			order_entry_id: null,
			order_description: null,
			item_description: null,
			order_number: null,
			section: null,
			production_quantity: null,
			dying_and_iron_stock: null,
			wastage: null,
		}));
		reset(SFG_PRODUCTION_LOG_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateDyeingAndIronLog?.id !== null) {
			const updatedData = {
				...data,
				order_entry_id: updateDyeingAndIronLog?.order_entry_id,
				used_quantity: 0,
				wastage: updateDyeingAndIronLog?.wastage,
				issued_by: user?.id,
				issued_by_name: user?.name,
				order_description: updateDyeingAndIronLog?.order_description,
				item_description: updateDyeingAndIronLog?.item_description,
				order_number: updateDyeingAndIronLog?.order_number,
				updated_at: GetDateTime(),
			};

			await useUpdateFunc({
				uri: `/sfg/production/${updateDyeingAndIronLog?.id}/${updateDyeingAndIronLog?.order_description.replace(/[/_\/()]/g, "")}`,
				itemId: updateDyeingAndIronLog?.id,
				data: data,
				updatedData: updatedData,
				setItems: setDyeingAndIron,
				onClose: onClose,
			});

			return;
		}
	};

	const sectionName = [
		{ label: "Dying and Iron", value: "dying_and_iron" },
		{ label: "Teeth Molding", value: "teeth_molding" },
		{ label: "Teeth Cleaning", value: "teeth_cleaning" },
		{ label: "Finishing", value: "finishing" },
		{ label: "Slider Assembly", value: "slider_assembly" },
		{ label: "Coloring", value: "coloring" },
	];

	return (
		<AddModal
			id={modalId}
			title={`Teeth Molding Production Log`}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<FormField label="section" title="Section" errors={errors}>
				<Controller
					name={"section"}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder="Select Production Area"
								options={sectionName}
								value={sectionName?.find(
									(item) =>
										item.value ==
										updateDyeingAndIronLog?.section
								)}
								onChange={(e) => onChange(e.value)}
								isDisabled={updateDyeingAndIronLog?.id !== null}
							/>
						);
					}}
				/>
			</FormField>
			<Input
				label="used_quantity"
				sub_label={`Max: ${updateDyeingAndIronLog?.dying_and_iron_stock}`}
				{...{ register, errors }}
			/>
			<Input
				label="production_quantity"
				sub_label={`Max: ${MAX_QUANTITY}`}
				{...{ register, errors }}
			/>
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
