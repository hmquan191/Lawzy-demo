import React, { useState } from 'react'
import LawyerMap from './LawyerMap'
import type { Lawyer } from '../types'

interface LawyerPopupProps {
  isOpen: boolean
  onClose: () => void
}

const LawyerPopup: React.FC<LawyerPopupProps> = ({ isOpen, onClose }) => {
  const [showMap, setShowMap] = useState(false)
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null)
  
  // Mock lawyers data
  const lawyers: Lawyer[] = [
    {
      id: '1',
      name: 'Lê Minh Hòa',
      specialty: 'Chuyên môn: Luật Dân sự - Hợp đồng - Nhà trọ - Tranh chấp cá nhân',
      rating: 4.9,
      reviewCount: 318,
      online: true,
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      address: '56 Nguyễn Trãi, Q.5, TP.HCM',
      bio: 'Giới thiệu nhanh: ...'
    },
    {
      id: '2',
      name: 'Trần Thị Minh',
      specialty: 'Chuyên môn: Luật Hình sự - Tranh tụng',
      rating: 4.8,
      reviewCount: 245,
      online: true,
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      address: '123 Lê Lợi, Q.1, TP.HCM',
      bio: 'Giới thiệu nhanh: ...'
    },
    {
      id: '3',
      name: 'Nguyễn Văn Phúc',
      specialty: 'Chuyên môn: Luật Đất đai - Thừa kế - Di chúc',
      rating: 4.7,
      reviewCount: 189,
      online: false,
      avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
      address: '78 Hai Bà Trưng, Q.3, TP.HCM',
      bio: 'Giới thiệu nhanh: ...'
    },
    {
      id: '4',
      name: 'Phạm Thị Lan',
      specialty: 'Chuyên môn: Luật Doanh nghiệp - Sở hữu trí tuệ',
      rating: 4.6,
      reviewCount: 156,
      online: true,
      avatar: 'https://randomuser.me/api/portraits/women/58.jpg',
      address: '45 Nguyễn Thị Minh Khai, Q.1, TP.HCM',
      bio: 'Giới thiệu nhanh: ...'
    }
  ]

  const connectWithLawyer = (lawyerId: string) => {
    alert(`Yêu cầu kết nối với luật sư ID: ${lawyerId} đã được gửi.`)
  }
  
  const handleSelectLawyerFromMap = (lawyer: Lawyer) => {
    setSelectedLawyer(lawyer)
    setShowMap(false)
  }

  const handleViewLawyerDetails = (lawyer: Lawyer) => {
    setSelectedLawyer(lawyer)
  }

  const handleBackToList = () => {
    setSelectedLawyer(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm font-['Product_Sans']">
      {showMap ? (
        <LawyerMap onClose={() => setShowMap(false)} onSelectLawyer={handleSelectLawyerFromMap} />
      ) : (
        <div className="bg-white rounded-lg w-[800px] max-w-[90%] max-h-[90vh] flex flex-col shadow-xl">
          {selectedLawyer ? (
            // Lawyer detail view
            <div className="flex h-[500px]">
              {/* Left side - Lawyer info */}
              <div className="w-2/3 p-6 flex flex-col">
                <div className="flex items-center mb-4">
                  <button 
                    onClick={handleBackToList}
                    className="mr-2 p-1 rounded-full hover:bg-gray-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h2 className="text-xl text-gray-800">Thông tin luật sư</h2>
                </div>
                
                <div className="flex items-center mb-6">
                  <img 
                    src={selectedLawyer.avatar} 
                    alt={selectedLawyer.name} 
                    className="w-24 h-24 rounded-full object-cover border-2 border-[#fc8e5a]" 
                  />
                  <div className="ml-4">
                    <h3 className="text-xl text-gray-800">{selectedLawyer.name}</h3>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center text-yellow-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1">{selectedLawyer.rating}</span>
                        <span className="ml-1 text-gray-600">({selectedLawyer.reviewCount} đánh giá)</span>
                      </div>
                      <span className={`ml-3 px-2 py-1 text-xs rounded-full ${selectedLawyer.online ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {selectedLawyer.online ? 'Đang trực tuyến' : 'Không trực tuyến'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 text-gray-700 flex-1">
                  <div>
                    <h4 className="text-gray-900">{selectedLawyer.specialty}</h4>
                  </div>
                  <div>
                    <p className="text-gray-900">Văn phòng:</p>
                    <p>{selectedLawyer.address}</p>
                  </div>
                  <div>
                    <p className="text-gray-900">Giới thiệu nhanh:</p>
                    <p>{selectedLawyer.bio}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <button
                    onClick={() => connectWithLawyer(selectedLawyer.id)}
                    className={`w-full py-3 rounded-lg text-white ${
                      selectedLawyer.online 
                        ? 'bg-[#fc8e5a] hover:bg-[#fc8e5a]/90' 
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!selectedLawyer.online}
                  >
                    {selectedLawyer.online ? 'Kết nối ngay' : 'Không trực tuyến'}
                  </button>
                </div>
              </div>
              
              {/* Right side - Map preview */}
              <div className="w-1/3 bg-[#fefff9] rounded-r-lg overflow-hidden">
                <div className="h-full relative">
                  <div className="absolute inset-0 bg-[#fefff9]">
                    {/* Simple map visualization */}
                    <div className="h-full w-full relative">
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200"></div>
                      <div className="absolute top-1/4 left-0 right-0 h-1 bg-gray-200"></div>
                      <div className="absolute top-3/4 left-0 right-0 h-1 bg-gray-200"></div>
                      <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-gray-200"></div>
                      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200"></div>
                      <div className="absolute left-3/4 top-0 bottom-0 w-1 bg-gray-200"></div>
                      
                      {/* Lawyer marker */}
                      <div className="absolute" style={{ top: '60%', left: '60%' }}>
                        <div className="h-10 w-10 rounded-full border-2 border-[#fc8e5a] overflow-hidden">
                          <img src={selectedLawyer.avatar} alt={selectedLawyer.name} className="h-full w-full object-cover" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowMap(true)}
                    className="absolute bottom-4 right-4 px-4 py-2 bg-white rounded-lg shadow-md text-gray-800 hover:bg-gray-50"
                  >
                    Xem bản đồ
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Lawyer listing view
            <>
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-[#fc8e5a] text-white rounded-t-lg">
                <h2 className="text-xl">Luật sư</h2>
                <button 
                  onClick={onClose} 
                  className="p-1 hover:bg-[#fc8e5a]/90 rounded"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 gap-4">
                  {lawyers.map((lawyer) => (
                    <div 
                      key={lawyer.id} 
                      className="bg-[#fefff9] rounded-lg p-4 border border-gray-200 hover:shadow-md cursor-pointer"
                      onClick={() => handleViewLawyerDetails(lawyer)}
                    >
                      <div className="flex">
                        <div className="relative">
                          <img 
                            src={lawyer.avatar} 
                            alt={lawyer.name} 
                            className="w-16 h-16 rounded-full object-cover border-2 border-[#fc8e5a]" 
                          />
                          <div
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                              lawyer.online ? 'bg-green-500' : 'bg-gray-400'
                            }`}
                          ></div>
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-lg text-gray-900">{lawyer.name}</div>
                              <div className="text-gray-600 text-sm">{lawyer.specialty}</div>
                            </div>
                            <div className="flex items-center text-yellow-500">
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-5 w-5" 
                                viewBox="0 0 20 20" 
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="ml-1">{lawyer.rating}</span>
                              <span className="ml-1 text-sm text-gray-600">({lawyer.reviewCount} đánh giá)</span>
                            </div>
                          </div>
                          <div className="mt-2 text-gray-600">
                            <p>Văn phòng: {lawyer.address}</p>
                          </div>
                          <div className="mt-2 flex justify-between items-center">
                            <span className={`px-2 py-1 text-xs rounded-full ${lawyer.online ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {lawyer.online ? 'Đang trực tuyến' : 'Không trực tuyến'}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                connectWithLawyer(lawyer.id);
                              }}
                              className={`px-4 py-2 rounded-lg text-white ${
                                lawyer.online 
                                  ? 'bg-[#fc8e5a] hover:bg-[#fc8e5a]/90' 
                                  : 'bg-gray-400 cursor-not-allowed'
                              }`}
                              disabled={!lawyer.online}
                            >
                              {lawyer.online ? 'Kết nối ngay' : 'Không trực tuyến'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-200 flex gap-3 bg-[#fefff9] rounded-b-lg">
                <button 
                  onClick={() => setShowMap(true)}
                  className="flex-1 py-3 bg-[#fc8e5a] hover:bg-[#fc8e5a]/90 rounded-lg text-white flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Tìm luật sư gần bạn
                </button>
                <button 
                  className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
                >
                  Xem tất cả luật sư
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default LawyerPopup 