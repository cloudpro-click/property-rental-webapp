import React from 'react';

/**
 * OccupancyIndicator - Shows room occupancy with progress bar and optional "Add" button
 *
 * @param {number} currentOccupancy - Current number of tenants
 * @param {number} capacity - Maximum capacity of the room
 * @param {boolean} showAdd - Whether to show the "Add" button
 * @param {function} onAddClick - Handler for "Add" button click
 */
const OccupancyIndicator = ({
  currentOccupancy = 0,
  capacity = 1,
  showAdd = false,
  onAddClick
}) => {
  const percentage = capacity > 0 ? (currentOccupancy / capacity) * 100 : 0;
  const hasCapacity = currentOccupancy < capacity;
  const isFull = currentOccupancy >= capacity;

  return (
    <div className="flex items-center gap-2">
      {/* Occupancy Text */}
      <span className="text-sm font-medium text-neutral-900 whitespace-nowrap">
        {currentOccupancy}/{capacity}
      </span>

      {/* Progress Bar */}
      <div className="w-16 bg-neutral-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isFull
              ? 'bg-green-500'
              : currentOccupancy > 0
              ? 'bg-blue-500'
              : 'bg-neutral-300'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {/* Add Button */}
      {showAdd && hasCapacity && onAddClick && (
        <button
          onClick={onAddClick}
          className="text-xs text-primary-600 hover:text-primary-800 font-medium whitespace-nowrap transition-colors"
          title="Add roommate"
        >
          + Add
        </button>
      )}
    </div>
  );
};

export default OccupancyIndicator;
