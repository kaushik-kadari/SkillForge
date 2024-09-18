import React from 'react'
import { AiOutlineRead } from "react-icons/ai";
import { FiPlayCircle } from "react-icons/fi";
import { BiTargetLock } from "react-icons/bi";
import { BsChatRightText } from "react-icons/bs";
import { VscFeedback } from "react-icons/vsc";

const Content = () => {
  return (
    <div className='grid grid-cols-3 p-7 gap-5 items-start'>
        <div className='w-11/12 mx-auto bg-[#ebe7de5b] p-2 rounded-md border shadow-lg'>
            <h1 className='text-2xl font-bold text-center my-2 underline border-b-2 pb-4 cursor-pointer'>Subject Name</h1>
            <p className='text-xl text-center font-semibold my-4'>Topic Name</p>
            <div className='flex flex-col md:space-y-5 space-y-8 p-1'>
              <p className='text-xl flex items-center gap-3 cursor-pointer bg-[#e4e2e2] p-2 rounded-md'> <AiOutlineRead style={{opacity:"0.5"}}/> Read Content</p>
              <p className='text-xl flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-[#e4e2e2] '> <FiPlayCircle style={{opacity:"0.5"}}/> Watch Video</p>
              <p className='text-xl flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-[#e4e2e2]'> <BiTargetLock style={{opacity:"0.5"}}/> Take Quiz</p>
              <p className='text-xl flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-[#e4e2e2]'> <BsChatRightText style={{opacity:"0.5"}}/> Chat with Pdf</p>
              <p className='text-xl flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-[#e4e2e2]'> <VscFeedback style={{opacity:"0.5"}}/> Feedback</p>
            </div>
        </div>
        <div className='w-full mx-auto col-span-2 bg-[#ebe7de5b] p-2 rounded-md border shadow-lg min-h-[100vh]'>
          <h1 className='text-2xl font-bold text-center my-2  pb-4 cursor-pointer'>PDF content</h1>
          <p className='px-10'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad iure impedit provident molestias sunt quae minus totam deleniti veritatis reprehenderit, facere laborum quia adipisci dicta facilis dignissimos similique numquam ducimus tempora quasi delectus sapiente omnis. Dolores laborum eos officiis alias repellendus at iure id atque ex eius, hic maxime. Corporis asperiores quasi nulla, delectus autem debitis saepe error ipsa adipisci vitae reprehenderit quos tempore distinctio laborum, earum dolore non quia beatae nostrum. Perspiciatis sequi voluptate id minima ipsam fugiat aperiam eveniet saepe quasi, laboriosam dignissimos ut neque beatae recusandae veniam ipsa unde omnis enim nostrum qui? Illum laborum sit temporibus quidem corrupti, repudiandae sapiente esse hic! Nemo expedita pariatur iusto fuga animi repellat libero molestiae est ut. Voluptatem doloribus, consequatur architecto id quod ratione, assumenda tempore ea possimus esse asperiores perferendis facilis repellat! Voluptatibus vitae explicabo tempora repellat dolorem, facere cum debitis suscipit. Voluptates minus beatae dicta, necessitatibus distinctio ut architecto facere soluta animi dolorem nostrum maiores saepe quasi, vel optio iure, ex eos. Voluptatum quo expedita fugiat quia voluptates cum eaque, facilis possimus ipsam, ab illo. Laboriosam nulla, quidem, dolorum consectetur natus quasi fuga rem facere odit pariatur incidunt aliquam accusamus veritatis quibusdam voluptas magnam quo similique, quisquam molestias commodi. Minima voluptatem, aliquid, omnis reiciendis voluptates iusto eos necessitatibus iure molestias consequuntur tempore sapiente. Nostrum, dignissimos. Voluptas iusto vero illum magni, veniam mollitia ipsam porro accusamus non itaque voluptatibus facilis dolorum reiciendis ad impedit numquam cupiditate repellendus nostrum? Beatae ab, fugit unde enim in vel voluptatum sint soluta, eius, consectetur debitis tempora? Qui amet quis excepturi nulla voluptas alias voluptatem dolorum corporis reiciendis commodi, laborum facilis distinctio error eius modi numquam sit corrupti doloremque quod aliquam, quam eum dolorem. Neque placeat expedita officiis, ex, eveniet saepe reprehenderit nobis nostrum error repellendus veniam suscipit nisi porro nesciunt cumque dignissimos commodi animi, qui quasi impedit! Ullam natus autem recusandae voluptatum perferendis tempora iusto doloremque aut dolores quo ea dolorum adipisci fugit, animi perspiciatis unde repudiandae rerum ipsum optio magni sapiente iure, eum sed? Repudiandae odio eaque dignissimos perspiciatis autem atque laborum quidem a quae sequi voluptatibus neque, modi aut qui asperiores quasi eius ea earum consequatur quam, inventore harum soluta? Excepturi ut eveniet perspiciatis saepe ex similique accusantium aut explicabo obcaecati tenetur consequuntur iste, culpa reprehenderit sed exercitationem fuga quae nisi placeat distinctio iure eum! Perferendis dignissimos delectus ut ullam, eaque animi voluptatum corrupti aliquam, nam deleniti at culpa cupiditate voluptates illum exercitationem quisquam a. Dolorum atque, possimus ratione quia, laborum deserunt adipisci et magnam consequatur harum, nobis saepe! Expedita pariatur magni excepturi ullam porro nihil, eius, itaque facilis quisquam sunt veniam beatae quia corrupti repellendus velit cum accusamus provident dolor nisi incidunt impedit laboriosam. Molestiae corporis magnam odio aliquid provident eaque fuga ut voluptatibus optio mollitia a, tenetur numquam fugit. Rem modi commodi explicabo quisquam, odio a necessitatibus voluptas consectetur fugiat incidunt, impedit accusantium repellat! Consequatur nesciunt illum, saepe nisi eum laboriosam, nulla dignissimos cumque corporis quia voluptatem? Adipisci eligendi voluptatem atque ut modi! Recusandae praesentium dolorem tempora provident. Ipsam?</p>
        </div>
    </div>
  )
}

export default Content
