"use client";

import React, { ChangeEvent, FormEvent, Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { useState } from "react";
import Image from "next/image";
import Spinner from "./Spinner";
import { addUserPhoneNumberToProduct } from "@/lib/actions";

interface Props {
  productId: string;
}
const Modal = ({ productId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");

  const validateInput = (e: ChangeEvent<HTMLInputElement>): void => {
    const regex = /^\d{10}$/;
    if (!regex.test(e.target.value)) {
      setError("Invalid Email");
    } else {
      setError("");
    }
    setPhoneNumber(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isTracked = await addUserPhoneNumberToProduct(productId, phoneNumber);

    if (isTracked) {
      alert("We will update you about your Product!");
    } else {
      alert("Sorry, we are unable to send the sms");
    }

    setIsSubmitting(false);
    setPhoneNumber("");
    closeModal();
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  return (
    <>
      <button type="button" className="btn" onClick={openModal}>
        Track
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          onClose={closeModal}
          className="dialog-container"
          aria-labelledby="dialog-title"
          aria-describedby="dialog-descritption"
        >
          <div className="min-h-screen px-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <DialogPanel className="fixed inset-0" />
            </TransitionChild>

            {/* To have dialog box at center */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            />

            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="dialog-content">
                {/* Modal Content */}
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <div className="p-3 border border-gray-200 rounded-10">
                      <Image
                        src="/assets/icons/logo.svg"
                        alt="logo"
                        height={22}
                        width={22}
                      />
                    </div>

                    <Image
                      src="/assets/icons/x-close.svg"
                      alt="close"
                      width={20}
                      height={20}
                      className="cursor-pointer"
                      onClick={closeModal}
                    />
                  </div>

                  <h4 className="dialog-head_text">
                    Stay updated with product pricing alerts right in your
                    inbox!
                  </h4>

                  <p className="text=sm text-gray-600 mt-2">
                    Never miss a bargain again with our timely alerts!
                  </p>
                </div>

                <form className="flex flex-col mt-5" onSubmit={handleSubmit}>
                  <label
                    htmlFor="country_code"
                    className="text-sm font-medium text-gray-700"
                  >
                    Whatsapp Number
                  </label>

                  <div className="dialog-input_container">
                    <Image
                      src="/assets/icons/mail.svg"
                      alt="mail"
                      height={22}
                      width={22}
                    />

                    <input
                      required
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="Enter your Whatsapp Number"
                      className="dialog-input"
                      value={phoneNumber}
                      onChange={validateInput}
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <button
                    type="submit"
                    className="btn mt-5"
                    disabled={!!error || isSubmitting}
                  >
                    {isSubmitting ? <Spinner /> : "Track"}
                  </button>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
