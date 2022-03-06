import { BsArrowUpRight } from "react-icons/bs"
import { FaRegComment } from "react-icons/fa"
import { GiArrowCursor } from "react-icons/gi"
import { MdWatchLater } from "react-icons/md"

const Box = ({ title, icon, result, progress, today }) => {
  return (
    <div className="flex items-start px-8 py-5 space-x-4 transition-transform duration-500 bg-white border rounded-md hover:transform hover:-translate-y-4 border-lightGrey">
      <div className="p-3 rounded-full bg-primary bg-opacity-10 text-primary">
        {icon}
      </div>
      <div className="pt-3 space-y-8">
        <h5 className="text-primaryDark">{title}</h5>
        <div className="space-y-4">
          <h2>{result}</h2>
          <div className="flex items-center space-x-5">
            <BsArrowUpRight />
            <p className="text-lg text-primaryDark">{progress} %</p>
            <p className="text-lg text-secondaryDark">{today}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ProgressBox = () => {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-3 gap-9">
          <Box
            icon={<FaRegComment />}
            title="Points"
            result="850"
            progress="5.0"
            today="+45 today"
          />

          <Box
            icon={<GiArrowCursor />}
            title="Problems Solved"
            result="539"
            progress="5.0"
            today="+10 today"
          />

          <Box
            icon={<MdWatchLater />}
            title="Reading TIme"
            result="156h"
            progress="5.0"
            today="-13m 35s"
          />
        </div>
      </div>
    </div>
  )
}

export default ProgressBox
