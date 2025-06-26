"use client";
import { createContext, useContext, useState } from "react";

const SignupContext = createContext();

export const useSignup = () => useContext(SignupContext);

export function SignupProvider({ children }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    confirm: "",
    otp: "",
    image: null,
    keepSignedIn: false,
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <SignupContext.Provider
      value={{ step, formData, setFormData, nextStep, prevStep }}
    >
      {children}
    </SignupContext.Provider>
  );
}
