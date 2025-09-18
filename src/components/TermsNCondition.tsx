import React, { useState, useCallback } from "react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white max-w-lg w-full rounded-lg shadow-lg p-6 relative">
        <h2 className="text-xl font-bold mb-4">User Agreement</h2>
        <div className="overflow-y-auto max-h-[60vh] whitespace-pre-line text-gray-800 text-sm mb-6">
          {termsText}
        </div>
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <button
          className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          onClick={onClose}
        >
          I Agree
        </button>
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
