import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import {
	useDyeingProductCapacity,
	useDyeingProductCapacityByUUID,
} from '@/state/Dyeing';
import {
	useOtherOrderPropertiesByEndType,
	useOtherOrderPropertiesByItem,
	useOtherOrderPropertiesByNylonStopper,
	useOtherOrderPropertiesByZipperNumber,
} from '@/state/Other';
import { DevTool } from '@hookform/devtools';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, JoinInput, ReactSelect } from '@/ui';

import nanoid from '@/lib/nanoid';
import {
	PRODUCTION_CAPACITY_NULL,
	PRODUCTION_CAPACITY_SCHEMA,
	STRING,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	update = {
		uuid: null,
	},
	setUpdate,
}) {
	const [itemType, setItemType] = useState('');

	const { data, url, updateData, postData } = useDyeingProductCapacityByUUID(
		update?.uuid
	);
	const { invalidateQuery } = useDyeingProductCapacity();
	const { data: item } = useOtherOrderPropertiesByItem();
	const { data: zipper_number } = useOtherOrderPropertiesByZipperNumber();
	const { data: nylon_stopper } = useOtherOrderPropertiesByNylonStopper();
	const { data: end_type } = useOtherOrderPropertiesByEndType();

	const { user } = useAuth();
	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		Controller,
		getValues,
		watch,
		context,
	} = useRHF(
		{
			...PRODUCTION_CAPACITY_SCHEMA,
			nylon_stopper: STRING.when({
				is: () => itemType.toLowerCase() === 'nylon',
				then: (schema) => schema.required('Required'),
				otherwise: (schema) => schema.nullable(),
			}),
		},
		PRODUCTION_CAPACITY_NULL
	);

	useEffect(() => {
		if (data && update?.uuid) {
			reset(data);
		}
	}, [data]);

	const product = [
		{ label: 'Zipper', value: 'zipper' },
		{ label: 'Thread', value: 'Thread' },
	];
	const onClose = () => {
		setUpdate((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(PRODUCTION_CAPACITY_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (update?.uuid !== null && update?.uuid !== undefined) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url,
				updatedData,
				onClose,
			});

			invalidateQuery();
			return;
		}

		// Add new item
		const updatedData = {
			...data,
			uuid: nanoid(),
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url: '/public/production-capacity',
			newData: updatedData,
			onClose,
		});
		invalidateQuery();
	};

	return (
		<AddModal
			id={modalId}
			title={
				update?.uuid !== null
					? 'Update Product Capacity'
					: 'Product Capacity'
			}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={false}>
			<div className='grid grid-cols-2 gap-4'>
				<FormField label='product' title='Product' errors={errors}>
					<Controller
						name={'product'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select product'
									options={product}
									value={product?.filter(
										(item) =>
											item.value === getValues('product')
									)}
									onChange={(e) => {
										onChange(e.value);
									}}
								/>
							);
						}}
					/>
				</FormField>
				<FormField label='item' title='Item' errors={errors}>
					<Controller
						name={'item'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select item'
									options={item}
									value={item?.filter(
										(item) =>
											item.value === getValues('item')
									)}
									onChange={(e) => {
										onChange(e.value);
										setItemType(e.label);
									}}
								/>
							);
						}}
					/>
				</FormField>
				{item
					?.find((item) => item.value === watch('item'))
					?.label?.toLowerCase() === 'nylon' && (
					<FormField
						label='nylon_stopper'
						title='Nylon Stopper'
						errors={errors}>
						<Controller
							name={'nylon_stopper'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select stopper'
										options={nylon_stopper}
										value={nylon_stopper?.filter(
											(item) =>
												item.value ===
												getValues('nylon_stopper')
										)}
										onChange={(e) => {
											onChange(e.value);
										}}
									/>
								);
							}}
						/>
					</FormField>
				)}
				<FormField
					label='zipper_number'
					title='Zipper No.'
					errors={errors}>
					<Controller
						name={'zipper_number'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select zipper no.'
									options={zipper_number}
									value={zipper_number?.filter(
										(item) =>
											item.value ===
											getValues('zipper_number')
									)}
									onChange={(e) => {
										onChange(e.value);
									}}
								/>
							);
						}}
					/>
				</FormField>
				<FormField label='end_type' title='Ent Type' errors={errors}>
					<Controller
						name={'end_type'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select end type'
									options={end_type}
									value={end_type?.filter(
										(item) =>
											item.value === getValues('end_type')
									)}
									onChange={(e) => {
										onChange(e.value);
									}}
								/>
							);
						}}
					/>
				</FormField>
				<JoinInput
					label='quantity'
					title='Quantity'
					unit='PCS'
					{...{ register, errors }}
				/>
			</div>

			<Input label='remarks' {...{ register, errors }} />

			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
