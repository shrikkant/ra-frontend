import React from 'react'
import Form from './form/Form'
import { useState } from 'react'
import axios from 'axios'
import { IDocument } from '../../app-store/app-defaults/types'

export default function DocumentUpload() {

  const [file, setFile] = useState()

  function handleChange(event) {
    setFile(event.target.files[0])
  }

  function handleSubmit(event) {
    event.preventDefault()


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

  return (<Form>
    <div className="flex flex-col" >
      <label className="text-left pb-4">Address Proof 1</label>
      <div className="flex justify-between">
        <input type="file" className="bg-gray-200 p-2" onChange={handleChange} />
        <button type="submit" className="bg-gray-200 rounded p-2">
          Upload
        </button>
      </div>
    </div>


  </Form>)
}
