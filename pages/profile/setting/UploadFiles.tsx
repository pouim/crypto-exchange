import React, { FC, useState } from 'react';
import { useDeleteDoc, useGetUserDoc, useSendDoc } from 'hooks/hooks';
import { queryClient } from 'pages/_app';
import { Button, Modal } from '@components/ui';
import { useMutation } from 'react-query';
import gate from '@gate/index';
import { showError, toast } from 'src/utils';
import useTranslation from 'next-translate/useTranslation';

interface Props {
    title: string;
}

const CardUpload: FC<Props> = ({ title }) => {
    const [showModal, setShowModal] = useState(false);
    const { mutate: sendDoc } = useSendDoc();
    const { mutate: deleteDoc } = useDeleteDoc();
    const { data: docs }: any = useGetUserDoc();
    const { mutate: replaceDocReq } = useMutation(gate.replaceDoc);
    const { t } = useTranslation();

    const data = docs?.find((doc) => doc.title === title);

    const handleUploadFile = (file: any, title, isReplaceFile = false) => {
        // console.log({ file.ta });
        let formData = new FormData();
        formData.append('document', file.target.files[0]);
        formData.append('title', title);
        if (confirm('Are You Sure You Want to send the file?')) {
            if (isReplaceFile) {
                replaceDocReq(
                    { id: data.id, data: formData },
                    {
                        onSuccess: () => {
                            queryClient.refetchQueries('user-doc');
                            toast('File uploaded successfully');
                        },
                        onError: (err: any) => toast('The upload failed', { color: 'red' }),
                    },
                );
            } else {
                sendDoc(formData, {
                    onSuccess: () => {
                        queryClient.refetchQueries('user-doc');
                        toast('File uploaded successfully');
                    },
                    onError: (err: any) => toast('The upload failed', { color: 'red' }),
                });
            }
        } else {
            console.log('Thing was not saved to the database.');
        }
    };

    const handleDeleteDoc = (id: string) => {
        deleteDoc(id);
    };
    return (
        <>
            <Modal onClose={() => setShowModal(false)} visible={showModal}>
                <div className="bg-white p-5 rounded-md text-gray-600">
                    are you sure to upload this file ?
                    <div className="flex">
                        <Button
                            className="btn text-white m-1 bg-green-600"
                            onClick={() => setShowModal(false)}
                        >
                            Yes
                        </Button>
                        <Button className="btn text-white m-1 bg-gray-500">No</Button>
                    </div>
                </div>
            </Modal>
            <div className="bg-c-secondary m-3 rounded-lg py-3 px-5 block place-items-center lg:flex md:justify-between items-center">
                <div className="items-center flex justify-between lg:flex-col lg:place-items-start mb-3 md:mb-1">
                    <small className="block text-gray-500">{t('common:Documents-Type')}</small>
                    <span className="block">{title}</span>
                </div>
                {data && (
                    <>
                        <div className="items-center flex justify-between lg:flex-col lg:place-items-start mb-3 md:mb-1">
                            <small className="block text-gray-500">
                                {t('common:Date-of-create')}
                            </small>
                            <span className="block">{data?.created_at?.split('T')[0]}</span>
                        </div>
                        <div className="items-center flex justify-between lg:flex-col lg:place-items-start mb-3 md:mb-1">
                            <small className="block text-gray-500">{t('common:Status')}</small>
                            <span className="block">{data?.reason}</span>
                        </div>
                    </>
                )}
                <div className="items-center flex justify-center flex-col lg:place-items-start mb-1">
                    <span className="w-max-content">
                        {!data ? (
                            <>
                                <label
                                    htmlFor="file"
                                    className="w-max-content mx-2 whitespace-nowrap cursor-pointer hover:opacity-75 transition-all p-2 border-2 border-green-700 border-dashed text-green-300 rounded-md"
                                >
                                    choose file
                                </label>
                                <input
                                    type="file"
                                    name="file"
                                    id="file"
                                    className="hidden"
                                    onChange={(e) => handleUploadFile(e, title)}
                                />
                            </>
                        ) : (
                            <>
                                {data.status == 'DECLINE' && (
                                    <>
                                        <label
                                            htmlFor="file"
                                            className="w-max-content mx-2 whitespace-nowrap cursor-pointer hover:opacity-75 transition-all p-2 border-2 border-green-700 border-dashed text-green-300 rounded-md"
                                        >
                                            Upload again
                                        </label>
                                        <input
                                            type="file"
                                            name="file"
                                            id="file"
                                            className="hidden"
                                            onChange={(e) => handleUploadFile(e, title, true)}
                                        />
                                    </>
                                )}
                                <span
                                    className={`rounded-md start p-2 ${
                                        data?.status == 'DECLINE'
                                            ? 'bg-red-500'
                                            : data?.status == 'PENDING'
                                            ? 'bg-yellow-500 text-yellow-200'
                                            : 'bg-green-800 text-green-500'
                                    }`}
                                >
                                    {data?.status}
                                </span>
                            </>
                        )}
                    </span>
                </div>
            </div>
        </>
    );
};

const UploadFiles = () => {
    return (
        <>
            <CardUpload title="Passport" />
            <CardUpload title="Picture" />
        </>
    );
};

export default UploadFiles;
