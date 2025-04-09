import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useConningProdLog, useDyeingCone } from '@/state/Thread';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, JoinInput, ReactSelect, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import {
	NUMBER,
	NUMBER_DOUBLE,
	NUMBER_DOUBLE_REQUIRED,
	NUMBER_REQUIRED,
	STRING,
	STRING_REQUIRED,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	coningProd = {
		uuid: null,
		batch_entry_uuid: null,
		production_quantity_in_kg: null,
		production_quantity: null,
		wastage: null,
		remarks: null,
	},
	setConingProd,
}) {
	const { postData, invalidateQuery } = useDyeingCone();
	const { invalidateQuery: invalidateConningProdLog } = useConningProdLog();
	const { user } = useAuth();
	const [qty, setQty] = useState();

	const type = [
		{ value: 'normal', label: 'Normal' },
		{ value: 'damage', label: 'Damage' },
	];
	const MAX_PROD = Number(coningProd.balance_quantity);
	const MAX_CARTON = Math.ceil(
		Number(qty) / Number(coningProd.cone_per_carton)
	);

	const {
		register,
		handleSubmit,
		formState,
		errors,
		reset,
		watch,
		getValues,
		control,
		Controller,
		context,
	} = useRHF(
		{
			type: STRING_REQUIRED.default('normal'), // Ensure default value
			production_quantity: NUMBER_REQUIRED.moreThan(0, 'More than 0').max(
				MAX_PROD,
				'Beyond max value'
			),

			coning_carton_quantity: NUMBER.when('type', {
				is: (val) => val === 'normal',
				then: (schema) =>
					schema.required('Required').moreThan(0, 'More than 0'),
				otherwise: (schema) => schema.nullable(),
			}),
			remarks: STRING.nullable(),
		},
		{
			production_quantity: '',
			type: 'normal', // Default value for type
			coning_carton_quantity: 0,
			wastage: '',
			remarks: '',
		}
	);

	// Debugging: Log the value of 'type' to ensure it is resolved correctly
	console.log('Type field value:', watch('type'));

	const onClose = () => {
		setConingProd((prev) => ({
			...prev,
			uuid: null,
			batch_entry_uuid: null,
			production_quantity: null,
			production_quantity_in_kg: null,
			wastage: null,
			remarks: null,
		}));

		reset({
			production_quantity: '',
			coning_carton_quantity: 0,
			wastage: '',
			remarks: '',
		});
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			uuid: nanoid(),
			batch_entry_uuid: coningProd?.batch_entry_uuid,
			created_by: user?.uuid,
			created_at: GetDateTime(),
			onClose,
		};

		await postData.mutateAsync({
			url: '/thread/batch-entry-production',
			newData: updatedData,
			onClose,
		});

		invalidateQuery();
		invalidateConningProdLog();
		return;
	};

	useEffect(() => {
		setQty(watch('production_quantity'));
	}, [watch('production_quantity')]);
	console.log(formState.errors);
	return (
		<AddModal
			id='ConingProdModal'
			title={'Coning Production'}
			subTitle='Coning -> Production'
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<FormField
				label='type'
				title='Type'
				is_title_needed='false'
				errors={errors}>
				<Controller
					name={'type'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Type'
								options={type}
								value={type?.filter(
									(item) => item.value == getValues('type')
								)}
								onChange={(e) => {
									onChange(e.value);
								}}
							/>
						);
					}}
				/>
			</FormField>
			{watch('type') == 'normal' && (
				<JoinInput
					title={`ProductionQuantity`}
					label='production_quantity'
					unit='PCS'
					sub_label={`MAX: ${MAX_PROD} pcs`}
					{...{ register, errors }}
				/>
			)}
			{watch('type') == 'damage' && (
				<JoinInput
					title={'Damage Quantity'}
					label='production_quantity'
					unit='PCS'
					sub_label={`MAX: ${MAX_PROD} pcs`}
					{...{ register, errors }}
				/>
			)}
			{watch('type') == 'normal' && (
				<JoinInput
					title='Carton Quantity'
					label='coning_carton_quantity'
					unit='PCS'
					sub_label={`Suggested: ${MAX_CARTON} pcs`}
					{...{ register, errors }}
				/>
			)}
			<Textarea label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
