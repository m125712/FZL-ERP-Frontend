import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { CalenderIcon } from '@/assets/icons';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import { useDropzone } from 'react-dropzone';

import cn from '@/lib/cn';

import 'react-datepicker/dist/react-datepicker.css';

import { Eye, EyeOff, FileUp, ImagePlus, Repeat } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { API_IMG_URL } from '@/lib/secret';

import {
	DatePickerCustomHeader,
	DatePickerDefaultConfig,
	FormField,
} from './base';
import { capitalize } from './utils';

export const Input = ({ register, ...props }) => (
	<FormField {...props}>
		<input
			className={cn(
				'input input-secondary w-full rounded border-secondary/30 bg-base-100 px-2 text-sm text-primary transition-all duration-100 ease-in-out placeholder:text-sm placeholder:text-secondary/50 focus:border-secondary/30 focus:outline-secondary/30',
				props?.width,
				props?.height,
				props?.className
			)}
			id={props.label}
			name={props.label}
			disabled={props.disabled}
			{...register(props?.label)}
			{...props}
		/>
	</FormField>
);

export const File = ({ field, isUpdate, IframeClassName, ...props }) => {
	const [preview, setPreview] = useState('');
	const form = useFormContext();

	const onDrop = useCallback(
		(acceptedFiles) => {
			const reader = new FileReader();
			try {
				reader.onload = () => setPreview(reader.result);
				reader.readAsDataURL(acceptedFiles[0]);
				field.onChange(acceptedFiles[0]);
				form.clearErrors(field.name);
			} catch (error) {
				setPreview(null);
				form.resetField(field.name);
			}
		},
		[field, form]
	);

	useEffect(() => {
		if (isUpdate) {
			if (field.value) {
				setPreview(API_IMG_URL + field.value);
			}
		}
	}, [isUpdate, field.value]);

	const {
		acceptedFiles,
		getRootProps,
		getInputProps,
		fileRejections,
		inputRef,
	} = useDropzone({
		onDrop,
		maxFiles: 1,
		maxSize: 10000000,
	});
	return (
		<FormField
			{...props}
			className='relative flex w-full flex-col space-y-1.5'
		>
			{preview && (
				<div className='absolute bottom-10 right-10 z-50 size-10'>
					<button
						className='rounded bg-teal-500 p-2'
						type={'button'}
						variant={'default'}
						size={'icon'}
						onClick={() => {
							inputRef.current?.click();
						}}
					>
						<Repeat className='size-4' />
					</button>
				</div>
			)}
			<div
				{...getRootProps()}
				className='flex flex-1 items-center justify-center'
			>
				<label
					htmlFor='dropzone-file'
					className='relative flex size-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500'
				>
					<div className='flex size-full flex-col items-center justify-center p-4'>
						{preview ? (
							<iframe
								className={cn(
									'size-full h-[300px] rounded-lg',
									IframeClassName
								)}
								src={preview}
							/>
						) : (
							<>
								<FileUp
									className={cn(
										`block size-7`,
										preview && 'hidden'
									)}
								/>
								<p className='my-2 text-sm text-gray-500 dark:text-gray-400'>
									<span className='font-semibold'>
										Click to upload
									</span>{' '}
									or drag and drop
								</p>
								<p className='text-xs text-gray-500 dark:text-gray-400'>
									Document, PDF, Word
								</p>
							</>
						)}
					</div>
					<input
						disabled={props.disabled}
						{...getInputProps()}
						type='file'
					/>
				</label>
			</div>
			{/* <div className='border text-black' {...getRootProps()}>
				<input {...getInputProps()} />
				<p>Drag 'n' drop some files here, or click to select files</p>
			</div> */}
		</FormField>
	);
};

