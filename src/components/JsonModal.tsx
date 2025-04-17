
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";

type JsonModalProps = {
  jsonContent: string;
  isOpen: boolean;
  onClose: () => void;
};

const JsonModal: React.FC<JsonModalProps> = ({ jsonContent, isOpen, onClose }) => {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonContent)
      .then(() => {
        setHasCopied(true);
        toast.success("JSON copied to clipboard!");
        
        setTimeout(() => {
          setHasCopied(false);
        }, 2000);
      })
      .catch(() => {
        toast.error("Failed to copy JSON");
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">Generated Menu JSON</DialogTitle>
        </DialogHeader>
        <div className="overflow-auto max-h-[50vh] mt-4 rounded-md">
          <pre className="bg-gray-100 p-4 text-sm overflow-x-auto rounded-md whitespace-pre-wrap">
            {jsonContent}
          </pre>
        </div>
        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button 
            onClick={copyToClipboard} 
            className="w-full sm:w-auto"
            disabled={hasCopied}
          >
            {hasCopied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                <span>Copy JSON</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JsonModal;
