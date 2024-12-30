import { useEffect } from 'react';
import { useMotionValue, useScroll, useTransform } from 'motion/react';

function useBoundedScroll(threshold) {
	let { scrollY } = useScroll();
	let scrollYBounded = useMotionValue(0);
	let scrollYBoundedProgress = useTransform(
		scrollYBounded,
		[0, threshold],
		[0, 1]
	);

	useEffect(() => {
		return scrollY.on('change', (current) => {
			let previous = scrollY.getPrevious();
			let diff = current - previous;
			let newScrollYBounded = scrollYBounded.get() + diff;

			scrollYBounded.set(clamp(newScrollYBounded, 0, threshold));
		});
	}, [threshold, scrollY, scrollYBounded]);

	return { scrollYBounded, scrollYBoundedProgress };
}

export default useBoundedScroll;
