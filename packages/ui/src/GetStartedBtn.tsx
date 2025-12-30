'use client'
function GetStartedBtn ({className, ariaLabel}: {className?: string, ariaLabel?: string}) {
  const classNameValue = className ?? 'px-4 py-2 bg-purple-600 text-white rounded-full'
  return (
    <button className={classNameValue} aria-label={ariaLabel} onClick={ () => window.location.href = '/signin'}>
        Get Started
    </button>
  )
}

export default GetStartedBtn