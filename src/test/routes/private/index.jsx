import {
	NestedDoubleNestedProtectedPage,
	NestedProtectedPage,
	ProtectedPage,
} from '@/test/pages';

const privateRoutes = [
	{
		path: '/protected',
		name: 'Protected',
		element: ProtectedPage,
		children: [
			{
				path: '/protected/nested-1',
				name: 'Nested 1',
				element: NestedProtectedPage,
				children: [
					{
						path: '/protected/nested-1/:id',
						name: 'Double Nested',
						element: NestedDoubleNestedProtectedPage,
						children: [
							{
								path: '/protected/nested-1/:id/:id',
								name: 'Triple Nested',
								element: NestedDoubleNestedProtectedPage,
							},
						],
					},
				],
			},

			{
				path: '/protected/nested-2',
				name: 'Nested 2',
				element: NestedProtectedPage,
			},
		],
	},
];

export default privateRoutes;
