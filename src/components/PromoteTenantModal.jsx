import React from 'react';

/**
 * PromoteTenantModal - Confirmation modal for promoting a secondary tenant to primary
 *
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onClose - Handler for closing the modal
 * @param {object} currentPrimary - Current primary tenant object { name, ... }
 * @param {object} tenantToPromote - Secondary tenant to be promoted { name, ... }
 * @param {number} rent - Monthly rent amount
 * @param {function} onConfirm - Handler for confirming the promotion
 * @param {boolean} loading - Whether the promotion is in progress
 */
const PromoteTenantModal = ({
  isOpen,
  onClose,
  currentPrimary,
  tenantToPromote,
  rent,
  onConfirm,
  loading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-neutral-900">
                Promote to Primary Tenant?
              </h2>
              <p className="text-sm text-neutral-600 mt-1">
                This will transfer rent responsibility and primary contact status.
              </p>
            </div>
          </div>

          {/* Changes Preview */}
          <div className="bg-accent-50 border border-accent-200 rounded-lg p-4 mb-4">
            <p className="font-medium text-neutral-900 mb-3">Changes:</p>
            <div className="space-y-3">
              {/* Current Primary → Roommate */}
              <div className="flex items-center gap-2 text-sm">
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-neutral-700">{currentPrimary?.name || 'Current Primary'}</span>
                  <span className="px-2 py-0.5 bg-primary-600 text-white rounded text-xs font-semibold flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    PRIMARY
                  </span>
                </div>
                <svg className="w-4 h-4 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <span className="px-2 py-0.5 bg-neutral-400 text-white rounded text-xs font-semibold">
                  Roommate
                </span>
              </div>

              {/* Secondary → Primary */}
              <div className="flex items-center gap-2 text-sm">
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-neutral-700">{tenantToPromote?.name || 'Tenant'}</span>
                  <span className="px-2 py-0.5 bg-neutral-400 text-white rounded text-xs font-semibold">
                    Roommate
                  </span>
                </div>
                <svg className="w-4 h-4 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <span className="px-2 py-0.5 bg-primary-600 text-white rounded text-xs font-semibold flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  PRIMARY
                </span>
              </div>
            </div>
          </div>

          {/* Rent Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm">
                <p className="font-medium text-blue-900">Rent Responsibility Transfer</p>
                <p className="text-blue-700 mt-0.5">
                  {tenantToPromote?.name || 'The promoted tenant'} will become responsible for the full monthly rent of ₱{rent?.toLocaleString() || '0'}.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Promoting...</span>
                </>
              ) : (
                <span>Confirm Promotion</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoteTenantModal;
