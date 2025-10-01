"use client";
import React, { useState } from "react";
import {
  Search,
  Menu,
  X,
  Star,
  Heart,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  Globe,
  Play,
  Home,
  Shield,
  RotateCcw,
  MessageCircle,
  Share,
  MoreHorizontal,
  ThumbsUp,
} from "lucide-react";
import ObtenuDevis from "../ObtenuDevis/ObtenuDevis";
import PoserUneQuestion from "../PoserUneQuestion/PoserUneQuestion";
import OrderOptionsModal from "../Commande/Commande";

const LahcenServicePage = () => {
  const [selectedPackage, setSelectedPackage] = useState("standard");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const contactData = {
    name: "Akibur Rahman",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    isOnline: true,
    averageResponseTime: "1 heure",
  };

  // Données exactes du service de Lahcenessayeh
  const serviceData = {
    title: "Je vais faire du montage vidéo viral pour YouTube",
    price: 265,
    seller: {
      name: "Lahcenessayeh",
      avatar: "https://picsum.photos/80/80?random=1",
      rating: 4.9,
      reviewCount: 1300,
      isTopRated: true,
      level: "Level 1",
      responseTime: "1 hour",
      location: "United States",
    },
    images: [
      "https://picsum.photos/800/450?random=1",
      "https://picsum.photos/800/450?random=2",
      "https://picsum.photos/800/450?random=3",
      "https://picsum.photos/800/450?random=4",
    ],
    packages: {
      basic: {
        name: "Basic",
        price: 135,
        deliveryTime: "3 days",
        description: "Basic video editing with transitions",
        features: [
          "Basic video editing",
          "Color correction",
          "Background music",
          "2 revisions",
        ],
      },
      standard: {
        name: "Standard",
        price: 265,
        deliveryTime: "4 days",
        description: "Professional editing with advanced effects",
        features: [
          "Professional video editing",
          "Advanced color grading",
          "Motion graphics",
          "Sound design",
          "Thumbnail design",
          "Unlimited revisions",
        ],
        mostPopular: true,
      },
      premium: {
        name: "Premium",
        price: 395,
        deliveryTime: "5 days",
        description: "Complete viral video package",
        features: [
          "Viral video editing",
          "Cinema-quality color grading",
          "Custom motion graphics",
          "Professional sound design",
          "3 thumbnail options",
          "SEO optimized title",
          "Unlimited revisions",
          "Rush delivery available",
        ],
      },
    },
    description: `GO Viral With my Advanced Long-form Content

Hey, I'm Lahcen, the guy who will put an end to the bad experiences and poor-quality content you've been getting from other freelancers.

What will you get with my service?

✅ RETENTION BASED EDITING
I don't just edit; I create content that keeps viewers watching until the end.

✅ ANIMATIONS & MOTION GRAPHICS
Eye-catching animations that make your content stand out from the crowd.

✅ MUSIC & SOUND DESIGN  
Professional audio mixing that enhances your message and keeps viewers engaged.

✅ LICENSED ASSETS
Access to premium stock footage, music, and effects to elevate your content.

To put my money where my mouth is, I offer a completely free second video if I'm late (even for 1 minute).

Rush Orders are available too.

*I also offer special pricing for our monthly clients*

Contact me now, and let's do this together.`,

    reviews: [
      {
        id: 1,
        user: "indyfilmschool",
        country: "United States",
        avatar: "https://picsum.photos/40/40?random=10",
        rating: 5,
        date: "2 days ago",
        comment:
          "Lahcen turned around a video for us super fast I couldn't believe it. The editing was amazing and I would highly recommend his service to anyone who wants professional editing done. Will be using him again in the near future!",
        helpful: 12,
      },
      {
        id: 2,
        user: "creativestudio22",
        country: "Canada",
        avatar: "https://picsum.photos/40/40?random=11",
        rating: 5,
        date: "1 week ago",
        comment:
          "We had a fantastic experience working with this team! If you're like us and not entirely sure what kind of animation or style would best fit your video, you're in great hands here. They came up with a brilliant concept, delivered everything on time, and truly exceeded our expectations. We highly recommend them!",
        helpful: 8,
      },
      {
        id: 3,
        user: "marketingpro88",
        country: "United Kingdom",
        avatar: "https://picsum.photos/40/40?random=12",
        rating: 5,
        date: "2 weeks ago",
        comment:
          "The final details of the project we worked on together went far above my expectations. They took a very boring video and really made it come to life with their creativity. They captured exactly the message we wanted to convey and were more than willing to work through small details to get it just right.",
        helpful: 15,
      },
    ],
    faqs: [
      {
        question: "What video formats do you accept?",
        answer:
          "I accept all major video formats including MP4, MOV, AVI, and more. You can send files via Google Drive, Dropbox, or any file sharing service.",
      },
      {
        question: "Do you provide the music?",
        answer:
          "Yes! I have access to a library of over 3 million licensed tracks and sound effects. You can also provide your own music if you prefer.",
      },
      {
        question: "What if I'm not satisfied with the result?",
        answer:
          "Your satisfaction is my priority. I offer unlimited revisions for Standard and Premium packages, and I won't stop until you're 100% happy with the final result.",
      },
      {
        question: "Can you work with my deadline?",
        answer:
          "Absolutely! I offer rush delivery for urgent projects. Contact me to discuss your timeline and I'll do my best to accommodate your needs.",
      },
    ],
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev < serviceData.images.length - 1 ? prev + 1 : 0
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : serviceData.images.length - 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-32">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-20">
          <nav className="flex items-center space-x-2 py-3 text-sm text-gray-500">
            <Home className="h-4 w-4" />
            <ChevronRight className="h-4 w-4" />
            <span>Graphics & Design</span>
            <ChevronRight className="h-4 w-4" />
            <span>Video & Animation</span>
            <ChevronRight className="h-4 w-4" />
            <span>Video Editing</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Carousel */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative">
                <img
                  src={serviceData.images[currentImageIndex]}
                  alt="Service preview"
                  className="w-full aspect-video object-cover"
                />

                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {serviceData.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Title and Seller Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {serviceData.title}
              </h1>

              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={serviceData.seller.avatar}
                  alt={serviceData.seller.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">
                      Ad by {serviceData.seller.name}
                    </span>
                    {serviceData.seller.isTopRated && (
                      <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-semibold flex items-center">
                        Top Rated
                        <Star className="h-3 w-3 ml-1 fill-current" />
                        <Star className="h-3 w-3 fill-current" />
                        <Star className="h-3 w-3 fill-current" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-semibold text-gray-900">
                        {serviceData.seller.rating}
                      </span>
                      <span className="ml-1">
                        ({serviceData.seller.reviewCount})
                      </span>
                    </div>
                    <span>{serviceData.seller.level}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Avg. response time</span>
                  <span className="ml-1 font-semibold text-gray-900">
                    {serviceData.seller.responseTime}
                  </span>
                </div>
              </div>
            </div>

            {/* About This Gig */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                About This Gig
              </h2>
              <div className="prose max-w-none">
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {serviceData.description}
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Reviews ({serviceData.seller.reviewCount})
                </h2>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                  <span className="text-lg font-bold">
                    {serviceData.seller.rating}
                  </span>
                  <span className="text-gray-500 ml-2">
                    ({serviceData.seller.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                {serviceData.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-100 pb-6 last:border-b-0"
                  >
                    <div className="flex items-start space-x-4">
                      <img
                        src={review.avatar}
                        alt={review.user}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{review.user}</span>
                            <span className="text-sm text-gray-500">
                              {review.country}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {review.date}
                          </span>
                        </div>

                        <div className="flex items-center mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>

                        <p className="text-gray-700 mb-3">{review.comment}</p>

                        <div className="flex items-center space-x-4">
                          <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700">
                            <ThumbsUp className="h-4 w-4" />
                            <span>Helpful ({review.helpful})</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">FAQ</h2>
              <div className="space-y-4">
                {serviceData.faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg"
                  >
                    <div className="p-4">
                      <details>
                        <summary>
                          {" "}
                          <b>{faq.question}</b>
                        </summary>
                        {faq.answer}
                      </details>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Package Selection */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Package Tabs */}
                <div className="flex border-b">
                  {Object.entries(serviceData.packages).map(([key, pkg]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedPackage(key)}
                      className={`flex-1 py-3 px-2 text-sm font-medium transition-colors relative ${
                        selectedPackage === key
                          ? "text-green-600 border-b-2 border-green-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {pkg.name}
                      {pkg.mostPopular && (
                        <span className="absolute -top-2 -right-1 bg-orange-500 text-white text-xs px-1 py-0.5 rounded">
                          Most popular
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Package Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                      €{serviceData.packages[selectedPackage].price}
                    </span>
                    <span className="text-sm text-gray-500">
                      {serviceData.packages[selectedPackage].deliveryTime}{" "}
                      delivery
                    </span>
                  </div>

                  <p className="text-gray-600 mb-6">
                    {serviceData.packages[selectedPackage].description}
                  </p>

                  <div className="space-y-3 mb-6">
                    {serviceData.packages[selectedPackage].features.map(
                      (feature, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-sm text-gray-700">
                            {feature}
                          </span>
                        </div>
                      )
                    )}
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      Continue (€{serviceData.packages[selectedPackage].price})
                    </button>
                    <button
                      onClick={() => setShowContactModal(true)}
                      className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Contact seller
                    </button>
                  </div>
                </div>
              </div>

              {/* Seller Info Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={serviceData.seller.avatar}
                    alt={serviceData.seller.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">
                        {serviceData.seller.name}
                      </span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-semibold">
                        {serviceData.seller.rating}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        ({serviceData.seller.reviewCount})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">From:</span>
                    <span className="font-medium">
                      {serviceData.seller.location}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Avg. response time:</span>
                    <span className="font-medium">
                      {serviceData.seller.responseTime}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowContactModal(true)}
                  className="w-full mt-4 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Contact me
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <ObtenuDevis
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
      <PoserUneQuestion
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        contact={contactData}
      />
      <OrderOptionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default LahcenServicePage;
