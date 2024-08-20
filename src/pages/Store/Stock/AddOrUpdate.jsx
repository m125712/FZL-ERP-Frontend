import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';
import { FormField, Input, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import getTransactionArea from '@/util/TransactionArea';
import { DevTool } from '@hookform/devtools';
import { MATERIAL_STOCK_NULL, MATERIAL_STOCK_SCHEMA } from '@util/Schema';

export default function Index({
	modalId = '',
	setMaterialStock,
	updateMaterialStock = {
		id: null,
		name: null,
		stock: null,
	},
	setUpdateMaterialStock,
}) {
	const { user } = useAuth();

	const schema = {
		...MATERIAL_STOCK_SCHEMA,
		quantity: MATERIAL_STOCK_SCHEMA.quantity
			.moreThan(0)
			.max(updateMaterialStock?.stock),
	};

	const { register, handleSubmit, errors, control, Controller, reset } =
		useRHF(schema, MATERIAL_STOCK_NULL);

	useFetchForRhfReset(
		`/material/stock/${updateMaterialStock?.id}`,
		updateMaterialStock?.id,
		reset
	);

	const onClose = () => {
		setUpdateMaterialStock((prev) => ({
			...prev,
			id: null,
			name: null,
			stock: null,
		}));
		reset(MATERIAL_STOCK_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateMaterialStock?.id !== null) {
			const updatedData = {
				...data,
				material_stock_id: updateMaterialStock.id,
				name: updateMaterialStock?.name.replace(/[#&/]/g, ''),
				stock: updateMaterialStock.stock - data?.quantity,
				[`${data.trx_to}`]:
					updateMaterialStock[`${data.trx_to}`] + data?.quantity,
				issued_by: user?.id,
				created_at: GetDateTime(),
			};

			await useUpdateFunc({
				uri: `/material/trx`,
				itemId: updateMaterialStock?.id,
				data: data,
				updatedData: updatedData,
				setItems: setMaterialStock,
				onClose: onClose,
			});

			return;
		}
	};

	const transactionArea = getTransactionArea();

	return (
		<AddModal
			id={modalId}
			title={'Material Trx of ' + updateMaterialStock?.name}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<FormField label='trx_to' title='Transfer To' errors={errors}>
				<Controller
					name={'trx_to'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Transaction Area'
								options={transactionArea}
								onChange={(e) => onChange(e.value)}
							/>
						);
					}}
				/>
			</FormField>

			<Input
				label='quantity'
				sub_label={`Max: ${updateMaterialStock?.stock}`}
				placeholder={`Max: ${updateMaterialStock?.stock}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
