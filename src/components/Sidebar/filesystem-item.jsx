import { ArrowBack, Send, Trash } from '@/assets/icons';
import cn from '@/lib/cn';
import { useState } from 'react';

let node = [
	{
		name: 'Home',
		nodes: [
			{
				name: 'Movies',
				nodes: [
					{
						name: 'Action',
						nodes: [
							{
								name: '2000s',
								nodes: [
									{ name: 'Gladiator.mp4' },
									{ name: 'The-Dark-Knight.mp4' },
								],
							},
							{ name: '2010s', nodes: [] },
						],
					},
					{
						name: 'Comedy',
						nodes: [
							{
								name: '2000s',
								nodes: [{ name: 'Superbad.mp4' }],
							},
						],
					},
					{
						name: 'Drama',
						nodes: [
							{
								name: '2000s',
								nodes: [{ name: 'American-Beauty.mp4' }],
							},
						],
					},
				],
			},
			{
				name: 'Music',
				nodes: [
					{ name: 'Rock', nodes: [] },
					{ name: 'Classical', nodes: [] },
				],
			},
			{ name: 'Pictures', nodes: [] },
			{
				name: 'Documents',
				nodes: [],
			},
			{ name: 'passwords.txt' },
		],
	},
];

export default function FilesystemItem() {
	let [isOpen, setIsOpen] = useState(false);

	let folders = [
		{ name: 'Movies', nodes: ['Action', 'Comedy', 'Drama'] },
		{ name: 'Music', nodes: ['Rock', 'Classical'] },
		{ name: 'Pictures', nodes: [] },
		{ name: 'Documents', nodes: [] },
		{ name: 'passwords.txt', nodes: [] },
	];

	return (
		<div className='p-8'>
			<ul>
				<li className='my-1.5'>
					<span className='flex items-center gap-2'>
						<ArrowBack
							className={cn(
								'h-4 w-4',
								isOpen
									? 'rotate-90 transform'
									: 'rotate-0 transform'
							)}
							onClick={() => setIsOpen(!isOpen)}
						/>
						HOME
					</span>
					<ul className='ps-6'>
						{folders.map((folder) => (
							<>
								<Menu key={node} folder={folder} />
								<ul className='ps-6'>
									{/* {folder?.nodes?.map((node) => (
										
									))} */}
								</ul>
							</>
						))}
					</ul>
				</li>
			</ul>
		</div>
	);
}

function Menu({ folder }) {
	return (
		<span className='flex items-center gap-2'>
			<ArrowBack
				className={cn('h-4 w-4')}
				onClick={() => setIsOpen(!isOpen)}
			/>
			{folder?.name}
		</span>
	);
}
