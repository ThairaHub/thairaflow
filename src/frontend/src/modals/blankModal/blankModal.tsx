//import LangflowLogoColor from "@/assets/LangflowLogocolor.svg?react";
import BaseModal from "@/modals/baseModal";

import { useCallback, useEffect, useState } from "react";
export default function BlankModal({
  children,
  open,
  setOpen,
  tag,
  size
}): JSX.Element {

  useEffect(() => {
    setOpen(open);
    return () => {
      setOpen(false);
    };
  }, [open]);


  return (
    <BaseModal
      open={open}
      setOpen={setOpen}
      size={size || "medium"}
      className="!rounded-[12px] p-0"
    >
      <BaseModal.Trigger>{children}</BaseModal.Trigger>
      {/* TODO ADAPT TO ALL TYPES OF INPUTS AND OUTPUTS */}
      <BaseModal.Content overflowHidden className="h-full max-h-[90vh] overflow-y-auto p-4">
      <div className="flex flex-col h-full">        
        {tag}
      </div>
      </BaseModal.Content>
    </BaseModal>
  );
}
