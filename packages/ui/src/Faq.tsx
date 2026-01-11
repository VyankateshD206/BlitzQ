'use client';

import { useState } from 'react';

function Faq() {
    interface faq {
        question: string
        answer: string
    }
    const faqs:faq[] = [
        {
            question: 'What subjects and topics are supported ?',
            answer: 'BlitzQ covers virtually any academic or professional topic. Our AI can generate quizzes on specific sub-topics or create comprehensive assessments across broader subjects.'
        },
        {
            question: 'In Free tier, do we get 1 quiz each month ?',
            answer: 'No, the 1 quiz is not monthly basis.'
        },
        {
            question: 'Can I change plans later?',
            answer: 'Yes! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect at the start of your next billing cycle.'
        }
    ]
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    return (
        <div className="mt-[50px] mb-[10px] pt-[10px]">
            <div className="flex flex-col items-center gap-4">
                <div className="text-3xl sm:text-4xl text-center font-bold text-[var(--blitzq-primary)]">Frequently Asked Questions</div>
                <div className="w-[90%] sm:w-[70%] text-center text-balance sm:text-lg">
                    Find answers to common questions about BlitzQ
                </div>
                <div className="w-[80%] sm:w-[70%]">
                    {
                        faqs?.map((faq, index) => {
                            const isOpen = openIndex === index;
                            const contentId = `content-${index}`;

                            return (
                                <div className="border-b border-[rgba(255,255,255,0.1)]" key={index}>
                                    <button
                                        type="button"
                                        aria-expanded={isOpen}
                                        aria-controls={contentId}
                                        onClick={() => setOpenIndex(isOpen ? null : index)}
                                        className="w-full flex justify-between items-center py-5"
                                    >
                                        <span className="text-[var(--blitzq-fg)]">{ faq.question }</span>
                                        <span className={`${isOpen ? 'text-[var(--blitzq-accent)]' : 'text-[var(--blitzq-fg)]'} transition-transform duration-300`}>
                                            {isOpen ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                                                    <path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                                                    <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                                                </svg>
                                            )}
                                        </span>
                                    </button>
                                    <div
                                        id={contentId}
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`}
                                    >
                                        <div className="pb-5 text-[var(--blitzq-fg)]">
                                            { faq.answer }
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Faq;