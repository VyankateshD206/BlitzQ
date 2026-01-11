'use client';
import Link from 'next/link'
import { useEffect, useState } from 'react';


function HorizontalNav() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const updateScrolled = () => setIsScrolled(window.scrollY > 8);
        updateScrolled();
        window.addEventListener('scroll', updateScrolled, { passive: true });
        return () => window.removeEventListener('scroll', updateScrolled);
    }, []);

    return (
        <header className={`sticky top-0 z-50 bg-[rgba(5,11,30,0.6)] backdrop-blur-md text-[var(--blitzq-fg)] ${isScrolled ? 'shadow-[0_10px_30px_rgba(0,0,0,0.35)]' : ''}`}>
            <div className="flex flex-row justify-between items-center p-3">
                <div className="font-bold text-3xl text-[var(--blitzq-fg)]">
                    <span>Blitz</span>
                    <span
                        className="bg-clip-text text-transparent"
                        style={{
                            backgroundImage:
                                'linear-gradient(90deg,var(--blitzq-primary),var(--blitzq-accent))',
                        }}
                    >
                        Q
                    </span>
                </div>

                <div className="hidden sm:flex items-center gap-5">
                    <div>
                        <Link href="#features" className='text-[var(--blitzq-fg)] hover:text-transparent hover:bg-clip-text hover:bg-[linear-gradient(90deg,var(--blitzq-primary),var(--blitzq-accent))]'>Features</Link> 
                    </div>
                    <div>
                        <Link href="#howitworks" className='text-[var(--blitzq-fg)] hover:text-transparent hover:bg-clip-text hover:bg-[linear-gradient(90deg,var(--blitzq-primary),var(--blitzq-accent))]'>How It Works</Link> 
                    </div>
                    <div>
                        <Link href="#pricing" className='text-[var(--blitzq-fg)] hover:text-transparent hover:bg-clip-text hover:bg-[linear-gradient(90deg,var(--blitzq-primary),var(--blitzq-accent))]'>Pricing</Link> 
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="btn-gradient glow-accent rounded-full px-5 py-2 hover:shadow-[0_14px_40px_rgba(57,255,20,0.14)] hover:-translate-y-[1px]" onClick={() => window.location.href = '/signin'}>
                        Sign in
                    </button>

                    <button
                        type="button"
                        className="sm:hidden rounded-md px-3 py-2"
                        aria-label="Open menu"
                        aria-expanded={isMobileMenuOpen}
                        onClick={() => setIsMobileMenuOpen((v) => !v)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                </div>
            </div>

            {isMobileMenuOpen ? (
                <div className="sm:hidden px-3 pb-3">
                    <div className="flex flex-col gap-3">
                        <Link href="#features" className='text-[var(--blitzq-fg)] hover:text-transparent hover:bg-clip-text hover:bg-[linear-gradient(90deg,var(--blitzq-primary),var(--blitzq-accent))]'>Features</Link>
                        <Link href="#howitworks" className='text-[var(--blitzq-fg)] hover:text-transparent hover:bg-clip-text hover:bg-[linear-gradient(90deg,var(--blitzq-primary),var(--blitzq-accent))]'>How It Works</Link>
                        <Link href="#pricing" className='text-[var(--blitzq-fg)] hover:text-transparent hover:bg-clip-text hover:bg-[linear-gradient(90deg,var(--blitzq-primary),var(--blitzq-accent))]'>Pricing</Link>
                    </div>
                </div>
            ) : null}
        </header>
    );
}

export default HorizontalNav;
