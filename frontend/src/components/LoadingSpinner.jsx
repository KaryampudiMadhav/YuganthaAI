import { useEffect, useState } from "react";

export default function LoadingSpinner() {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(false);
		}, 2000);

		return () => clearTimeout(timer);
	}, []);

	if (!isVisible) return null;

	return (
		<div className='fixed inset-0 bg-[#0a0a0a] z-50 flex items-center justify-center'>
			<div className='relative flex flex-col items-center'>
				{/* Simple M Writing Animation */}
				<div className='mb-8'>
					<svg
						className='w-40 h-40'
						viewBox='0 0 100 100'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'>
						<defs>
							<linearGradient
								id='mGradient'
								x1='0%'
								y1='0%'
								x2='100%'
								y2='0%'>
								<stop offset='0%' stopColor='#8b5cf6' />
								<stop offset='100%' stopColor='#ec4899' />
							</linearGradient>
						</defs>
						{/* M Letter - Drawing Animation */}
						<path
							d='M 20 75 L 20 25 L 50 55 L 80 25 L 80 75'
							stroke='url(#mGradient)'
							strokeWidth='6'
							strokeLinecap='round'
							strokeLinejoin='round'
							fill='none'
							className='animate-draw-m'
							style={{
								strokeDasharray: '250',
								strokeDashoffset: '250',
								animation: 'drawM 1.5s ease-out forwards'
							}}
						/>
					</svg>
				</div>

				{/* Loading Text */}
				<div className='flex items-center space-x-2'>
					<span className='text-2xl font-bold text-white'>
						Mero
					</span>
					<span className='text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent'>
						sphere
					</span>
				</div>

				{/* Simple Animated Dots */}
				<div className='flex space-x-2 mt-4'>
					<div
						className='w-2 h-2 bg-purple-500 rounded-full animate-bounce'
						style={{ animationDelay: "0ms" }}></div>
					<div
						className='w-2 h-2 bg-purple-500 rounded-full animate-bounce'
						style={{ animationDelay: "150ms" }}></div>
					<div
						className='w-2 h-2 bg-pink-500 rounded-full animate-bounce'
						style={{ animationDelay: "300ms" }}></div>
				</div>
			</div>

			{/* Custom CSS for M drawing animation */}
			<style>{`
				@keyframes drawM {
					to {
						stroke-dashoffset: 0;
					}
				}
			`}</style>
		</div>
	);
}
