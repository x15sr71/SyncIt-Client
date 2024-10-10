import { HOW_IT_WORKS_CONTENT } from "@/constants"
//import { title } from "process"
import Image from "next/image"

const HowItWorks = () => {
    return (
        <section id="works">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12 border-t border-neutral-800">
                    <h2 className="text-3xl lg:text-5xl mt-20 tracking-tighter
                    bg-gradient-to-t from-neutral-50 via-neutral-300 to-neutral-600
                    bg-clip-text text-transparent">
                        {HOW_IT_WORKS_CONTENT.sectionTitle}
                    </h2>
                        <p className="mt-4 text-neutral-400 max-w-xl mx-auto">
                            {HOW_IT_WORKS_CONTENT.sectionDescription}
                        </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
                gap-6">
                {HOW_IT_WORKS_CONTENT.steps.map((step, index) => (
                    <div key={index} className="border-neutral-900 p-6 rounded-xl
                    shadow-lg flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                            <p className="text-neutral-400 mb-4">{step.description}</p>
                            <div className="flex justify-center">
                            <Image
                             src={step.imageSrc}    // Image source
                             alt={step.imageAlt}     // Alternative text for the image
                             className="rounded-lg"  // Tailwind CSS classes for styling
                             width={500}             // Define the width of the image (or dynamically if needed)
                             height={300}            // Define the height of the image (or dynamically if needed)
                           />
                            </div>
                        {/* Could be used to display users */}
                            {/* {step.users && (
                                <div className="flex justify-between items-center
                                mt-4">
                                    <div className="flex -space-x-2">
                                        {step.users.map((user, userIndex) => (
                                            <Image
                                            key={userIndex}
                                            src={user}                          // The user image source (either a path or URL)
                                            alt={`Person ${userIndex + 1}`}      // Alt text for accessibility
                                            width={500}                          // Define a width (or adjust based on the image size)
                                            height={500}                         // Define a height (or adjust based on the image size)
                                            className="h-8 w-8 rounded-full
                                            border-2 border-black"             // Optional: add any necessary Tailwind CSS classes
                                          />
                                        ))}
                                        </div>
                                        <button className="bg-blue-600
                                        hover:bg-blue-500 text-white py-2 px-4
                                        rounded-lg">
                                            Connect
                                        </button>
                                </div>
                            )} */}
                        </div>
                    </div>
                ))}
                </div>
            </div>
        </section>
    )
}

export default HowItWorks