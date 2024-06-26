import { IOrder, IUser } from '../../app-store/types';
import httpClient from './../axios.config';

export async function fetchCustomers(): Promise<IUser[]> {
    try {
        const customers: IUser[] = await httpClient.get(`/admin/users`);
        return customers;

    } catch (e) {
        throw e;
    }
}

export async function fetchActiveCustomer(id: number): Promise<IUser> {
    try {
        const customer: IUser = await httpClient.get(`/admin/users/${id}`);
        return customer;

    } catch (e) {
        throw e;
    }
}

export async function addDocument(userId: number, docType: string, file: any): Promise<any> {
    let document: any = {};
    document.user_id = userId;
    document.file_name = file.name;
    document.size = file.size;
    document.file_type = file.type;
    document.type = 1;
    document.document_type = docType;

    const doc = await httpClient.post('/admin/users/' + userId + '/documents', document);

    return doc;

}

export async function uploadDocument(id: number,
    docId: number,
    file: any,
    formData: any,
    onProgress: any,
    onSuccess: any,
    onError: any): Promise<any> {

    httpClient.post(`/admin/users/${id}/documents/${docId}/files`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: ({ total, loaded }) => {
            const t = total || 0;
            onProgress({ percent: Math.round((loaded / t) * 100).toFixed(2) }, file);
        },
    }).then((data) => {
        onSuccess(data);
    }).catch((er) => {
        onError(er, file);
        console.error(er);
    });

}
