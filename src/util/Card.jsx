import React, { useEffect } from 'react';
const items = [
	{
		title: 'Lossless Youths',
		description:
			'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore fuga voluptatum, iure corporis inventore praesentium nisi. Id laboriosam ipsam enim.',
		image: 'https://cdn.mos.cms.futurecdn.net/dP3N4qnEZ4tCTCLq59iysd.jpg',
	},
	{
		title: 'Lossless Youths',
		description:
			'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore fuga voluptatum, iure corporis inventore praesentium nisi. Id laboriosam ipsam enim.',
		image: 'https://cdn.mos.cms.futurecdn.net/dP3N4qnEZ4tCTCLq59iysd.jpg',
	},
	{
		title: 'Lossless Youths',
		description:
			'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore fuga voluptatum, iure corporis inventore praesentium nisi. Id laboriosam ipsam enim.',
		image: 'https://cdn.mos.cms.futurecdn.net/dP3N4qnEZ4tCTCLq59iysd.jpg',
	},
];
export default function Card() {
	useEffect(() => {
		const slider = document.querySelector('.slider');

		const activate = (e) => {
			const items = document.querySelectorAll('.item');
			if (e.target.matches('.next')) slider.append(items[0]);
			if (e.target.matches('.prev'))
				slider.prepend(items[items.length - 1]);
		};

		document.addEventListener('click', activate, false);

		return () => {
			document.removeEventListener('click', activate, false);
		};
	}, []);

	return (
		<main>
			<ul className='slider'>
				{items.map((item, index) => (
					<li
						key={index}
						className='item'
						style={{ backgroundImage: `url('${item.image}')` }}>
						<div className='content'>
							<h2 className='title'>{item.title}</h2>
							<p className='description'>{item.description}</p>
							<button>Read More</button>
						</div>
					</li>
				))}
			</ul>
			<nav className='nav'>
				<ion-icon
					className='prev btn'
					name='arrow-back-outline'></ion-icon>
				<ion-icon
					className='next btn'
					name='arrow-forward-outline'></ion-icon>
			</nav>
		</main>
	);
}
