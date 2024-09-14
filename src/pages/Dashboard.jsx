import React from 'react'

const Dashboard = () => {
  return (
   <>
    <div className=''>
        <h1 className='text-4xl font-bold text-center my-10'>Dashboard</h1>
        <div className="lg:grid lg:grid-cols-3 gap-4 p-10 flex flex-col max-h-2/3 ">
          <div className="bg-[#ebe7de5b] w-11/12 mx-auto rounded-md border shadow-lg p-2" >
               <div className='grid grid-cols-2 gap-4'>
               <div className=' w-11/12 mx-auto'>
                      <p className='bg-[#e4e2e2] text-2xl text-center rounded-md my-2'>Topics</p>
                      <div className='flex flex-col md:space-y-12 space-y-8 mt-2'>
                      <p className='text-xl text-center '>Languages</p>
                      <p className='text-xl text-center '>Frontend</p>
                      <p className='text-xl text-center '>Backend</p>
                      <p className='text-xl text-center text-nowrap'>Machine Learning</p>
                      <p className='text-xl text-center '>Aptitude</p>
                      </div>  
               </div>
               <div className=''>
                      <p className='bg-[#e4e2e2] text-2xl text-center rounded-md my-2'>Badges</p>
                      <div className='flex flex-col md:space-y-12 space-y-8 mt-2'>
                        <p className='text-xl text-center '>5 of 10</p>
                        <p className='text-xl text-center '>5 of 10</p>
                        <p className='text-xl text-center '>6 of 10</p>
                        <p className='text-xl text-center '>7 of 10</p>
                        <p className='text-xl text-center'>3 of 10</p>
                      </div>
               </div>
               </div>
          </div>
         
          <div className='bg-[#ebe7de5b] w-11/12 mx-auto rounded-md border shadow-lg md:col-span-2'>
            <p className='text-2xl text-center m-2 p-2 bg-[#e4e2e2] rounded-md'>Progress</p>
            
            {/* Horizontal scroll for small and medium screens */}
            <div className="md:hidden flex flex-col justify-center mt-8 md:mt-24">
              <div className="overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4" style={{ scrollBehavior: 'smooth' }}>
                <div className="flex space-x-4 justify-start items-center">
                  {/* Languages */}
                  <div className="flex-shrink-0 w-full snap-center text-center">
                    <div
                      className="radial-progress bg-[#e4e2e2] text-primary-content border-[#e4e2e2] border-4 mx-auto"
                      style={{ "--value": 75 }}
                      role="progressbar"
                    >
                      75%
                    </div>
                    <p className='text-xl mt-4'>Languages</p>
                  </div>

                  {/* Frontend */}
                  <div className="flex-shrink-0 w-full snap-center text-center">
                    <div
                      className="radial-progress bg-[#e4e2e2] text-primary-content border-[#e4e2e2] border-4 mx-auto"
                      style={{ "--value": 80 }}
                      role="progressbar"
                    >
                      80%
                    </div>
                    <p className='text-xl mt-4'>Frontend</p>
                  </div>

                  {/* Backend */}
                  <div className="flex-shrink-0 w-full snap-center text-center">
                    <div
                      className="radial-progress bg-[#e4e2e2] text-primary-content border-[#e4e2e2] border-4 mx-auto"
                      style={{ "--value": 70 }}
                      role="progressbar"
                    >
                      70%
                    </div>
                    <p className='text-xl mt-4'>Backend</p>
                  </div>

                  {/* Machine Learning */}
                  <div className="flex-shrink-0 w-full snap-center text-center">
                    <div
                      className="radial-progress bg-[#e4e2e2] text-primary-content border-[#e4e2e2] border-4 mx-auto"
                      style={{ "--value": 60 }}
                      role="progressbar"
                    >
                      60%
                    </div>
                    <p className='text-xl mt-4'>Machine Learning</p>
                  </div>

                  {/* Aptitude */}
                  <div className="flex-shrink-0 w-full snap-center text-center">
                    <div
                      className="radial-progress bg-[#e4e2e2] text-primary-content border-[#e4e2e2] border-4 mx-auto"
                      style={{ "--value": 55 }}
                      role="progressbar"
                    >
                      55%
                    </div>
                    <p className='text-xl mt-4'>Aptitude</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid layout for large screens */}
            <div className="hidden md:grid md:grid-cols-5 md:gap-8 md:mt-8 lg:mt-24">
              {/* Languages */}
              <div className="text-center">
                <div
                  className="radial-progress bg-[#e4e2e2] text-primary-content border-[#e4e2e2] border-4 mx-auto"
                  style={{ "--value": 75 }}
                  role="progressbar"
                >
                  75%
                </div>
                <p className='text-xl mt-4'>Languages</p>
              </div>

              {/* Frontend */}
              <div className="text-center">
                <div
                  className="radial-progress bg-[#e4e2e2] text-primary-content border-[#e4e2e2] border-4 mx-auto"
                  style={{ "--value": 80 }}
                  role="progressbar"
                >
                  80%
                </div>
                <p className='text-xl mt-4'>Frontend</p>
              </div>

              {/* Backend */}
              <div className="text-center">
                <div
                  className="radial-progress bg-[#e4e2e2] text-primary-content border-[#e4e2e2] border-4 mx-auto"
                  style={{ "--value": 70 }}
                  role="progressbar"
                >
                  70%
                </div>
                <p className='text-xl mt-4'>Backend</p>
              </div>

              {/* Machine Learning */}
              <div className="text-center">
                <div
                  className="radial-progress bg-[#e4e2e2] text-primary-content border-[#e4e2e2] border-4 mx-auto"
                  style={{ "--value": 60 }}
                  role="progressbar"
                >
                  60%
                </div>
                <p className='text-xl mt-4'>Machine Learning</p>
              </div>

              {/* Aptitude */}
              <div className="text-center">
                <div
                  className="radial-progress bg-[#e4e2e2] text-primary-content border-[#e4e2e2] border-4 mx-auto"
                  style={{ "--value": 55 }}
                  role="progressbar"
                >
                  55%
                </div>
                <p className='text-xl mt-4'>Aptitude</p>
              </div>
            </div>
          </div>        
        </div>
    </div>
   </>
  )
}

export default Dashboard