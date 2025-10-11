import { CircleX, X } from 'lucide-react';

import { InputImage } from '@/ui/Core';
import { File, FormField } from '@/ui';

export const FileUploadSection = ({
	fileCount,
	addFile,
	removeFile,
	Controller,
	control,
	errors,
	isUpdate,
	MAX_FILES,
	disabled,
}) => (
	<div className='space-y-4'>
		<div className='flex items-center justify-between'>
			<span className='text-sm font-medium text-gray-700'>
				Files ({fileCount}/{MAX_FILES})
			</span>
			{fileCount < MAX_FILES && (
				<button
					type='button'
					onClick={addFile}
					disabled={disabled}
					className='btn btn-outline btn-primary btn-sm'
				>
					+ Add File
				</button>
			)}
		</div>

		{/* FIXED: Changed to flex layout for horizontal display with gap */}
		<div className='flex flex-wrap gap-3'>
			{Array.from({ length: fileCount }, (_, index) => (
				<FileField
					key={`file_${index}`}
					index={index}
					fileCount={fileCount}
					removeFile={removeFile}
					Controller={Controller}
					control={control}
					errors={errors}
					isUpdate={isUpdate}
					disabled={disabled}
				/>
			))}
		</div>
	</div>
);

const FileField = ({
	index,
	fileCount,
	removeFile,
	Controller,
	control,
	errors,
	isUpdate,
	disabled,
}) => (
	<div className='relative min-w-0 max-w-xs flex-1 rounded-lg border border-gray-200 bg-gray-50 p-4'>
		{fileCount > 1 && (
			<button
				type='button'
				onClick={(e) => {
					e.stopPropagation();
					removeFile(index);
				}}
				disabled={disabled}
				className='btn btn-circle btn-outline btn-error btn-xs absolute right-2 top-2 z-10 disabled:bg-slate-400'
				title='Remove file'
			>
				<X className='h-4 w-4' />
			</button>
		)}

		<div className='space-y-2'>
			<label className='block text-sm font-medium text-gray-700'>
				Image {index + 1}
			</label>
			<Controller
				name={`file_${index + 1}`}
				control={control}
				render={({ field }) => (
					<InputImage
						field={field}
						isUpdate={isUpdate}
						imageClassName='h-[150px] w-full object-cover'
						disabled={disabled}
					/>
				)}
			/>
		</div>
	</div>
);
