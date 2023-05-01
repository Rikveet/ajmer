import { motion } from "framer-motion";
import React, {ReactNode} from "react";

export const FadeInOut = (props: { children: ReactNode, id:string }) => {
    return (
        <motion.div key={props.id}
                    initial="entry" animate="visible" exit='exit' variants={{
            entry: {
                scale: 0.9,
                opacity: 0
            },
            visible: {
                scale: 1,
                opacity: 1,
                transition: {
                    delay: .2
                }
            },
            exit:{
                display: "none"
            }

        }}
        >
            {props.children}
        </motion.div>
    )
}

export const Loading = ()=>{
    // taken from https://github.com/Darth-Knoppix/loading-animation/blob/master/src/ThreeDotsWave.js
    const loadingContainer = {
        width: "2rem",
        height: "2rem",
        display: "flex",
        justifyContent: "space-around"
    };

    const loadingCircle = {
        display: "block",
        width: "0.5rem",
        height: "0.5rem",
        backgroundColor: "black",
        borderRadius: "0.25rem"
    };

    const loadingContainerVariants = {
        start: {
            transition: {
                staggerChildren: 0.2
            }
        },
        end: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const loadingCircleVariants = {
        start: {
            y: "50%"
        },
        end: {
            y: "150%"
        }
    };

    const loadingCircleTransition = {
        duration: 0.8,
        repeat: Infinity,
        ease: [0.6, 0.2, 0.25, 1],
        times: [0, 0.02, 0.98, 1],
    };
    return (
        <motion.div
            style={loadingContainer}
            variants={loadingContainerVariants}
            initial="start"
            animate="end"
        >
            <motion.span
                style={loadingCircle}
                variants={loadingCircleVariants}
                transition={loadingCircleTransition}
            />
            <motion.span
                style={loadingCircle}
                variants={loadingCircleVariants}
                transition={loadingCircleTransition}
            />
            <motion.span
                style={loadingCircle}
                variants={loadingCircleVariants}
                transition={loadingCircleTransition}
            />
        </motion.div>
    )
}
