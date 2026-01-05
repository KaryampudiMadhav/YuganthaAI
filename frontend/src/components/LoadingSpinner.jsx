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
<div className='relative'>
{/* Animated Logo */}
<div className='animate-pulse-slow'>
<svg
className='w-32 h-32 animate-bounce-subtle'
viewBox='0 0 50 50'
fill='none'>
<defs>
<linearGradient
id='logoGradient'
x1='0%'
y1='0%'
x2='100%'
y2='100%'>
<stop offset='0%' stopColor='#3b82f6'>
<animate
attributeName='stop-color'
values='#3b82f6; #8b5cf6; #ec4899; #3b82f6'
dur='3s'
repeatCount='indefinite'
/>
</stop>
<stop offset='50%' stopColor='#8b5cf6'>
<animate
attributeName='stop-color'
values='#8b5cf6; #ec4899; #3b82f6; #8b5cf6'
dur='3s'
repeatCount='indefinite'
/>
</stop>
<stop offset='100%' stopColor='#ec4899'>
<animate
attributeName='stop-color'
values='#ec4899; #3b82f6; #8b5cf6; #ec4899'
dur='3s'
repeatCount='indefinite'
/>
</stop>
</linearGradient>
</defs>
<path
d='M10 40 L25 10 L40 40 M15 35 L35 35'
stroke='url(#logoGradient)'
strokeWidth='4'
strokeLinecap='round'
strokeLinejoin='round'
className='animate-draw'
/>
</svg>
</div>

{/* Rotating Ring */}
<div className='absolute inset-0 flex items-center justify-center'>
<div className='w-40 h-40 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin'></div>
</div>

{/* Loading Text */}
<div className='absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap'>
<div className='flex items-center space-x-2'>
<span className='text-2xl font-bold text-white animate-pulse'>
Yugantha
</span>
<span className='text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse'>
AI
</span>
</div>
</div>

{/* Animated Dots */}
<div className='absolute -bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2'>
<div
className='w-2 h-2 bg-blue-500 rounded-full animate-bounce'
style={{ animationDelay: "0ms" }}></div>
<div
className='w-2 h-2 bg-purple-500 rounded-full animate-bounce'
style={{ animationDelay: "150ms" }}></div>
<div
className='w-2 h-2 bg-pink-500 rounded-full animate-bounce'
style={{ animationDelay: "300ms" }}></div>
</div>
</div>
</div>
);
}
