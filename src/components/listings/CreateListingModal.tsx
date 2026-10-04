import React, { useState } from 'react';
import {
  RentalCategory,
  ListerType,
  AnyListing,
  ResidentialListing,
} from '../../types';
import { aiService } from '../../services/aiService';
import { useAuth } from '../../store/authContext';
import {
  X,
  Upload,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Image as ImageIcon,
  Building,
  Home,
  Car,
  Briefcase,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onListingCreated: (listing: AnyListing) => void;
}

interface UploadedImage {
  url: string;
  isAiGenerated: boolean;
  label: string;
}

const LOCALITIES_BENGALURU = [
  'Indiranagar',
  'Koramangala',
  'Whitefield',
  'HSR Layout',
  'MG Road',
  'JP Nagar',
  'Electronic City',
  'Bellandur',
  'Marathahalli',
  'Hebbal',
  'Jayanagar',
  'Banashankari',
];

export const CreateListingModal: React.FC<CreateListingModalProps> = ({
  isOpen,
  onClose,
  onListingCreated,
}) => {
  const { user } = useAuth();

  // Category & Subtype
  const [category, setCategory] = useState<RentalCategory>('RESIDENTIAL');
  const [subType, setSubType] = useState('FLAT');
  const [listerType, setListerType] = useState<ListerType>(
    user?.role === 'BROKER' ? 'BROKER' : 'OWNER'
  );

  // Core Info
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(32000);
  const [priceUnit, setPriceUnit] = useState('/month');
  const [securityDeposit, setSecurityDeposit] = useState<number>(64000);

  // Specifications (Residential / Commercial)
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [carpetAreaSqFt, setCarpetAreaSqFt] = useState(1250);
  const [furnishing, setFurnishing] = useState<'FURNISHED' | 'SEMI_FURNISHED' | 'UNFURNISHED'>('SEMI_FURNISHED');
  const [maintenanceMonthly, setMaintenanceMonthly] = useState(2500);

  // Vehicle specifics
  const [vehicleBrand, setVehicleBrand] = useState('Hyundai');
  const [vehicleModel, setVehicleModel] = useState('Creta SX');
  const [vehicleYear, setVehicleYear] = useState(2023);
  const [vehicleTransmission, setVehicleTransmission] = useState<'AUTOMATIC' | 'MANUAL'>('AUTOMATIC');

  // Amenities
  const [amenities, setAmenities] = useState<string[]>([
    'Power Backup',
    '24/7 Gated Security',
    'Covered Car Parking',
    'Elevator',
  ]);

  // Images with distinction between Real Owner Uploads vs AI Staging Concept
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [isUrlAiConcept, setIsUrlAiConcept] = useState(false);

  // Location & Map
  const [city, setCity] = useState('Bengaluru');
  const [locality, setLocality] = useState('Indiranagar');
  const [streetAddress, setStreetAddress] = useState('');
  const [landmark, setLandmark] = useState('Near Metro Station');
  const [pincode, setPincode] = useState('560038');
  const [latitude, setLatitude] = useState(12.9783);
  const [longitude, setLongitude] = useState(77.6408);

  // Contact
  const [listerName, setListerName] = useState(user?.name || '');
  const [listerPhone, setListerPhone] = useState(user?.phone || '+91 98765 43210');

  // UI state
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'photos' | 'location'>('details');

  if (!isOpen) return null;

  // Handle local file uploads (multiple photos)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isAi = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [
            ...prev,
            {
              url: event.target!.result as string,
              isAiGenerated: isAi,
              label: isAi ? 'AI Concept Staging' : file.name,
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddUrlImage = () => {
    if (!urlInput.trim()) return;
    setImages((prev) => [
      ...prev,
      {
        url: urlInput.trim(),
        isAiGenerated: isUrlAiConcept,
        label: isUrlAiConcept ? 'AI Architectural Staging' : 'Real Image Link',
      },
    ]);
    setUrlInput('');
    setIsUrlAiConcept(false);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleAmenity = (amenityName: string) => {
    setAmenities((prev) =>
      prev.includes(amenityName)
        ? prev.filter((a) => a !== amenityName)
        : [...prev, amenityName]
    );
  };

  // Generate with Groq AI Llama 3.3
  const handleGenerateWithGroq = async () => {
    setIsAiGenerating(true);
    setErrorMessage(null);

    const res = await aiService.generateListingDetails({
      category,
      subType,
      locality,
      bedrooms,
      area: carpetAreaSqFt,
      furnishing: furnishing.replace('_', ' '),
      keyFeatures: amenities,
    });

    setIsAiGenerating(false);

    if (res.success && res.data) {
      if (res.data.title && !title) {
        setTitle(res.data.title);
      }
      if (res.data.description) {
        setDescription(res.data.description);
      }
      if (res.data.suggestedAmenities && res.data.suggestedAmenities.length > 0) {
        const merged = Array.from(new Set([...amenities, ...res.data.suggestedAmenities]));
        setAmenities(merged);
      }
      if (res.data.estimatedRentMin && price === 32000) {
        setPrice(res.data.estimatedRentMin);
        setSecurityDeposit(res.data.estimatedRentMin * 2);
      }
    }
  };

  // Click on mini-map to adjust coordinates
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Map normalization for Bengaluru range:
    // Lat: 12.88 to 13.04 (top is max lat)
    // Lng: 77.54 to 77.74 (left is min lng)
    const newLat = 13.04 - (y / rect.height) * (13.04 - 12.88);
    const newLng = 77.54 + (x / rect.width) * (77.74 - 77.54);

    setLatitude(parseFloat(newLat.toFixed(5)));
    setLongitude(parseFloat(newLng.toFixed(5)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('Please enter a descriptive property title.');
      setActiveTab('details');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Please provide a listing description or generate one using Groq AI.');
      setActiveTab('details');
      return;
    }
    if (images.length === 0) {
      setErrorMessage('Please upload at least one real property photo or concept photo.');
      setActiveTab('photos');
      return;
    }

    const imageMetadata = images.map((img) => ({
      url: img.url,
      isAiGenerated: img.isAiGenerated,
      label: img.label,
    }));

    const imageUrls = images.map((img) => img.url);

    const basePayload: any = {
      id: `list_${Date.now()}`,
      title: title.trim(),
      category,
      subType,
      listerId: user?.id || `usr_host_${Date.now()}`,
      listerName: listerName.trim() || user?.name || 'Verified Lister',
      listerType,
      listerPhone: listerPhone.trim(),
      price: Number(price),
      priceUnit,
      securityDeposit: Number(securityDeposit),
      rating: 5.0,
      reviewCount: 0,
      isVerified: true,
      status: 'ACTIVE',
      featured: true,
      createdAt: new Date().toISOString().split('T')[0],
      images: imageUrls,
      imageMetadata,
      description: description.trim(),
      amenities,
      location: {
        city,
        locality,
        pincode,
        maskedAddress: streetAddress ? `${streetAddress}, near ${landmark}` : `Near ${landmark}, ${locality}`,
        coordinates: {
          lat: latitude,
          lng: longitude,
        },
      },
    };

    if (category === 'RESIDENTIAL') {
      const resPayload: ResidentialListing = {
        ...basePayload,
        category: 'RESIDENTIAL',
        bedrooms,
        bathrooms,
        carpetAreaSqFt,
        furnishing,
        maintenanceMonthly,
        isGatedSociety: true,
        balconies: 1,
        petFriendly: true,
        floorNumber: 3,
        totalFloors: 5,
        facing: 'EAST',
      };
      onListingCreated(resPayload);
    } else if (category === 'VEHICLE') {
      const vehPayload: any = {
        ...basePayload,
        category: 'VEHICLE',
        brand: vehicleBrand,
        model: vehicleModel,
        year: vehicleYear,
        transmission: vehicleTransmission,
        fuelType: 'PETROL',
        seats: 5,
        kmIncludedDaily: 250,
        extraKmCharge: 12,
        doorstepDeliveryAvailable: true,
        insuranceIncluded: true,
      };
      onListingCreated(vehPayload);
    } else {
      onListingCreated(basePayload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative my-6 w-full max-w-4xl rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                Create & Publish Rental Listing
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload real photos, specify location coordinates, and optionally use Groq AI
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 px-6 dark:border-slate-800 dark:bg-slate-900/50 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`flex items-center gap-2 py-3 border-b-2 px-4 transition ${
              activeTab === 'details'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>1. Asset Details & Pricing</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`flex items-center gap-2 py-3 border-b-2 px-4 transition ${
              activeTab === 'photos'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            <span>2. Real Photos & AI Staging ({images.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('location')}
            className={`flex items-center gap-2 py-3 border-b-2 px-4 transition ${
              activeTab === 'location'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span>3. Address & Map Location</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 max-h-[72vh] overflow-y-auto">
          {/* TAB 1: DETAILS & PRICING */}
          {activeTab === 'details' && (
            <div className="space-y-5 text-xs">
              {/* Category Selector */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Rental Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['RESIDENTIAL', 'VEHICLE', 'COMMERCIAL', 'EVENT'] as RentalCategory[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setCategory(cat);
                        if (cat === 'RESIDENTIAL') {
                          setPriceUnit('/month');
                          setPrice(32000);
                          setSecurityDeposit(64000);
                        } else if (cat === 'VEHICLE') {
                          setPriceUnit('/day');
                          setPrice(2800);
                          setSecurityDeposit(5000);
                        } else if (cat === 'COMMERCIAL') {
                          setPriceUnit('/month');
                          setPrice(65000);
                          setSecurityDeposit(200000);
                        } else {
                          setPriceUnit('/event');
                          setPrice(85000);
                          setSecurityDeposit(30000);
                        }
                      }}
                      className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 font-semibold transition ${
                        category === cat
                          ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/60 dark:text-indigo-300'
                          : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {cat === 'RESIDENTIAL' && <Home className="h-4 w-4" />}
                      {cat === 'VEHICLE' && <Car className="h-4 w-4" />}
                      {cat === 'COMMERCIAL' && <Briefcase className="h-4 w-4" />}
                      {cat === 'EVENT' && <Sparkles className="h-4 w-4" />}
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub-type and Lister Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Asset Sub-Type
                  </label>
                  <select
                    value={subType}
                    onChange={(e) => setSubType(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {category === 'RESIDENTIAL' && (
                      <>
                        <option value="FLAT">Apartment / High-rise Flat</option>
                        <option value="VILLA">Independent House / Villa</option>
                        <option value="PG">Verified PG / Coliving Room</option>
                        <option value="STUDIO">Studio Room</option>
                      </>
                    )}
                    {category === 'VEHICLE' && (
                      <>
                        <option value="CAR">Self-Drive Car (SUV / Sedan / Hatch)</option>
                        <option value="BIKE">Motorcycle / Premium Cruiser</option>
                        <option value="SCOOTER">Electric Scooter</option>
                      </>
                    )}
                    {category === 'COMMERCIAL' && (
                      <>
                        <option value="OFFICE">Corporate Office Space</option>
                        <option value="SHOP">High-Street Retail Shop</option>
                        <option value="COWORKING">Dedicated Coworking Desks</option>
                      </>
                    )}
                    {category === 'EVENT' && (
                      <>
                        <option value="BANQUET_HALL">AC Banquet Hall</option>
                        <option value="MARRIAGE_GARDEN">Open Lawn / Marriage Garden</option>
                        <option value="FARMHOUSE">Private Party Farmhouse</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Listing Authority
                  </label>
                  <select
                    value={listerType}
                    onChange={(e) => setListerType(e.target.value as ListerType)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="OWNER">Direct Asset Owner (Zero Brokerage)</option>
                    <option value="BROKER">RERA Verified Broker / Agent</option>
                  </select>
                </div>
              </div>

              {/* Title with Groq AI Assist */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Listing Title
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateWithGroq}
                    disabled={isAiGenerating}
                    className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 disabled:opacity-50"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>{isAiGenerating ? 'Generating with Groq AI...' : '✨ Generate Title & Copy with Groq AI'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spacious 2BHK Sunlit Apartment with Modular Kitchen in Indiranagar"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Pricing Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Rental Tariff (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Pricing Frequency
                  </label>
                  <select
                    value={priceUnit}
                    onChange={(e) => setPriceUnit(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="/month">/month</option>
                    <option value="/day">/day</option>
                    <option value="/event">/event</option>
                    <option value="/hour">/hour</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Refundable Security Deposit (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-bold"
                  />
                </div>
              </div>

              {/* Specifications depending on category */}
              {category === 'RESIDENTIAL' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-2xl bg-slate-50/70 p-3.5 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300">Bedrooms</label>
                    <select
                      value={bedrooms}
                      onChange={(e) => setBedrooms(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value={1}>1 BHK</option>
                      <option value={2}>2 BHK</option>
                      <option value={3}>3 BHK</option>
                      <option value={4}>4+ BHK</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300">Bathrooms</label>
                    <select
                      value={bathrooms}
                      onChange={(e) => setBathrooms(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value={1}>1 Bath</option>
                      <option value={2}>2 Baths</option>
                      <option value={3}>3 Baths</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300">Carpet Area (sq.ft)</label>
                    <input
                      type="number"
                      value={carpetAreaSqFt}
                      onChange={(e) => setCarpetAreaSqFt(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300">Furnishing</label>
                    <select
                      value={furnishing}
                      onChange={(e) => setFurnishing(e.target.value as any)}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="SEMI_FURNISHED">Semi-Furnished</option>
                      <option value="FURNISHED">Fully Furnished</option>
                      <option value="UNFURNISHED">Unfurnished</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Detailed Property Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide genuine details regarding ventilation, balcony view, society security, nearby landmarks, or click '✨ Generate Title & Copy with Groq AI' above..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 leading-relaxed dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Amenities Selector */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Amenities & Facilities
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    '24/7 Gated Security',
                    'Power Backup',
                    'Covered Car Parking',
                    'Elevator',
                    'High-Speed Wi-Fi',
                    'Gymnasium',
                    'Swimming Pool',
                    'Air Conditioning',
                    'Balcony',
                    'Pet Friendly',
                    'Modular Kitchen',
                    'Gas Pipeline',
                  ].map((amenity) => {
                    const isSelected = amenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => handleToggleAmenity(amenity)}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {isSelected && '✓ '}
                        {amenity}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('photos')}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 font-bold text-white hover:bg-indigo-700"
                >
                  <span>Next: Upload Real Photos</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: REAL PHOTOS & AI CONCEPT STAGING */}
          {activeTab === 'photos' && (
            <div className="space-y-5 text-xs">
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/40">
                <div className="flex items-start gap-2.5">
                  <Info className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-indigo-950 dark:text-indigo-200">
                      Transparency & Photo Integrity Policy
                    </h4>
                    <p className="mt-0.5 text-indigo-800 dark:text-indigo-300 leading-relaxed text-[11px]">
                      RentEase prioritizes authentic renter trust. Owners and brokers can upload multiple real camera photos. If you use AI-assisted architectural staging or 3D concept imagery, it is clearly tagged with a badge so prospective tenants can distinguish real spaces from digital concepts.
                    </p>
                  </div>
                </div>
              </div>

              {/* Upload Box (Multi-file) */}
              <div className="rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center hover:border-indigo-500 dark:border-slate-700 dark:hover:border-indigo-400 transition">
                <Upload className="mx-auto h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <h5 className="mt-2 font-bold text-slate-800 dark:text-slate-200">
                  Upload Real Photos from your Device
                </h5>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  Select multiple real property photos (living room, bedrooms, kitchen, facade)
                </p>

                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  <label className="cursor-pointer rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white shadow-xs hover:bg-indigo-700 transition">
                    <span>📷 Upload Real Photos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, false)}
                      className="hidden"
                    />
                  </label>

                  <label className="cursor-pointer rounded-xl border border-purple-300 bg-purple-50 px-4 py-2 font-bold text-purple-700 hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-950/60 dark:text-purple-300 transition">
                    <span>✨ Upload AI Concept / Staging</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, true)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Or Add Image via URL */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Or add photo via direct URL link:
                </span>
                <div className="mt-2 flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/property-photo.jpg"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 px-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isUrlAiConcept}
                      onChange={(e) => setIsUrlAiConcept(e.target.checked)}
                      className="rounded text-purple-600"
                    />
                    <span>Mark as AI Concept</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddUrlImage}
                    className="rounded-xl bg-slate-800 px-3.5 py-2 font-semibold text-white hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600"
                  >
                    Add Image
                  </button>
                </div>
              </div>

              {/* Image Previews with Clear Badges */}
              {images.length > 0 ? (
                <div>
                  <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Selected Images ({images.length})
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className="group relative aspect-4/3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800 shadow-sm"
                      >
                        <img
                          src={img.url}
                          alt={img.label}
                          className="h-full w-full object-cover"
                        />
                        {/* Distinction Badge */}
                        <div className="absolute top-2 left-2">
                          {img.isAiGenerated ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-purple-600/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs shadow-xs">
                              <Sparkles className="h-3 w-3" />
                              <span>AI Concept</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs shadow-xs">
                              <span>📷 Real Photo</span>
                            </span>
                          )}
                        </div>

                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-rose-600 text-white opacity-90 shadow-md hover:opacity-100 transition"
                          title="Remove image"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-slate-400">
                  No images uploaded yet. Please add at least one photo.
                </div>
              )}

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Back to Details
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('location')}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 font-bold text-white hover:bg-indigo-700"
                >
                  <span>Next: Set Location & Map</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: LOCATION & MAP PIN */}
          {activeTab === 'location' && (
            <div className="space-y-5 text-xs">
              {/* City and Locality */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    City
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-medium"
                  >
                    <option value="Bengaluru">Bengaluru (Active Launch Hub)</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Hyderabad">Hyderabad</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Locality / Micro-Market
                  </label>
                  <select
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-medium"
                  >
                    {LOCALITIES_BENGALURU.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Street address & landmark */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Street Address / Society Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 100ft Road, 12th Main, Indiranagar"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Pincode
                  </label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Landmark */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Prominent Landmark
                </label>
                <input
                  type="text"
                  placeholder="e.g. Opposite Metro Station Pillar #142"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Interactive Coordinates Map Picker */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    Interactive Map Pin Placement
                  </label>
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                    Click anywhere on the map to place the location pin
                  </span>
                </div>

                <div
                  onClick={handleMapClick}
                  className="relative h-48 w-full cursor-crosshair overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-inner dark:border-slate-700 dark:bg-slate-800"
                >
                  {/* Grid pattern */}
                  <div className="absolute inset-0 opacity-30">
                    <svg width="100%" height="100%">
                      <defs>
                        <pattern id="modalMapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#modalMapGrid)" />
                    </svg>
                  </div>

                  {/* Pin based on coordinates */}
                  <div
                    style={{
                      top: `${Math.max(10, Math.min(85, ((13.04 - latitude) / (13.04 - 12.88)) * 100))}%`,
                      left: `${Math.max(10, Math.min(85, ((longitude - 77.54) / (77.74 - 77.54)) * 100))}%`,
                    }}
                    className="absolute -translate-x-1/2 -translate-y-full z-10 transition-all duration-150"
                  >
                    <div className="flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-xl ring-2 ring-white">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{locality} Pin</span>
                    </div>
                  </div>

                  <div className="absolute bottom-2 left-2 rounded-lg bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-700 backdrop-blur-xs dark:bg-slate-900/90 dark:text-slate-300">
                    Bengaluru Area Map • Lat: {latitude}, Lng: {longitude}
                  </div>
                </div>

                {/* Coordinate Inputs */}
                <div className="mt-2.5 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={latitude}
                      onChange={(e) => setLatitude(parseFloat(e.target.value))}
                      className="mt-0.5 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={longitude}
                      onChange={(e) => setLongitude(parseFloat(e.target.value))}
                      className="mt-0.5 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Lister Contact Information
                </span>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      required
                      value={listerName}
                      onChange={(e) => setListerName(e.target.value)}
                      className="mt-0.5 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500">
                      Direct Verified Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={listerPhone}
                      onChange={(e) => setListerPhone(e.target.value)}
                      className="mt-0.5 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('photos')}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Back to Photos
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition active:scale-98"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Publish Property Live to Marketplace</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
