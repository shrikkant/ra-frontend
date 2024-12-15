import React from 'react';
import { IUser } from '../app-store/types';

const DocumentsCard = ({ customer }: { customer: IUser }) => {
  return (
    <div>
      DocumentsCard : {customer.id}
    </div>
  )
}

export default DocumentsCard;

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useEffect, useState } from 'react';
// import { Modal, Upload } from 'antd';
// import type { RcFile } from 'antd/es/upload';
// import type { UploadFile } from 'antd/es/upload/interface';
// import { addDocument, uploadDocument } from '../api/admin/customers.api';
// import styles from 'styles/documents.module.css';
// import { IUser } from '../app-store/types';
// import { IDocument } from '../app-store/app-defaults/types';
// import { Section } from '../app/components/common/Section';

// const getBase64 = (file: RcFile): Promise<string> =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result as string);
//     reader.onerror = (error) => reject(error);
//   });

// interface UploadButtonProps {
//   type: string
// }
// const UploadButton = ({ type }: UploadButtonProps) => {

//   return (
//     <div style={{ padding: 10 }}>
//       {/* <ArrowDownCircleIcon /> */}
//       <div style={{ marginTop: 8 }}>{DocTypes[type]}</div>
//     </div>
//   );
// }

// enum DocTypes {
//   "pan" = "Pan Card",
//   "passport" = "Passport",
//   "electricity-bill" = "Electricity Bill",
//   "aadhaar-front" = "Aadhar Front",
//   "aadhaar-back" = "Aadhar Back",
//   "driving-license" = "Driving Licence",
//   "rent-agreement" = "Rent Agreement",
//   "index-2" = "Index 2",
// };

// interface DocumentsCardPros {
//   customer: IUser
// }

// const DocumentsCard = ({ customer }: DocumentsCardPros) => {


//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewImage, setPreviewImage] = useState('');
//   const [previewTitle, setPreviewTitle] = useState('');
//   const [fileList, setFileList] = useState<UploadFile[]>([]);
//   const [pendingDocTypes, setPendingDocTypes] = useState<string[]>(Object.keys(DocTypes));

//   useEffect(() => {
//     const list = customer?.documents?.map((document): UploadFile => {
//       return {
//         uid: document.document_type,
//         name: document.document_name ? document.document_name : DocTypes[document.document_type],
//         status: 'done',
//         url: "/uploads/" + document.file_name,
//       }
//     });
//     if (list)
//       setFileList(list);
//     const pendingDocTypes = Object.keys(DocTypes).filter((docType) => {
//       return list?.find((doc) => doc.uid == docType) === undefined;
//     });

//     setPendingDocTypes(pendingDocTypes);
//   }, [customer]);

//   const handleCancel = () => setPreviewOpen(false);

//   const handlePreview = async (file: UploadFile) => {
//     if (!file.url && !file.preview) {
//       file.preview = await getBase64(file.originFileObj as RcFile);
//     }

//     setPreviewImage(file.url || (file.preview as string));
//     setPreviewOpen(true);
//     setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
//   };

//   // const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
//   //   // setFileList(newFileList);
//   // }



//   const customRequest = async ({
//     data,
//     file,
//     filename,
//     onError,
//     onProgress,
//     onSuccess,
//   }, docType: string) => {
//     onSuccess = (doc) => {
//       const docs = [...fileList];

//       docs.push({
//         uid: docType,
//         name: DocTypes[docType],
//         status: 'done',
//         url: "/uploads/" + doc.filename,
//       });

//       setFileList(docs);
//       const pendingDocTypes = Object.keys(DocTypes).filter((docType) => {
//         return docs?.find((doc) => doc.uid == docType) === undefined;
//       });

//       setPendingDocTypes(pendingDocTypes);
//     }

//     file.document_type = docType;
//     file.document_name = DocTypes[docType];

//     const document: IDocument = await addDocument(customer.id, docType, file);

//     const formData = new FormData();
//     if (data) {
//       Object.keys(data).forEach(key => {
//         formData.append(key, data[key]);
//       });
//     }
//     formData.append(filename, file);

//     uploadDocument(customer.id, document?.id, file, formData, onProgress, onSuccess, onError);

//     return {
//       abort() {
//       },
//     };


//   }

//   const isPdf = (doc) => {
//     return (doc.lastIndexOf("pdf") > -1);
//   };

//   return (<Section title={"Documents"}>

//     <div className={styles.docsBox}>

//       <div className="p-4 flex flex-col gap-y-4">
//         <div>
//           <Upload
//             listType="picture-card"
//             fileList={fileList}
//             showUploadList={{ showRemoveIcon: false }}
//             onPreview={handlePreview}
//           >
//           </Upload>
//         </div>

//         <div className={"flex flex-wrap gap-x-2 xs:gap-y-4"}>
//           {pendingDocTypes.map((docType: string) => {
//             return <div key={docType}>
//               <Upload
//                 action="/api/upload.do"
//                 listType="picture-card"
//                 fileList={fileList}
//                 showUploadList={false}
//                 onPreview={handlePreview}
//                 customRequest={(options: any) => customRequest(options, docType)}
//               >
//                 <UploadButton type={docType} />

//               </Upload>
//             </div>
//           })}
//         </div>

//       </div>


//       <Modal style={{ height: "50vh" }} open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
//         {isPdf(previewImage) ?
//           <embed src={previewImage} style={{ width: '100%', height: '100%' }} /> :
//           <img alt="example" style={{ width: '100%' }} src={previewImage} />
//         }
//       </Modal>
//     </div>
//   </Section>);
// };

// export default DocumentsCard;
