"use client"
import Loader from '@/components-theme/common/Loader';
import ErrorMessage from '@/components/Errors/error-message';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { useAuth } from '@/core/context/authContext';
import apiService from '@/core/response/apiResponse';
import { profileValidationSchema } from '@/core/validation/schemaValidation';
import { validateForm } from '@/core/validation/utility/validationForm';
import { Profile } from '@/types/profile';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
const CreateProfile: React.FC = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [overview, setOverview] = useState("");
    const [photo, setPhoto] = useState<File | null>(null);
    const [background, setBackground] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const { logout } = useAuth();
    const [errorForm, setErrorForm] = useState<any[]>([]);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const validationResponse = validateForm(profileValidationSchema, {
                firstname: firstName,
                lastname: lastName,
                email: email,
                contact: contact,
                overview: overview,

            });

            if (!validationResponse.success) {
                setErrorForm(validationResponse.errors);
                throw new Error("Validation failed");
            }


            setErrorForm([]);
            const fullName = `${firstName} ${lastName}`;
            const postProfile = await apiService.post<{ profile: Profile }>('/myprofile/store', {
                'fullname': fullName,
                'email': email,
                'contact': contact,
                'overview': overview,
            });

            if (postProfile.meta.code !== 201) {
                if (postProfile.meta.message === "Unauthorized") {
                    logout();
                    router.replace('/');
                }
                throw new Error(`Failed to create profile. ${postProfile.meta.message}`);

            }

            const { id } = postProfile.data?.profile ?? {};
            if (!id) {
                throw new Error("Profile ID is missing.");
            }

            if (photo) {
                const responsePhoto = await apiService.uploadFile(`/myprofile/upload/${id}`, photo);
                if (![200, 201].includes(responsePhoto.meta.code)) {
                    throw new Error("Failed to upload photo.");
                }
            }

            if (background) {
                const responseBackground = await apiService.uploadFile(`/myprofile/uploadBackground/${id}`, background);
                if (![200, 201].includes(responseBackground.meta.code)) {
                    throw new Error("Failed to upload background.");
                }
            }

            router.replace('/profile');
        } catch (error) {
            console.error("Error during profile creation:", error);
            alert(error instanceof Error ? error.message : "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };



    return (
        <DefaultLayout>
            {loading ? (
                <div>
                    <Loader />
                </div>
            ) : (
                <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white overflow-x-auto">

                    <form action="#">
                        <div className="p-6.5">
                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        First name
                                    </label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="Enter your first name"
                                        required
                                        name='firstname'
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                    <ErrorMessage errors={errorForm} field='firstname' />
                                </div>

                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Last name
                                    </label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="Enter your last name"
                                        required
                                        name='lastname'
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                    <ErrorMessage errors={errorForm} field='lastname' />
                                </div>
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    required
                                    name='email'
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                                <ErrorMessage errors={errorForm} field='email' />
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Contact
                                </label>
                                <input
                                    type="text"
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                    placeholder="Contact"
                                    required
                                    name='contact'
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                                <ErrorMessage errors={errorForm} field='contact' />
                            </div>

                            <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                                <div className='w-full xl:w-1/2'>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Attach file Photo
                                    </label>
                                    <input
                                        type="file"
                                        onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                                        name='photo'
                                        className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                                    />


                                </div>
                                <div className='w-full xl:w-1/2'>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Attach file Background
                                    </label>
                                    <input
                                        type="file"
                                        onChange={(e) => setBackground(e.target.files?.[0] || null)}
                                        name='background'
                                        className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                                    />

                                </div>
                            </div>


                            <div className="mb-6">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Overview
                                </label>
                                <textarea
                                    rows={6}
                                    value={overview}
                                    name='overview'
                                    onChange={(e) => setOverview(e.target.value)}
                                    placeholder="Type your message"
                                    required
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                ></textarea>
                                <ErrorMessage errors={errorForm} field='overview' />
                            </div>

                            <div className='mb-5 flex flex-col gap-6 xl:flex-row'>
                                <div className='w-full xl:w-1/2'>
                                    <button className="flex w-full justify-center rounded-full bg-primary p-3 font-medium text-gray hover:bg-opacity-90" onClick={handleSubmit}>
                                        Post Profile
                                    </button>
                                </div>
                                <div className='w-full xl:w-1/2'>
                                    <Link href="/profile" className="flex w-full justify-center rounded-full bg-danger p-3 font-medium text-gray hover:bg-opacity-90">
                                        Back
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            )}

        </DefaultLayout>
    );
}


export default CreateProfile;