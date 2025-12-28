import { Check, X } from "lucide-react";
import GetStartedBtn from "./GetStartedBtn";

function Pricing() {
    return (
        <div className="mt-[50px] pt-[10px]" id="pricing">
            <div className="flex flex-col items-center gap-4">
                <div className="text-3xl sm:text-4xl text-center font-bold text-purple-600">Pricing</div>
                <div className="w-[90%] sm:w-[70%] text-center text-balance sm:text-lg">
                    Simple, transparent pricing. Choose the plan that works for your learning needs
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-[20px] mx-auto">
                <div className="bg-purple-100 border border-gray-300 rounded-lg p-6">
                    <div className="font-bold text-lg">Free</div>
                    <div>Basic learning tools for casual users</div>
                    <div className="flex gap-1 items-center my-2">
                      <div className="text-3xl font-bold text-purple-600">$0</div>
                      <div className="font-bold">/lifetime</div>
                    </div>
                    <div className="text-center">
                        <GetStartedBtn className="border border-purple-600 p-2 rounded-lg text-purple-600 bg-purple-100 w-3/4 hover:bg-purple-200"/>
                    </div>
                    <div className="mt-4">
                        <div className="flex gap-2 my-1">
                            <div>
                                <Check color="#1eff00"/>
                            </div>
                            <div>
                                1 Quiz Included
                            </div>
                        </div>
                        <div className="flex gap-2 my-1">
                            <div>
                                <Check color="#1eff00"/>
                            </div>
                            <div>
                                Detailed Explainations
                            </div>
                        </div>
                        <div className="flex gap-2 my-1">
                            <div>
                                <Check color="#1eff00"/>
                            </div>
                            <div>
                                Detailed Analytics
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-purple-100 rounded-lg p-6 ring-2 ring-purple-600">
                    <div className="flex items-center gap-1">
                        <div className="font-bold text-lg">Pro</div>
                        <div className="bg-purple-500 text-white rounded-full px-2 text-sm">Popular</div>
                    </div>
                    <div>Enhanced features for serious learners</div>
                    <div className="flex gap-1 items-center my-2">
                      <div className="text-3xl font-bold text-purple-600">$9.99</div>
                      <div className="font-bold">/month</div>
                    </div>
                    <div className="text-center">
                        <GetStartedBtn className="bg-purple-600 p-2 rounded-lg text-white w-3/4"/>
                    </div>
                    <div className="mt-4">
                        <div className="flex gap-2 my-1">
                            <div>
                                <Check color="#1eff00"/>
                            </div>
                            <div>
                                300 Quizzes per month
                            </div>
                        </div>
                        <div className="flex gap-2 my-1">
                            <div>
                                <Check color="#1eff00"/>
                            </div>
                            <div>
                                Detailed explanations
                            </div>
                        </div>
                        <div className="flex gap-2 my-1">
                            <div>
                                <Check color="#1eff00"/>
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