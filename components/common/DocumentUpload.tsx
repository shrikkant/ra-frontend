import React, { useEffect } from 'react'
import Form from './form/Form'
import { useState } from 'react'
import axios from 'axios'
import { IDocument } from '../../app-store/app-defaults/types'
import { useSelector } from 'react-redux'
import { selectAuthState } from '../../app-store/auth/auth.slice'

export default function DocumentUpload() {
  const loggedUser = useSelector(selectAuthState);
  const [address, setAddress] = useState<any>()
  const [file, setFile] = useState()


  useEffect(() => {
    if (loggedUser) {
      setAddress(loggedUser?.address?.at(-1))
    }
  }, [loggedUser])
  function handleChange(event) {
    console.log("File : ", event.target.files[0])
    setFile(event.target.files[0])
  }

  function handleSubmit() {
    console.log("File : ", file)



    // const document: any = {};

    // document.file_name = file.name;
    // document.size = file?.size;
    // document.type = file?.type;
    // document.address_id = -1;

    // document.file_type = file.type;
    // if (!data.type) {
    //   document.type = 0;
    // }

    // const url = 'https://alpha.rentacross.com/api/user/documents/1/files';
    // const formData = new FormData();
    // formData.append('file', file);
    // formData.append('fileName', file.name);

    // const config = {
    //   headers: {
    //     'content-type': 'multipart/form-data',
    //   },
    // };
    // axios.post(url, formData, config).then((response) => {
    //   console.log(response.data);
    // });

  }

  return (<>


    <div className="flex flex-col p-2 gap-y-3" >
      <div className={"text-2xl font-bold border-b-gray-400 border-b pb-2"}>
        Documents Pending
      </div>
      {address && <div className="flex flex-col">
        <span>{address.name},</span>
        <span>{address.address_line_1},</span>
        <span>{address.address_line_2},</span>
        <span className="font-semibold">{address.city}, {address.postal_code}</span>

        {/* {JSON.stringify(address)} */}
      </div>}
      <div>
        <label className="text-left pb-4">Document 1</label>
        <div className="flex justify-between">
          <input type="file" className="bg-gray-200 p-2" onChange={handleChange} multiple />
          <button type="submit" className="bg-gray-200 rounded p-2" onClick={() => handleSubmit()}>
            Upload
          </button>
        </div>
      </div>
      <div>
        <label className="text-left pb-4">Document 2</label>
        <div className="flex justify-between">
          <input type="file" className="bg-gray-200 p-2" onChange={handleChange} />

          <button type="submit" className="bg-gray-200 rounded p-2" onClick={() => handleSubmit()}>
            Upload
          </button>
        </div>
      </div>

      <div>
        <div className={"text-lg font-semibold text-green-700 border-b-gray-400 border-b pb-1"}>
          Valid Documents:
        </div>
        <div>
          <ol>
            <li>Passport</li>
            <li>Driving License</li>
            <li>Electricity Bill</li>
            <li>Aadhaar Card</li>
            <li>Rent Agreement</li>
          </ol>
        </div>
      </div>
    </div>



  </>)
}
