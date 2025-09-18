import React, { useState, useCallback } from "react";
import { X } from "lucide-react";

const termsText = `
1. Ownership Confirmation
Users must declare that the card they are creating is for themselves or that they hold explicit authorization from the person for whom the card is being prepared.

2. Responsibility Acknowledgment
Users accept full responsibility for the accuracy of all details submitted and agree to bear any outcomes or consequences resulting from the generation or use of the card.

3. Legal Consent
Users agree to comply with all relevant laws and regulations in connection with the creation and use of the card. This includes, but is not limited to, laws regarding forgery, false representation, and intellectual property rights.

4. Indemnification
Users agree to indemnify and protect the service provider against any claims, damages, or liabilities that may arise from their use of this service, including issues tied to the making or sharing of the card.

5. Legal Disclaimers
The card is provided for informational and personal purposes only. It is not issued by any government authority and holds no official governmental status.

6. Authenticity Validation
The user alone is responsible for verifying the authenticity of the ID card PDF files created with ID Maker. Only those files that carry valid digital signatures should be treated as genuine.

7. Data Privacy
Users understand and agree that their personal data may be collected and processed as outlined in the provider’s Privacy Policy. By proceeding with card creation, you authorize us to pull required information from our open data sources.

By continuing to use our service, you agree to these terms and conditions, including but not limited to: Terms and Conditions, Privacy Policy, and Refund Policy.
`;

export function TermsNConditionModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-900/90 backdrop-blur-xl border border-gray-800/50 max-w-2xl w-full rounded-xl shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800/50">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            User Agreement & Terms
          </h2>
          <button
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800/50 rounded-lg"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-blue-300 font-medium">
                Please read and understand these terms before using our services.
              </p>
            </div>
            <div className="whitespace-pre-line">{termsText}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800/50 bg-gray-900/50">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="flex-1 bg-gray-700/50 text-gray-300 py-3 px-4 rounded-lg hover:bg-gray-600/50 transition-colors border border-gray-700/50"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg font-medium"
              onClick={onClose}
            >
              I Agree & Continue
            </button>
          </div>
          <p className="text-gray-500 text-xs text-center mt-3">
            By clicking "I Agree & Continue", you accept our terms and conditions.
          </p>
        </div>
      </div>
    </div>
  );
}

// Custom hook for easy usage
export function useTermsNCondition() {
  const [open, setOpen] = useState(false);
  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);
  const modal = <TermsNConditionModal open={open} onClose={closeModal} />;
  return { open, openModal, closeModal, modal };
}

export default TermsNConditionModal;
