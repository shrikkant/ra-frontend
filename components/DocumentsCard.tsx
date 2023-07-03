import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const DocumentsCard = ({ customer }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    setFileList(customer.documents?.map((document) => {
      return {
        uid: document.id,
        name: document.name,
        status: 'done',
        url: "/uploads/" + document.file_name,
      }
    }));
  }, [customer]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const isPdf = (doc) => {
    console.log("Is PDF : ", (doc.lastIndexOf("pdf") > -1));
    return (doc.lastIndexOf("pdf") > -1);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (

    <>
      {fileList && <Upload
        capture={true}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {uploadButton}
        {/* {fileList.length >= 8 ? null : uploadButton} */}
      </Upload>}

      <Modal bodyStyle={{height:"50vh"}} open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        {isPdf(previewImage) ?
          <embed src={previewImage} style={{ width: '100%', height:'100%'}} /> :
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        }
      </Modal>
    </>
  );
};

export default DocumentsCard;
