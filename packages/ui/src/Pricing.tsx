import { Check, X } from "lucide-react";
import GetStartedBtn from "./GetStartedBtn";

function Pricing() {
    return (
        <div className="mt-[50px] pt-[10px]" id="pricing">
            <div className="flex flex-col items-center gap-4">
                <div className="text-3xl sm:text-4xl text-center font-bold text-[var(--blitzq-primary)]">Pricing</div>
                <div className="w-[90%] sm:w-[70%] text-center text-balance sm:text-lg">
                    Simple, transparent pricing. Choose the plan that works for your learning needs
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-[20px] mx-auto">
                <div className="bg-[rgba(255,255,255,0.05)] border border-[color:var(--blitzq-border)] rounded-lg p-6">
                    <div className="font-bold text-lg">Free</div>
                    <div className="text-[var(--blitzq-muted)]">Basic learning tools for casual users</div>
                    <div className="flex gap-1 items-center my-2">
                      <div className="text-3xl font-bold text-[var(--blitzq-primary)]">$0</div>
                      <div className="font-bold text-[var(--blitzq-muted)]">/lifetime</div>
                    </div>
                    <div className="text-center">
                        <GetStartedBtn className="btn-gradient glow-accent p-2 rounded-lg text-white w-3/4 hover:shadow-[0_14px_40px_rgba(47,140,255,0.18)]"/>
                    </div>
                    <div className="mt-4">
                        <div className="flex gap-2 my-1">
                            <div>
                                <Check color="var(--blitzq-accent)"/>
                            </div>
                            <div>
                                1 Quiz Included
                            </div>
                        </div>
                        <div className="flex gap-2 my-1">
                            <div>
                                <Check color="var(--blitzq-accent)"/>
                            </div>
                            <div>
                                Detailed Explainations
                            </div>
                        </div>
                        <div className="flex gap-2 my-1">
                            <div>
                                <Check color="var(--blitzq-accent)"/>
                            </div>
                            <div>
                                Detailed Analytics
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-[rgba(255,255,255,0.05)] rounded-lg p-6 border border-[color:rgba(47,140,255,0.55)] shadow-[0_0_0_1px_rgba(47,140,255,0.18),0_22px_60px_rgba(47,140,255,0.14)]">
                    <div className="flex items-center gap-1">
                        <div className="font-bold text-lg">Pro</div>
                        <div className="bg-[var(--blitzq-primary)] text-white rounded-full px-2 text-sm">Popular</div>
                    </div>
                    <div className="text-[var(--blitzq-muted)]">Enhanced features for serious learners</div>
                    <div className="flex gap-1 items-center my-2">
                      <div className="text-3xl font-bold text-[var(--blitzq-primary)]">$9.99</div>
                      <div className="font-bold text-[var(--blitzq-muted)]">/month</div>
                    </div>
                    <div className="text-center">
                        <GetStartedBtn className="btn-gradient glow-accent p-2 rounded-lg text-white w-3/4 hover:shadow-[0_14px_40px_rgba(57,255,20,0.12)]"/>
                    </div>
                    <div className="mt-4">
                        <div className="flex gap-2 my-1">
                            <div>
                                <Check color="var(--blitzq-accent)"/>
                            </div>
                            <div>
                                300 Quizzes per month
                            </div>
                        </div>
                        <div className="flex gap-2 my-1">
                            <div>
                                <Check color="var(--blitzq-accent)"/>
                            </div>
                            <div>
                                Detailed explanations
                            </div>
                        </div>
                        <div className="flex gap-2 my-1">
                            <div>
                                <Check color="var(--blitzq-accent)"/>
                            </div>
                            <div>
                                Detailed analytics
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Pricing;