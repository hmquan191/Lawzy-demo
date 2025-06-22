import React, { useState } from 'react'

interface Lawyer {
  id: string
  name: string
  specialty: string
  rating: number
  online: boolean
  avatar: string
}

interface LawyerConnectProps {
  showLawyers: boolean
  toggleLawyersPanel: () => void
}

const LawyerConnect: React.FC<LawyerConnectProps> = ({ showLawyers, toggleLawyersPanel }) => {
  // Mock lawyers data
  const lawyers: Lawyer[] = [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      specialty: 'Luật Dân sự',
      rating: 4.8,
      online: true,
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: '2',
      name: 'Trần Thị B',
      specialty: 'Luật Hình sự',
      rating: 4.9,
      online: true,
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: '3',
      name: 'Lê Văn C',
      specialty: 'Luật Đất đai',
      rating: 4.7,
      online: false,
      avatar: 'https://randomuser.me/api/portraits/men/62.jpg'
    },
    {
      id: '4',
      name: 'Phạm Thị D',
      specialty: 'Luật Doanh nghiệp',
      rating: 4.6,
      online: true,
      avatar: 'https://randomuser.me/api/portraits/women/58.jpg'
    }
  ]

  const connectWithLawyer = (lawyerId: string) => {
    alert(`Yêu cầu kết nối với luật sư ID: ${lawyerId} đã được gửi.`)
  }

  // Sidebar button to open lawyer panel
  const LawyerConnectButton = () => (
    <button 
      onClick={toggleLawyersPanel}
      className='w-full py-2 bg-green-600 hover:bg-green-700 rounded flex items-center justify-center gap-2'
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-5 w-5'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
        />
      </svg>
      Kết nối Luật sư
    </button>
  )

  // Lawyers panel component
  const LawyersPanel = () => (
    <div
      className={`w-80 border-l border-gray-700 bg-gray-800 transition-all duration-300 overflow-hidden ${
        showLawyers ? 'translate-x-0' : 'translate-x-full'
      } absolute right-0 top-0 bottom-0`}
    >
      <div className='p-4 border-b border-gray-700 flex items-center justify-between'>
        <h2 className='font-bold'>Luật sư trực tuyến</h2>
        <button onClick={toggleLawyersPanel} className='p-1 hover:bg-gray-700 rounded'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
          </svg>
        </button>
      </div>
      <div className='p-4 space-y-4'>
        {lawyers.map((lawyer) => (
          <div key={lawyer.id} className='bg-gray-700 rounded-lg p-3'>
            <div className='flex items-center gap-3'>
              <div className='relative'>
                <img src={lawyer.avatar} alt={lawyer.name} className='w-12 h-12 rounded-full object-cover' />
                <div
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                    lawyer.online ? 'bg-green-500' : 'bg-gray-500'
                  }`}
                ></div>
              </div>
              <div className='flex-1'>
                <div className='font-medium'>{lawyer.name}</div>
                <div className='text-sm text-gray-300'>{lawyer.specialty}</div>
                <div className='flex items-center text-yellow-400 text-sm mt-1'>
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' viewBox='0 0 20 20' fill='currentColor'>
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                  </svg>
                  <span className='ml-1'>{lawyer.rating}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => connectWithLawyer(lawyer.id)}
              className={`mt-3 w-full py-1.5 rounded text-sm ${
                lawyer.online ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 cursor-not-allowed'
              }`}
              disabled={!lawyer.online}
            >
              {lawyer.online ? 'Kết nối ngay' : 'Không trực tuyến'}
            </button>
          </div>
        ))}
      </div>
      <div className='p-4 border-t border-gray-700'>
        <button className='w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm'>Xem tất cả luật sư</button>
      </div>
    </div>
  )

  return (
    <>
      <LawyerConnectButton />
      <LawyersPanel />
    </>
  )
}

export { LawyerConnect, type Lawyer }
export default LawyerConnect 