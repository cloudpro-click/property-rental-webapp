import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';
import BuildingWizard from '../components/BuildingWizard';
import { GET_ALL_PROPERTIES, CREATE_PROPERTY, UPDATE_PROPERTY } from '../lib/graphql-queries';

const Buildings = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // GraphQL Query - Fetch all properties
  const { data, loading: queryLoading, error: queryError, refetch } = useQuery(GET_ALL_PROPERTIES, {
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      console.error('Error fetching properties:', error);
    }
  });

  // GraphQL Mutations
  const [createProperty, { loading: createLoading }] = useMutation(CREATE_PROPERTY, {
    onCompleted: (data) => {
      if (data.createProperty.success) {
        toast.success('Property created successfully!');
        refetch();
        closeModal();
      } else {
        toast.error(data.createProperty.message || 'Failed to create property');
      }
    },
    onError: (error) => {
      console.error('Create property error:', error);
      toast.error(error.message || 'Failed to create property');
    }
  });

  const [updateProperty, { loading: updateLoading }] = useMutation(UPDATE_PROPERTY, {
    onCompleted: (data) => {
      if (data.updateProperty.success) {
        toast.success('Property updated successfully!');
        refetch();
        closeModal();
      } else {
        toast.error(data.updateProperty.message || 'Failed to update property');
      }
    },
    onError: (error) => {
      console.error('Update property error:', error);
      toast.error(error.message || 'Failed to update property');
    }
  });

  // Get buildings from GraphQL response or use empty array
  const buildings = data?.getAllProperties?.properties || [];

  // Filter buildings based on search query
  const filteredBuildings = buildings.filter((building) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      building.name?.toLowerCase().includes(query) ||
      building.address?.toLowerCase().includes(query) ||
      building.city?.name?.toLowerCase().includes(query) ||
      building.province?.name?.toLowerCase().includes(query)
    );
  });

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showAddModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAddModal]);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    region: '',
    city: '',
    province: '',
    landmark: '',
    totalRooms: '',
    floors: '',
    description: '',
    contactPerson: '',
    contactPhone: '',
    latitude: '',
    longitude: '',
    photos: []
  });

  const handleGetLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6)
          });
          setLocationLoading(false);
        },
        (error) => {
          alert('Unable to get location. Please enter manually or enable location services.');
          setLocationLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
      setLocationLoading(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    setPhotos([...photos, ...newPhotos]);
  };

  const removePhoto = (index) => {
    const newPhotos = [...photos];
    URL.revokeObjectURL(newPhotos[index].preview);
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare input for GraphQL mutation
    const propertyInput = {
      name: formData.name,
      address: formData.address,
      region_psgc_code: formData.region,
      province_psgc_code: formData.province,
      city_psgc_code: formData.city,
      landmark: formData.landmark || null,
      totalRooms: parseInt(formData.totalRooms),
      floors: formData.floors ? parseInt(formData.floors) : null,
      description: formData.description || null,
      contactPerson: formData.contactPerson || null,
      contactPhone: formData.contactPhone || null,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      photos: photos.map(p => p.name || p.file?.name || '') // Send photo names/URLs
    };

    try {
      if (editingBuilding) {
        // Update existing building
        await updateProperty({
          variables: {
            building_id: editingBuilding.building_id,
            input: propertyInput
          }
        });
      } else {
        // Create new building
        await createProperty({
          variables: {
            input: propertyInput
          }
        });
      }
    } catch (error) {
      // Error handling is done in mutation onError callback
      console.error('Submit error:', error);
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setCurrentStep(1);
    setPhotos([]);
    setEditingBuilding(null);
    // Reset form
    setFormData({
      name: '',
      address: '',
      region: '',
      city: '',
      province: '',
      landmark: '',
      totalRooms: '',
      floors: '',
      description: '',
      contactPerson: '',
      contactPhone: '',
      latitude: '',
      longitude: '',
      photos: []
    });
  };

  const handleEditBuilding = (building) => {
    console.log('Editing building:', building);
    console.log('Region:', building.region);
    console.log('Province:', building.province);
    console.log('City:', building.city);
    setEditingBuilding(building);
    setFormData({
      name: building.name || '',
      address: building.address || '',
      region: building.region?.psgc_code || '',
      city: building.city?.psgc_code || '',
      province: building.province?.psgc_code || '',
      landmark: building.landmark || '',
      totalRooms: building.totalRooms?.toString() || '',
      floors: building.floors?.toString() || '',
      description: building.description || '',
      contactPerson: building.contactPerson || '',
      contactPhone: building.contactPhone || '',
      latitude: building.latitude?.toString() || '',
      longitude: building.longitude?.toString() || '',
      photos: building.photos || []
    });
    setPhotos(building.photos || []);
    setShowAddModal(true);
  };

  // Fill form with demo data
  const fillDemoData = () => {
    setFormData({
      name: 'Sampaguita Apartments',
      address: '123 Mabini Street, Barangay San Isidro',
      region: '', // Will be filled via dropdown
      city: '', // Will be filled via dropdown
      province: '', // Will be filled via dropdown
      landmark: 'Near SM North EDSA',
      totalRooms: '24',
      floors: '4',
      description: 'Modern apartment building with spacious units, parking spaces, and 24/7 security. Located near schools, hospitals, and shopping centers.',
      contactPerson: 'Maria Clara Santos',
      contactPhone: '+63 917 555 1234',
      latitude: '14.676208',
      longitude: '121.043861',
      photos: []
    });
  };

  const isLoading = createLoading || updateLoading;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-neutral-900">Properties</h2>
          <p className="text-sm sm:text-base text-neutral-600">Manage your rental properties</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center justify-center sm:justify-start whitespace-nowrap"
        >
          <svg className="w-5 h-5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Add Property</span>
          <span className="sm:hidden ml-2">Add</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            placeholder="Search properties by name, address, city, or province..."
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg className="h-5 w-5 text-neutral-400 hover:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {queryLoading && buildings.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-3 text-neutral-600">Loading properties...</span>
        </div>
      )}

      {/* Error State */}
      {queryError && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Failed to load properties</h3>
          <p className="text-neutral-600 mb-4">{queryError.message}</p>
          <button onClick={() => refetch()} className="btn-primary">
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!queryLoading && !queryError && buildings.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-neutral-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No properties yet</h3>
          <p className="text-neutral-600 mb-4">Get started by adding your first property</p>
          <button onClick={() => setShowAddModal(true)} className="btn-primary">
            Add Property
          </button>
        </div>
      )}

      {/* No Search Results */}
      {!queryLoading && !queryError && buildings.length > 0 && filteredBuildings.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-neutral-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No properties found</h3>
          <p className="text-neutral-600 mb-4">Try adjusting your search terms</p>
          <button onClick={() => setSearchQuery('')} className="btn-primary">
            Clear Search
          </button>
        </div>
      )}

      {/* Properties Grid */}
      {filteredBuildings.length > 0 && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredBuildings.map((building) => (
          <div key={building.building_id} className="card p-4 sm:p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <button className="text-neutral-400 hover:text-primary-600 p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>

            <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-1.5">{building.name}</h3>
            <p className="text-xs sm:text-sm text-neutral-600 mb-3 line-clamp-2">
              {building.address}{building.city?.name ? `, ${building.city.name}` : ''}
            </p>

            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-neutral-600">Total Rooms</span>
                <span className="font-semibold text-neutral-900">{building.totalRooms || 0}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-neutral-600">Occupied</span>
                <span className="font-semibold text-primary-600">{building.occupiedRooms || 0}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-neutral-600">Vacancy Rate</span>
                <span className="font-semibold text-neutral-900">
                  {building.totalRooms ? Math.round(((building.totalRooms - (building.occupiedRooms || 0)) / building.totalRooms) * 100) : 0}%
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-200">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs sm:text-sm text-neutral-600">Monthly Revenue</span>
                <span className="text-base sm:text-lg font-bold text-secondary-600">{building.monthlyRevenue || '₱0'}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 text-xs sm:text-sm font-medium transition-colors">
                Rooms
              </button>
              <button
                onClick={() => handleEditBuilding(building)}
                className="flex-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 text-xs sm:text-sm font-medium transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
      )}


      {/* Add Building Wizard Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-neutral-900 bg-opacity-50 z-50 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="min-h-screen px-2 sm:px-4 flex items-center justify-center py-4 sm:py-8">
            <div
              className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-3xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-neutral-200">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-display font-bold text-neutral-900">
                      {editingBuilding ? 'Edit Property' : 'Add New Property'}
                    </h3>
                    {!editingBuilding && (
                      <button
                        type="button"
                        onClick={fillDemoData}
                        className="px-3 py-1.5 text-xs sm:text-sm font-medium text-accent-700 bg-accent-50 hover:bg-accent-100 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="hidden sm:inline">Fill Demo Data</span>
                        <span className="sm:hidden">Demo</span>
                      </button>
                    )}
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-neutral-400 hover:text-neutral-600 p-1"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-between">
                  {[1, 2, 3, 4].map((step) => {
                    const getStepIcon = (stepNum) => {
                      if (stepNum === 1) {
                        return (
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        );
                      } else if (stepNum === 2) {
                        return (
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        );
                      } else if (stepNum === 3) {
                        return (
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                        );
                      } else {
                        return (
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        );
                      }
                    };

                    return (
                      <React.Fragment key={step}>
                        <div className="flex flex-col items-center">
                          <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all ${step < currentStep
                              ? 'bg-green-500 text-white'
                              : step === currentStep
                                ? 'bg-primary-600 text-white'
                                : 'bg-neutral-200 text-neutral-500'
                            }`}>
                            {getStepIcon(step)}
                          </div>
                          <span className="text-[10px] sm:text-xs mt-1 sm:mt-1.5 text-neutral-600 text-center">
                            {step === 1 ? 'Basic' : step === 2 ? 'Address' : step === 3 ? 'Location' : 'Photos'}
                          </span>
                        </div>
                        {step < 4 && (
                          <div className={`flex-1 h-0.5 sm:h-1 mx-1 sm:mx-2 rounded ${step < currentStep ? 'bg-green-500' : 'bg-neutral-200'
                            }`}></div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Wizard Content */}
              <form onSubmit={handleSubmit} noValidate>
                <div className="p-4 sm:p-5 min-h-[320px] sm:min-h-[380px]">
                  <BuildingWizard
                    key={editingBuilding?.building_id || 'new'}
                    currentStep={currentStep}
                    formData={formData}
                    setFormData={setFormData}
                    photos={photos}
                    handlePhotoUpload={handlePhotoUpload}
                    removePhoto={removePhoto}
                    handleGetLocation={handleGetLocation}
                    locationLoading={locationLoading}
                    handleNext={handleNext}
                    handleBack={handleBack}
                    handleSubmit={handleSubmit}
                    closeModal={closeModal}
                    isEditing={!!editingBuilding}
                    isSubmitting={createLoading || updateLoading}
                    fillDemoData={fillDemoData}
                    initialBuilding={editingBuilding}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Buildings;
