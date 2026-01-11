'use client'
function GetStartedBtn ({className, ariaLabel}: {className?: string, ariaLabel?: string}) {
  const classNameValue =
    className ??
    'btn-gradient glow-accent rounded-full px-5 py-2 text-white hover:shadow-[0_14px_40px_rgba(47,140,255,0.22)] hover:-translate-y-[1px] hover:scale-[1.02]'
  return (
    <button className={classNameValue} aria-label={ariaLabel} onClick={ () => window.location.href = '/signin'}>
        Get Started
    </button>
  )
}

export default GetStartedBtn