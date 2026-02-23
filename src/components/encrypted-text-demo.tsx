import { EncryptedText } from "@/components/ui/encrypted-text";
import React from "react";

export default function EncryptedTextDemo() {
  return (
    <div className="mx-auto flex max-w-lg items-center justify-center">
      <p className="text-left">
        You are not your job, you&apos;re not how much money you have in the
        bank. You are not the car you drive. You&apos;re not the contents of
        your wallet. You are not your fucking khakis.{" "}
        <EncryptedText text="All singing, all dancing crap of the world." />
      </p>
    </div>
  );
}
