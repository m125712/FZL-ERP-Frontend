import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useCommonMultiColorDashboardByUUID } from '@/state/Common';
import { useOtherMaterial, useOtherTapeCoil } from '@/state/Other';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, JoinInput, ReactSelect, Textarea } from '@/ui';

import { DevTool } from '@/lib/react-hook-devtool';
import {
	MULTI_COLOR_DASHBOARD_NULL,
	MULTI_COLOR_DASHBOARD_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	order = {
		uuid: null,
	},
	setOrder,
}) {
	const { data, updateData } = useCommonMultiColorDashboardByUUID(
		order?.uuid
	);

	const MAX_PROD_KG = Number(order.balance_quantity).toFixed(3);

	const {
		register,
		handleSubmit,
		errors,
		reset,
		watch,
		control,
		context,
		Controller,
		getValues,
	} = useRHF(MULTI_COLOR_DASHBOARD_SCHEMA, MULTI_COLOR_DASHBOARD_NULL);

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data]);

	const MAX_WASTAGE_KG = Number(
		MAX_PROD_KG - (watch('production_quantity_in_kg') || 0)
	).toFixed(3);

	const onClose = () => {
		setOrder((prev) => ({
			...prev,
			uuid: null,
		}));

		reset(MULTI_COLOR_DASHBOARD_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			updated_at: GetDateTime(),
		};

		await updateData.mutateAsync({
			url: `/zipper/multi-color-dashboard/${order?.uuid}`,
			updatedData: updatedData,
			onClose,
		});

		await updateData.mutateAsync({
			url: `/zipper/order/description/update/by/${updatedData?.tape_coil_uuid}`,
			updatedData: {
				order_description_uuid: order?.order_description_uuid,
			},
			onClose,
		});
	};

	const { data: coil } = useOtherMaterial();
	const { data: unFilteredTape } = useOtherTapeCoil();
	const tape = unFilteredTape?.filter((item) => {
		if (
			item.item === order.item &&
			item.zipper_number === order.zipper_number
		) {
			return item;
		}
	});

	return (
		<AddModal
			id={modalId}
			title={'Order'}
			subTitle={`
				${order.order_number} -> 
				${order.item_description} 
				`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={false}
		>
			<JoinInput
				title='Expected Tape QTY'
				label='expected_tape_quantity'
				unit='KG'
				// sub_label={`MAX: ${Number(order?.coloring_stock)} PCS`}
				{...{ register, errors }}
			/>
			<div className='flex gap-4'>
				<FormField label='tape_coil_uuid' title='Tape' errors={errors}>
					<Controller
						name={'tape_coil_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Logo Type'
									options={tape}
									value={tape?.filter(
										(item) =>
											item.value ==
											getValues('tape_coil_uuid')
									)}
									onChange={(e) => onChange(e.value)}
									// isDisabled={order_info_id !== undefined}
								/>
							);
						}}
					/>
				</FormField>
				<JoinInput
					title='Tape QTY'
					label='tape_quantity'
					unit='KG'
					{...{ register, errors }}
				/>
			</div>

			<div className='flex gap-4'>
				<FormField label='coil_uuid' title='Coil' errors={errors}>
					<Controller
						name={'coil_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Coil'
									options={coil}
									value={coil?.filter(
										(item) =>
											item.value == getValues('coil_uuid')
									)}
									onChange={(e) => onChange(e.value)}
									// isDisabled={order_info_id !== undefined}
								/>
							);
						}}
					/>
				</FormField>
				<JoinInput
					title='Coil QTY'
					label='coil_quantity'
					unit='KG'
					{...{ register, errors }}
				/>
			</div>
			<div className='flex gap-4'>
				<FormField label='thread_uuid' title='Thread' errors={errors}>
					<Controller
						name={'thread_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Thread'
									options={coil}
									value={coil?.filter(
										(item) =>
											item.value ==
											getValues('thread_uuid')
									)}
									onChange={(e) => onChange(e.value)}
									// isDisabled={order_info_id !== undefined}
								/>
							);
						}}
					/>
				</FormField>
				<JoinInput
					title='Thread QTY'
					label='thread_quantity'
					unit='PCS'
					{...{ register, errors }}
				/>
			</div>
			<Textarea
				title='Description'
				label='remarks'
				{...{ register, errors }}
			/>
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
