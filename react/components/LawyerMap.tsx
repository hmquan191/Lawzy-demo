import React, { useState, useEffect } from 'react'
import type { Lawyer } from '../types'

interface LawyerMapProps {
  onSelectLawyer: (lawyer: Lawyer) => void
  onClose: () => void
}

const LawyerMap: React.FC<LawyerMapProps> = ({ onSelectLawyer, onClose }) => {
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [nearbyLawyers, setNearbyLawyers] = useState<Lawyer[]>([])

  // Mock data for lawyers
  const mockLawyers: Lawyer[] = [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      specialty: 'Luật Dân sự',
      rating: 4.8,
      online: true,
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      location: {
        lat: 10.772,
        lng: 106.698,
        address: '123 Nguyễn Huệ, Quận 1, TP.HCM'
      },
      distance: 1.2,
      estimatedTime: 5
    },
    {
      id: '2',
      name: 'Trần Thị B',
      specialty: 'Luật Hình sự',
      rating: 4.9,
      online: true,
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      location: {
        lat: 10.776,
        lng: 106.7,
        address: '45 Lê Lợi, Quận 1, TP.HCM'
      },
      distance: 2.5,
      estimatedTime: 10
    },
    {
      id: '3',
      name: 'Lê Văn C',
      specialty: 'Luật Đất đai',
      rating: 4.7,
      online: true,
      avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
      location: {
        lat: 10.78,
        lng: 106.69,
        address: '78 Hai Bà Trưng, Quận 1, TP.HCM'
      },
      distance: 3.1,
      estimatedTime: 12
    }
  ]

  // Simulate getting user location
  useEffect(() => {
    setLoading(true)
    // Giả lập vị trí người dùng ở trung tâm TP.HCM
    setTimeout(() => {
      setUserLocation({ lat: 10.775, lng: 106.7 })
      setNearbyLawyers(mockLawyers)
      setLoading(false)
    }, 1500)
  }, [])

  const handleSelectLawyer = (lawyer: Lawyer) => {
    setSelectedLawyer(lawyer)
  }

  const handleConfirmSelection = () => {
    if (selectedLawyer) {
      onSelectLawyer(selectedLawyer)
    }
  }

  return (
    <div className="bg-white rounded-lg w-[800px] max-w-[90%] max-h-[90vh] flex flex-col shadow-xl font-['Product_Sans']">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-[#fc8e5a] text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="p-1 rounded hover:bg-[#fc8e5a]/90">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <h2 className="text-lg font-medium">Tìm Luật sư gần bạn</h2>
        </div>
      </div>

      {/* Map Area */}
      <div className="relative flex-1 h-[400px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#fefff9]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#fc8e5a]"></div>
          </div>
        ) : (
          <div className="h-full w-full relative">
            {/* This would be replaced with an actual map component like Google Maps or Mapbox */}
            <div className="absolute inset-0 bg-[#fefff9] overflow-hidden">
              {/* Simplified Map Visualization */}
              <div className="w-full h-full relative">
                {/* Roads */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300"></div>
                <div className="absolute top-1/4 left-0 right-0 h-1 bg-gray-300"></div>
                <div className="absolute top-3/4 left-0 right-0 h-1 bg-gray-300"></div>
                <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-gray-300"></div>
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-300"></div>
                <div className="absolute left-3/4 top-0 bottom-0 w-1 bg-gray-300"></div>

                {/* User Location */}
                <div className="absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  <div className="h-6 w-6 rounded-full bg-[#fc8e5a] border-2 border-white flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  </div>
                  <div className="mt-1 bg-[#fc8e5a]/80 px-2 py-1 rounded text-xs text-white">Vị trí của bạn</div>
                </div>

                {/* Lawyer Locations */}
                {nearbyLawyers.map((lawyer) => (
                  <div 
                    key={lawyer.id}
                    className={`absolute cursor-pointer transition-all ${selectedLawyer?.id === lawyer.id ? 'scale-125' : ''}`}
                    style={{ 
                      top: `${(lawyer.location?.lat ?? 10.77 - 10.77) * 1000 + 50}%`, 
                      left: `${(lawyer.location?.lng ?? 106.69 - 106.69) * 1000 + 50}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => handleSelectLawyer(lawyer)}
                  >
                    <div className={`h-10 w-10 rounded-full border-2 ${lawyer.online ? 'border-[#fc8e5a]' : 'border-gray-400'} overflow-hidden`}>
                      <img src={lawyer.avatar} alt={lawyer.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Panel */}
      <div className="bg-[#fefff9] rounded-b-lg border-t border-gray-200">
        {selectedLawyer ? (
          <div className="p-4">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src={selectedLawyer.avatar} 
                alt={selectedLawyer.name} 
                className="h-16 w-16 rounded-full object-cover border-2 border-[#fc8e5a]" 
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-lg text-gray-800">{selectedLawyer.name}</h3>
                  <div className="flex items-center text-yellow-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1">{selectedLawyer.rating}</span>
                  </div>
                </div>
                <div className="text-gray-600">{selectedLawyer.specialty}</div>
                <div className="mt-1 text-sm text-gray-500">{selectedLawyer.location?.address || 'Không có địa chỉ'}</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4 p-3 bg-white rounded-lg border border-gray-200">
              <div className="text-center">
                <div className="text-sm text-gray-500">Khoảng cách</div>
                <div className="font-medium text-gray-800">{selectedLawyer.distance} km</div>
              </div>
              <div className="h-8 w-px bg-gray-200"></div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Thời gian di chuyển</div>
                <div className="font-medium text-gray-800">{selectedLawyer.estimatedTime} phút</div>
              </div>
              <div className="h-8 w-px bg-gray-200"></div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Trạng thái</div>
                <div className="font-medium text-green-600">Đang trực tuyến</div>
              </div>
            </div>
            
            <button 
              onClick={handleConfirmSelection}
              className="w-full py-3 bg-[#fc8e5a] hover:bg-[#fc8e5a]/90 rounded-lg font-medium text-white"
            >
              Kết nối với luật sư này
            </button>
          </div>
        ) : (
          <div className="p-4">
            <h3 className="font-medium text-lg mb-2 text-gray-800">Luật sư gần bạn</h3>
            <p className="text-gray-600 mb-4">Chọn một luật sư trên bản đồ để xem thông tin chi tiết</p>
            
            <div className="space-y-3">
              {nearbyLawyers.map(lawyer => (
                <div 
                  key={lawyer.id} 
                  className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50 border border-gray-200"
                  onClick={() => handleSelectLawyer(lawyer)}
                >
                  <img 
                    src={lawyer.avatar} 
                    alt={lawyer.name} 
                    className="h-12 w-12 rounded-full object-cover border border-[#fc8e5a]" 
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{lawyer.name}</div>
                    <div className="text-sm text-gray-600">{lawyer.specialty}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-800">{lawyer.distance} km</div>
                    <div className="text-xs text-gray-500">{lawyer.estimatedTime} phút</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LawyerMap 