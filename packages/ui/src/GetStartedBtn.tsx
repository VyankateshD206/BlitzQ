'use client'
function GetStartedBtn ({className}: {className?: string}) {
  const classNameValue = className ?? 'px-4 py-2 bg-purple-600 text-white rounded-full'
  return (
    <button className={classNameValue} onClick={ () => window.location.href = '/signin'}>
        Get Started
    </button>
  )
}

export default GetStartedBtn