export const DateInput = ({
	register,
	selected,
	disabled = false,
	anotherOnChange = () => {},
	startDate = null,
	...props
}) => {
	const ExampleCustomInput = ({ ref, value, onClick }) => (
		<button
			type='button'
			className={cn(
				'input input-secondary flex w-full items-center justify-between rounded border-secondary/30 bg-base-100 px-2 text-left text-sm text-primary transition-all duration-100 ease-in-out placeholder:text-sm placeholder:text-secondary/50',
				disabled
					? 'input-disabled cursor-not-allowed border-error'
					: 'cursor-pointer'
			)}
			onClick={onClick}
			ref={ref}
		>
			{value || 'Select Date'}
			<CalenderIcon className='w-4' />
		</button>
	);
	return (
		<FormField {...props}>
			<props.Controller
				name={props.label}
				control={props.control}
				render={({ field: { onChange } }) => (
					<DatePicker
						customInput={<ExampleCustomInput />}
						disabled={disabled}
						selected={selected}
						startDate={startDate}
						onChange={(date) => {
							onChange(format(date, 'yyyy-MM-dd HH:mm:ss'));
							anotherOnChange(date);
						}}
						renderCustomHeader={DatePickerCustomHeader}
						{...DatePickerDefaultConfig}
					/>
				)}
			/>
		</FormField>
	);
};

export const PasswordInput = ({ register, ...props }) => {
	const [show, setShow] = useState(false);
	return (
		<FormField {...props}>
			<label className='input input-secondary flex items-center gap-2 rounded border-secondary/30 px-2 text-sm text-primary transition-all duration-100 ease-in-out placeholder:text-sm placeholder:text-primary/20'>
				<input
					type={show ? 'text' : 'password'}
					className={cn(props?.width ? props.width : 'w-full')}
					id={props.label}
					name={props.label}
					disabled={props.disabled}
					{...register(props?.label)}
					{...props}
				/>
				<button
					type='button'
					className='btn btn-ghost btn-xs'
					onClick={() => setShow(!show)}
				>
					{show ? (
						<Eye className='size-4' />
					) : (
						<EyeOff className='size-4' />
					)}
				</button>
			</label>
		</FormField>
	);
};

const renderError = (error) => {
	return (
		error?.message && (
			<label className='label px-2 pb-0 pt-[0.02rem]'>
				<span className='label-text-alt' />
				<span className='label-text-alt text-xs font-medium capitalize text-error/80'>
					{error?.message}
				</span>
			</label>
		)
	);
};

export const CheckBox = ({
	register,
	errors,
	type = 'checkbox-accent',
	isTitleNeeded = true,
	text = 'text-secondary',
	className,
	...props
}) => (
	<div className={cn('form-control', className)}>
		<label
			className={cn(
				'label flex cursor-pointer justify-start gap-2',
				props.height ? props.height : 'h-8'
			)}
		>
			<input
				type='checkbox'
				className={cn(
					`checkbox-primary checkbox checkbox-sm rounded-full border`,
					type
				)}
				{...register(props.label)}
				{...props}
			/>
			<span
				className={cn('w-full text-sm font-semibold capitalize', text)}
			>
				{isTitleNeeded === true
					? props.title
						? capitalize(props.title)
						: capitalize(props.label)
					: ''}
			</span>
		</label>
		{renderError(errors?.[props.label])}
	</div>
);

export const CheckBoxWithoutLabel = ({
	register,
	className = 'checkbox-primary',
	...props
}) => (
	<div className='form-control'>
		<label
			className={cn(
				'label cursor-pointer',
				props.height ? props.height : 'h-8'
			)}
		>
			<input
				type='checkbox'
				className={cn(`checkbox checkbox-sm`, className)}
				{...register(props.label)}
				{...props}
			/>
		</label>
	</div>
);

export const CheckboxWithoutForm = ({ className, ...props }) => (
	<input
		type='checkbox'
		className={cn(`checkbox-secondary checkbox checkbox-sm`, className)}
		{...props}
	/>
);

export const Switch = ({ register, ...props }) => (
	<FormField {...props}>
		<input
			type='checkbox'
			className='toggle toggle-success bg-error'
			{...register(props.label)}
			{...props}
		/>
	</FormField>
);

