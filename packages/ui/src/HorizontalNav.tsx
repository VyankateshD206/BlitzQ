'use client';
import Link from 'next/link'


function HorizontalNav() {
    return (
        <div className="flex flex-row justify-between items-center p-3">
            <div className="font-bold text-3xl text-purple-600">
                BlitzQ
            </div>

            <div className="hidden sm:flex items-center gap-5">
                <div>
                    <Link href="#features" className='hover:text-purple-700'>Features</Link> 
                </div>
                <div>
                    <Link href="#howitworks" className='hover:text-purple-700'>How It Works</Link> 
                </div>
                <div>
                    <Link href="#pricing" className='hover:text-purple-700'>Pricing</Link> 
                </div>
            </div>

            <div>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-full" onClick={() => window.location.href = '/signin'}>
                    Sign in
                </button>
            </div>
        </div>
    );
}

export default HorizontalNav;
