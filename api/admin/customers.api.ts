/* eslint-disable @typescript-eslint/no-explicit-any */
import { IDocument } from '../../app-store/app-defaults/types';
import { IAadhaar } from '../../app-store/auth/types';
import { IUser } from '../../app-store/types';
import httpClient from './../axios.config';

export async function fetchCustomers(phone?: number): Promise<IUser[]> {
    const phoneQuery = phone ? `phone=${phone}` : '';
    const customers: IUser[] = await httpClient.get(`/admin/users?${phoneQuery}`);
    return customers;
}

export async function fetchActiveCustomer(id: number): Promise<IUser> {
    const customer: IUser = await httpClient.get(`/admin/users/${id}`);
    return customer;
}

export async function fetchCustomerAadhaar(id: number): Promise<IAadhaar> {
    const aadhaar: IAadhaar = await httpClient.get(`/admin/users/${id}/aadhaar`);
    return aadhaar;
}

export async function addDocument(userId: number, docType: string, side: "front" | "back", file): Promise<any> {
    const document: IDocument = {
        user_id: userId,
        file_name: file.name,
        size: file.size,
        file_type: file.type,
        type: 1,
        document_type: docType,
        side
    };

    const doc = await httpClient.post('/admin/users/' + userId + '/documents', document);

    return doc;

}

export async function updateCustomer(id: number,
    email_address: string,
    phone: string,
    firstname: string,
    lastname: string,
    city: string): Promise<IUser> {
    const updateUser = {
        email_address,
        phone,
        firstname,
        lastname,
        city
    }

    const user: IUser = await httpClient.put(`/admin/users/${id}`, updateUser);
    console.log("Updated User : ", user);
    return user;
}

export async function uploadDocument(id: number,
    userId: number,
    file,
    documentType,
    side,
    onProgress,
    onSuccess,
    onError): Promise<any> {

    const formData = new FormData();
    formData.append('user_id', userId.toString());
    formData.append('file', file);
    formData.append('document_type', documentType);
    formData.append('side', side);
    formData.append('file_name', file.name);
    formData.append('size', file.size.toString());
    formData.append('file_type', file.type);
    formData.append('type', '1');

    httpClient.post(`/admin/users/${id}/documents/files`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: ({ total, loaded }) => {
            const t = total || 0;
            onProgress({ percent: Math.round((loaded / t) * 100).toFixed(2) }, file);
        },
    }).then((data) => {
        onSuccess(data, documentType, side);
    }).catch((er) => {
        onError(er, file);
        console.error(er);
    });

}