export const SwitchOnly = ({ register, className, ...props }) => (
	<input
		type='checkbox'
		className={cn('toggle toggle-primary', className)}
		{...register(props.label)}
		{...props}
	/>
);

export const Select = ({ register, ...props }) => (
	<FormField {...props}>
		<select
			className='select select-bordered select-primary w-full bg-primary/5'
			{...register(props.label)}
		>
			{props.option?.map((item, index) => (
				<option key={index} value={item.value}>
					{item.label}
				</option>
			))}
		</select>
	</FormField>
);

export const Radio = ({
	name,
	options,
	control,
	Controller,
	defaultValue,
	register,
	...props
}) => {
	return (
		<FormField {...props}>
			<Controller
				name={name}
				control={control}
				defaultValue={defaultValue}
				render={({ field }) => (
					<div className='flex flex-col'>
						<div className='flex gap-2 border-secondary/30'>
							{options?.map((item) => (
								<div
									key={item.value}
									className='flex gap-2 p-2'
								>
									<input
										type='radio'
										value={item.value}
										checked={field.value === item.value}
										onChange={() =>
											field.onChange(item.value)
										}
										className='radio flex-shrink-0 checked:bg-primary'
										{...register(name)}
									/>
									<span className='label-text break-words text-sm leading-tight text-black sm:text-sm'>
										{item.label}
									</span>
								</div>
							))}
						</div>
						<span className='label-text-alt text-xs font-medium capitalize text-error/80'>
							{props.errors?.[name]?.message}
						</span>
					</div>
				)}
			/>
		</FormField>
	);
};

export const Textarea = ({ register, ...props }) => (
	<FormField {...props}>
		<textarea
			className='textarea textarea-secondary w-full border-secondary/30 bg-base-100 text-primary focus:border-secondary/30 focus:outline-secondary/30'
			rows={props.rows ? props.rows : 1}
			{...register(props.label)}
			{...props}
		/>
	</FormField>
);

export const FileInput = ({ register, ...props }) => (
	<FormField {...props}>
		<input
			type='file'
			className='file-input file-input-bordered file-input-primary file-input-sm w-full bg-base-100'
			{...register(props.label)}
			{...props}
		/>
	</FormField>
);

export const JoinInput = ({ register, ...props }) => (
	<FormField {...props}>
		<div className='join w-full'>
			<input
				className={cn(
					'input join-item input-secondary rounded border-secondary/30 bg-base-100 px-2 text-sm text-primary transition-all duration-100 ease-in-out placeholder:text-sm placeholder:text-primary/20 focus:border-secondary/30 focus:outline-secondary/30',
					props?.width ? props.width : 'w-full'
				)}
				{...register(props.label)}
				{...props}
			/>
			<span className='btn-bordered btn btn-accent join-item'>
				{props.unit}
			</span>
		</div>
	</FormField>
);

export const JoinInputSelect = ({ register, ...props }) => (
	<FormField {...props}>
		<div className='join'>
			<input
				className='input join-item input-secondary w-full border-secondary/30 bg-base-100 text-primary transition-all duration-100 ease-in-out focus:border-secondary/30 focus:outline-secondary/30'
				id={props.label}
				{...register(props?.label)}
			/>

			<select
				className='join-item select select-accent border-0 bg-accent text-white'
				{...register(props.join)}
			>
				{props.option?.map((item, index) => (
					<option
						className='bg-base-100 text-primary focus:bg-secondary'
						key={index}
						value={item.value}
					>
						{item.label}
					</option>
				))}
			</select>
		</div>
	</FormField>
);

export const SearchBox = ({ ...props }) => (
	<input
		className={cn(
			'input input-xs input-primary h-10 rounded border-[0.1px] border-primary p-2 text-sm text-primary shadow-md duration-100 placeholder:text-primary placeholder:text-primary/40',
			props?.width ? props.width : 'w-full'
		)}
		{...props}
	/>
);

export const DescriptionStyle = ({ description }) => (
	<span className='text-md rounded bg-indigo-50 px-1 font-sans font-semibold capitalize text-indigo-600'>
		{description}
	</span>
);

export { FormField };
