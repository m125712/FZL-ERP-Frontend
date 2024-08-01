import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import { useFetchForRhfReset, useRHF, useUpdateFunc } from "@/hooks";
import { FormField, Input, JoinInput, ReactSelect } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { SFG_TRANSFER_LOG_NULL, SFG_TRANSFER_LOG_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setTeethMoldingLog,
	updateTeethMoldingLog = {
		id: null,
		trx_from: null,
		trx_to: null,
		trx_quantity: null,
		order_description: null,
		order_quantity: null,
		teeth_molding_prod: null,
		finishing_stock: null,
		order_entry_id: null,
	},
	setUpdateTeethMoldingLog,
}) {
	const MAX_QUANTITY =
		updateTeethMoldingLog?.teeth_molding_prod +
		updateTeethMoldingLog?.trx_quantity;
	const schema = {
		...SFG_TRANSFER_LOG_SCHEMA,
		trx_quantity: SFG_TRANSFER_LOG_SCHEMA.trx_quantity.max(MAX_QUANTITY),
	};
	const { user } = useAuth();
	const {
		register,
		handleSubmit,
		errors,
		control,
		Controller,
		reset,
		getValues,
	} = useRHF(schema, SFG_TRANSFER_LOG_NULL);

	useFetchForRhfReset(
		`/sfg/trx/by/id/${updateTeethMoldingLog?.id}`,
		updateTeethMoldingLog?.id,
		reset
	);

	const onClose = () => {
		setUpdateTeethMoldingLog((prev) => ({
			...prev,
			id: null,
			trx_from: null,
			trx_to: null,
			trx_quantity: null,
			order_description: null,
			order_quantity: null,
			teeth_molding_prod: null,
			finishing_stock: null,
			order_entry_id: null,
		}));
		reset(SFG_TRANSFER_LOG_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateTeethMoldingLog?.id !== null) {
			const updatedData = {
				...data,
				order_entry_id: updateTeethMoldingLog?.order_entry_id,
				updated_at: GetDateTime(),
			};

			await useUpdateFunc({
				uri: `/sfg/trx/${updateTeethMoldingLog?.id}/${updateTeethMoldingLog?.order_description}`,
				itemId: updateTeethMoldingLog?.id,
				data: data,
				updatedData: updatedData,
				setItems: setTeethMoldingLog,
				onClose: onClose,
			});

			return;
		}
	};

	const transactionArea = [
		{ label: "Dying and Iron", value: "dying_and_iron_stock" },
		{ label: "Teeth Molding", value: "teeth_molding_stock" },
		{ label: "Teeth Coloring", value: "teeth_coloring_stock" },
		{ label: "Finishing", value: "finishing_stock" },
		{ label: "Slider Assembly", value: "slider_assembly_stock" },
		{ label: "Coloring", value: "coloring_stock" },
	];

	return (
		<AddModal
			id={modalId}
			title={`Teeth Molding SFG Transfer Log`}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<FormField label="trx_to" title="Trx to" errors={errors}>
				<Controller
					name={"trx_to"}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder="Select Transaction Area"
								options={transactionArea}
								value={transactionArea?.find(
									(item) => item.value == getValues("trx_to")
								)}
								onChange={(e) => onChange(e.value)}
								isDisabled={updateTeethMoldingLog?.id !== null}
							/>
						);
					}}
				/>
			</FormField>
			<JoinInput
				label="trx_quantity"
				unit="PCS"
				sub_label={`Max: ${MAX_QUANTITY}`}
				{...{ register, errors }}
			/>
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
