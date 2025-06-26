"use client";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import { SignupProvider, useSignup } from "./SignupContext";
import { AnimatePresence, motion } from "framer-motion";

export default function SignupFlow() {
  return (
    <SignupProvider>
      <AnimatedSteps />
    </SignupProvider>
  );
}

function AnimatedSteps() {
  const { step } = useSignup();

  const steps = [<StepOne />, <StepTwo />, <StepThree />];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.4 }}
      >
        {steps[step]}
      </motion.div>
    </AnimatePresence>
  );
}
