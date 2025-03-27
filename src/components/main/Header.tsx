import Image from 'next/image'
import styles from '@/styles/Home.module.css'

export default function Header() {
  return (
    <div className="w-[1920px] h-[1080px] absolute inline-flex flex-col justify-start items-start gap-0.5">
      <div className="self-stretch px-10 py-8 inline-flex justify-between items-center overflow-hidden">
        <div className="flex justify-start items-center gap-[5px]">
          <div className="flex justify-center">
            <img
              src="/main/logo.png"
              alt="Example"
              width={256}
              height={256}
              className="w-64 h-64 object-cover rounded-lg shadow-lg"
            />
            <img
              src="/main/dashboard.png"
              alt="headerImage"
              className="w-64 h-64 object-cover rounded-lg shadow-lg"
            />
          </div>
          <div className="w-32 h-10 text-center justify-center text-black text-4xl font-normal font-['AppleSDGothicNeoB00']">
            NNMM
          </div>
        </div>
        <div className="flex justify-start items-center gap-11">
          {/* <div className="w-20 h-20 p-5 bg-slate-100 rounded-[40px] shadow-[4px_4px_18px_-2px_rgba(231,228,232,0.80)] flex justify-center items-center gap-2.5">
            <div className="w-10 h-10 relative overflow-hidden">
              <div className="w-10 h-10 left-0 top-0 absolute bg-slate-400"></div>
              <div className="w-4 h-4 left-[11.30px] top-[11.30px] absolute bg-slate-400"></div>
            </div>
          </div> */}
          <div className="w-20 h-20 px-4 py-3 bg-transparent rounded-[40px] inline-flex flex-col justify-center items-center gap-2.5">
            {/*   <div className="w-10 h-10 relative overflow-hidden">
              <div className="w-3 h-2 left-[12.06px] top-[32.50px] absolute bg-red-400"></div>
              <div className="w-8 h-7 left-[1.64px] top-[5px] absolute bg-red-400"></div>
              <div className="w-4 h-4 left-[21.64px] top-0 absolute bg-red-400"></div>
            </div> */}
          </div>
          {/*           <div className="w-20 h-20 bg-stone-300 rounded-full"></div>
           */}
          {/*           <img className="w-48 h-32" src="https://placehold.co/185x123" alt="banner" />
           */}{' '}
        </div>
      </div>
    </div>
  )
}
