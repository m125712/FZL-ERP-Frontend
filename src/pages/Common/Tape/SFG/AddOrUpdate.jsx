import { useAuth } from '@/context/auth';
import { useCommonCoilSFG, useCommonTapeSFG } from '@/state/Common';
import {
	useOtherMaterial,
	useOtherOrderPropertiesByItem,
	useOtherOrderPropertiesByNylonStopper,
	useOtherOrderPropertiesByZipperNumber,
	useOtherTapeCoil,
} from '@/state/Other';
import { useFetchForRhfReset, useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, ReactSelect, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import { TAPE_STOCK_ADD_NULL, TAPE_STOCK_ADD_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateTapeProd = {
		uuid: null,
	},
	setUpdateTapeProd,
}) {
	const { user } = useAuth();

	const { url, updateData, postData } = useCommonTapeSFG();
	const { data: item } = useOtherOrderPropertiesByItem();
	const { data: nylon_stopper } = useOtherOrderPropertiesByNylonStopper();
	const { data: zipper_number } = useOtherOrderPropertiesByZipperNumber();
	const { data: materials } = useOtherMaterial();

	const { invalidateQuery: invalidateOtherTapeCoil } = useOtherTapeCoil();
	const { invalidateQuery: invalidateCommonCoilSFG } = useCommonCoilSFG();
	const { invalidateQuery: invalidateCommonTapeSFG } = useCommonTapeSFG();
	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		context,
		Controller,
		getValues,
	} = useRHF(TAPE_STOCK_ADD_SCHEMA, TAPE_STOCK_ADD_NULL);

	useFetchForRhfReset(
		`${url}/${updateTapeProd?.uuid}`,
		updateTapeProd?.uuid,
		reset
	);

	const isImportOption = [
		{ label: 'Import ', value: 1 },
		{ label: 'Local ', value: 0 },
	];
	const isReverseOption = [
		{ label: 'Reverse', value: 'reverse' },
		{ label: 'Forward', value: 'forward' },
		{ label: 'None', value: 'none' },
	];
	const onClose = () => {
		setUpdateTapeProd((prev) => ({
			...prev,
			uuid: null,
			type: '',
			zipper_number: null,
			quantity: null,
			trx_quantity_in_coil: null,
			quantity_in_coil: null,
			remarks: '',
		}));
		reset(TAPE_STOCK_ADD_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		if (
			updateTapeProd?.uuid !== null &&
			updateTapeProd?.uuid !== undefined
		) {
			const updatedData = {
				...data,
				updated_by: user?.uuid,
				updated_at: GetDateTime(),
			};
			await updateData.mutateAsync({
				url: `${url}/${updateTapeProd?.uuid}`,
				uuid: updateTapeProd?.uuid,
				updatedData,
				onClose,
			});

			return;
		}
		const updatedData = {
			...data,
			uuid: nanoid(),
			quantity: 0,
			trx_quantity_in_coil: 0,
			quantity_in_coil: 0,
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url: `/zipper/tape-coil`,
			newData: updatedData,
			onClose,
		});
		invalidateOtherTapeCoil();
		invalidateCommonCoilSFG();
		invalidateCommonTapeSFG();
	};

	return (
		<AddModal
			id={modalId}
			title={`${updateTapeProd?.uuid ? 'Tape Update' : 'Tape Add'}`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
		>
			<div className='flex gap-2'>
				<Textarea label='name' title='Name' {...{ register, errors }} />
				<FormField
					label='material_uuid'
					title='Material'
					errors={errors}
				>
					<Controller
						name={'material_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Item'
									options={materials}
									value={materials?.filter(
										(item) =>
											item.value ==
											getValues('material_uuid')
									)}
									onChange={(e) => onChange(e.value)}
									// isDisabled={order_info_id !== undefined}
								/>
							);
						}}
					/>
				</FormField>
			</div>
			<div className='flex flex-col gap-2 md:flex-row'>
				<FormField label='item_uuid' title='Item' errors={errors}>
					<Controller
						name={'item_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Item'
									options={item}
									value={item?.filter(
										(item) =>
											item.value == getValues('item_uuid')
									)}
									onChange={(e) => onChange(e.value)}
								/>
							);
						}}
					/>
				</FormField>
				<FormField
					label='nylon_stopper_uuid'
					title='Nylon Stopper'
					errors={errors}
				>
					<Controller
						name={'nylon_stopper_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Item'
									options={nylon_stopper}
									value={nylon_stopper?.filter(
										(item) =>
											item.value ==
											getValues('nylon_stopper_uuid')
									)}
									onChange={(e) => onChange(e.value)}
								/>
							);
						}}
					/>
				</FormField>
				<FormField
					label='zipper_number_uuid'
					title='Zipper Number'
					errors={errors}
				>
					<Controller
						name={'zipper_number_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Zipper Number'
									options={zipper_number}
									value={zipper_number?.filter(
										(item) =>
											item.value ==
											getValues('zipper_number_uuid')
									)}
									onChange={(e) => onChange(e.value)}
								/>
							);
						}}
					/>
				</FormField>
				<FormField label='is_import' title='Is Import' errors={errors}>
					<Controller
						name={'is_import'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Is Import? '
									options={isImportOption}
									value={isImportOption?.filter(
										(item) =>
											item.value == getValues('is_import')
									)}
									onChange={(e) => onChange(e.value)}
								/>
							);
						}}
					/>
				</FormField>
				<FormField
					label='is_reverse'
					title='Is Reverse'
					errors={errors}
				>
					<Controller
						name={'is_reverse'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Is Reverse ?'
									options={isReverseOption}
									value={isReverseOption?.filter(
										(item) =>
											item.value ==
											getValues('is_reverse')
									)}
									onChange={(e) => onChange(e.value)}
								/>
							);
						}}
					/>
				</FormField>
			</div>

			<div className='flex flex-col gap-2 md:flex-row'>
				<Input
					label='raw_per_kg_meter'
					title='Raw Tape (Meter/Kg)'
					{...{ register, errors }}
				/>
				<Input
					label='dyed_per_kg_meter'
					title='Dyed Tape (Meter/Kg)'
					{...{ register, errors }}
				/>
			</div>

			<div className='grid grid-cols-2 gap-2'>
				<FormField
					label='thread_material_uuid'
					title='Thread Material'
					errors={errors}
				>
					<Controller
						name={'thread_material_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Item'
									options={materials}
									value={materials?.filter(
										(item) =>
											item.value ==
											getValues('thread_material_uuid')
									)}
									onChange={(e) => onChange(e.value)}
									// isDisabled={order_info_id !== undefined}
								/>
							);
						}}
					/>
				</FormField>
				<Input
					label='thread_consumption_per_kg'
					title='Thread Con (Per/Kg)'
					{...{ register, errors }}
				/>
				<FormField
					label='cord_material_uuid'
					title='Cord Material'
					errors={errors}
				>
					<Controller
						name={'cord_material_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Item'
									options={materials}
									value={materials?.filter(
										(item) =>
											item.value ==
											getValues('cord_material_uuid')
									)}
									onChange={(e) => onChange(e.value)}
									// isDisabled={order_info_id !== undefined}
								/>
							);
						}}
					/>
				</FormField>
				<Input
					label='cord_consumption_per_kg'
					title='Cord Con (Per/Kg)'
					{...{ register, errors }}
				/>
				<FormField
					label='monofilament_material_uuid'
					title='Monofilament Material'
					errors={errors}
				>
					<Controller
						name={'monofilament_material_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Item'
									options={materials}
									value={materials?.filter(
										(item) =>
											item.value ==
											getValues(
												'monofilament_material_uuid'
											)
									)}
									onChange={(e) => onChange(e.value)}
									// isDisabled={order_info_id !== undefined}
								/>
							);
						}}
					/>
				</FormField>
				<Input
					label='monofilament_consumption_per_kg'
					title='Monofilament Con (Per/Kg)'
					{...{ register, errors }}
				/>
			</div>
			<Textarea label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
