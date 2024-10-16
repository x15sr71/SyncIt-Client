//"use client"

import { KEY_FEATURES_CONTENT } from "@/constants"
// import { motion } from "framer-motion"

const KeyFeatures = () => {
    // const featuresVariants = {
    //     visible: {
    //         y: 0,
    //         transition: {
    //             duration: 0.5,
    //         }
    //     }
    // }
    return (
        <section>
            <div className="max-w-7xl mx-auto px-4 mt-20">
               <div className="text-center mb-12 border-t border-neutral-800">
                <h2 className="text-3xl lg:text-5xl mt-20 tracking-tighter
                bg-gradient-to-t from-neutral-50 via-neutral-300 to-neutral-600
                bg-clip-text text-transparent">
                    {KEY_FEATURES_CONTENT.sectionTitle}
                </h2>
                <p className="mt-4">
                    {KEY_FEATURES_CONTENT.sectionDescription}
                </p>
                </div> 

                {/* {<motion.div><h2>
                    </h2></motion.div>} */}

            </div>
        </section>
    )
}

export default KeyFeatures