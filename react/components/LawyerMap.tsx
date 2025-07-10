import React, { useState, useEffect } from 'react'
// import { Marker, Popup } from 'react-leaflet'
import { LatLngTuple } from 'leaflet'
import './map.css'
import Map from './map'
import type { Lawyer } from '../types'

// Đảm bảo import leaflet-defaulticon-compatibility
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet-defaulticon-compatibility'

interface LawyerMapProps {
  onSelectLawyer: (lawyer: Lawyer) => void
  onClose: () => void
}

const LawyerMap: React.FC<LawyerMapProps> = ({ onSelectLawyer, onClose }) => {
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null)
  const [loading, setLoading] = useState(true)
  const [nearbyLawyers, setNearbyLawyers] = useState<Lawyer[]>([])

  // Vị trí trung tâm (TP. Hồ Chí Minh)
  const center: LatLngTuple = [10.775, 106.7]

  // Mock data for lawyers
  const mockLawyers: Lawyer[] = [
    {
      id: '1',
      name: 'Lê Thị Hòa',
      specialty: 'Luật Dân sự',
      rating: 4.8,
      online: true,
      avatar: 'https://shinypexels.com/wp-content/uploads/2024/08/image-24.jpeg',
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
      name: 'Trần Thị Minh',
      specialty: 'Luật Hình sự',
      rating: 4.9,
      online: true,
      avatar: 'https://imgcdn.stablediffusionweb.com/2024/6/12/4d688bcf-f53b-42b6-a98d-3254619f3b58.jpg',
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
      name: 'Nguyễn Văn Phúc',
      specialty: 'Luật Đất đai',
      rating: 4.7,
      online: false,
      avatar: 'https://t3.ftcdn.net/jpg/03/95/29/76/360_F_395297652_J7Bo5IVAkYo1LFzPjEhldbOPNstxYx4i.jpg',
      location: {
        lat: 10.78,
        lng: 106.69,
        address: '78 Hai Bà Trưng, Quận 1, TP.HCM'
      },
      distance: 3.1,
      estimatedTime: 12
    },
    {
      id: '4',
      name: 'Phạm Thị Lan',
      specialty: 'Luật Doanh nghiệp',
      rating: 4.6,
      online: true,
      avatar: 'https://src.spectator.co.uk/wp-content/uploads/2021/01/Charles-Yu-%C2%A9-Tina-Chiou._r1.jpg',
      location: {
        lat: 10.769,
        lng: 106.695,
        address: '45 Nguyễn Thị Minh Khai, Quận 1, TP.HCM'
      },
      distance: 1.8,
      estimatedTime: 8
    }
  ]

  // Khởi tạo dữ liệu khi component được mount
  useEffect(() => {
    console.log('Initializing lawyer map data')
    setNearbyLawyers(mockLawyers)
    setLoading(false)
  }, [])

  // Xử lý khi chọn luật sư
  const handleSelectLawyer = (lawyer: Lawyer) => {
    setSelectedLawyer(lawyer)
    onSelectLawyer(lawyer)
  }

  return (
    <div className="bg-white rounded-lg w-[800px] max-w-[100%] max-h-[90vh] flex flex-col shadow-xl font-['Inter'] overflow-hidden">
      {/* Header */}
      <div className='p-4 border-b border-gray-200 flex items-center justify-between bg-[#fc8e5a] text-white rounded-t-lg'>
        <div className='flex items-center gap-2'>
          <button onClick={onClose} className='p-1 rounded hover:bg-[#fc8e5a]/90'>
            <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z'
                clipRule='evenodd'
              />
            </svg>
          </button>
          <h2 className='text-lg font-medium'>Tìm Luật sư gần bạn</h2>
        </div>
      </div>

      <div className='flex flex-col'>
        {/* Luật sư gần bạn - Title */}
        <div className='p-4'>
          <h3 className='font-medium text-lg text-gray-800'>Luật sư gần bạn</h3>
          <p className='text-gray-600 text-sm'>Chọn một luật sư trên bản đồ để xem thông tin chi tiết</p>
        </div>

        <div className='flex flex-row h-[500px]'>
          {/* Map Area - Left Side */}
          <div className='w-1/2 h-full relative'>
            {loading ? (
              <div className='absolute inset-0 flex items-center justify-center bg-[#fefff9] z-10'>
                <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#fc8e5a]'></div>
              </div>
            ) : (
              <div className='h-full w-full'>
                <Map posix={center} zoom={13} />
              </div>
            )}
          </div>

          {/* Lawyer List - Right Side */}
          <div className='w-1/2 h-full overflow-y-auto bg-[#f8fafc]'>
            {nearbyLawyers.map((lawyer) => (
              <div
                key={lawyer.id}
                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                  selectedLawyer?.id === lawyer.id ? 'bg-gray-50' : ''
                }`}
                onClick={() => handleSelectLawyer(lawyer)}
              >
                <img src={lawyer.avatar} alt={lawyer.name} className='h-12 w-12 rounded-full object-cover' />
                <div className='flex-1'>
                  <div className='font-medium text-gray-800'>{lawyer.name}</div>
                  <div className='text-sm text-gray-600'>{lawyer.specialty}</div>
                </div>
                <div className='text-right'>
                  <div className='text-sm font-medium text-gray-800'>{lawyer.distance} km</div>
                  <div className='text-xs text-gray-500'>{lawyer.estimatedTime} phút</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LawyerMap
