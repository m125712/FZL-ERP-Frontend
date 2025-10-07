import { CircleX } from 'lucide-react';

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
					className='btn btn-outline btn-primary btn-sm'
				>
					+ Add File
				</button>
			)}
		</div>

		<div className='flex space-y-3'>
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
}) => (
	<div className='relative rounded-lg border border-gray-200 bg-gray-50 p-4'>
		<div className='mb-2 flex items-center justify-between'>
			{fileCount > 1 && (
				<button
					type='button'
					onClick={() => removeFile(index)}
					className='btn btn-circle btn-outline btn-error btn-xs'
					title='Remove file'
				>
					<CircleX className='h-4 w-4' />
				</button>
			)}
		</div>

		<FormField
			label={`file_${index}`}
			title={`File ${index + 1}`}
			errors={errors}
		>
			<Controller
				name={`file_${index}`}
				control={control}
				render={(props) => (
					<File
						isUpdate={isUpdate}
						IframeClassName='h-[150px]'
						{...props}
					/>
				)}
			/>
		</FormField>
	</div>
);
