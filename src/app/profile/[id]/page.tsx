"use client"

import Loader from '@/components-theme/common/Loader';
import ErrorMessage from '@/components/Errors/error-message';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { useAuth } from '@/core/context/authContext';
import apiService from '@/core/response/apiResponse';
import { editProfileValidationSchema } from '@/core/validation/schemaValidation';
import { validateForm } from '@/core/validation/utility/validationForm';
import { Profile } from '@/types/profile';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const EditProfile = ({ params }: { params: { id: string } }) => {
    const [photo, setPhoto] = useState<File | null>(null);
    const [background, setBackground] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const { logout } = useAuth();
    const [errorForm, setErrorForm] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        firstName: "",
        email: "",
        contact: "",
        overview: "",  
        livein: "",
        available: "",
        degree: "",
        birthday: "",
    });

    useEffect(() => {
        if (params?.id) {
            fetchProfile(params.id);
        }
        setTimeout(() => setLoading(false), 1000);
    }, [params, loading]);

    const fetchProfile = async (id: string) => {
        try {
            const response = await apiService.get<{ profile: Profile }>(`/myprofile/${id}`);
            if (response.meta.code == 200) {
                const data = response.data.profile;
                setFormData({
                    firstName: data.fullname || "",
                    email: data.email || "",
                    contact: data.contact || "",
                    overview: data.overview || "",
                    livein: data.liveIn || "",
                    available: data.available || "",
                    degree: data.degree || "",
                    birthday: data.birthOfDay || "",
                });
            }
        } catch (error) {
            console.error("Error during profile creation:", error);
            alert(error instanceof Error ? error.message : "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const validationResponse = validateForm(editProfileValidationSchema, {
                firstname: formData.firstName,
                email: formData.email,
                contact: formData.contact,
                overview: formData.overview,
                livein: formData.livein,
                available: formData.available,
                degree: formData.degree,
                birthday: formData.birthday,

            });

            if (!validationResponse.success) {
                setErrorForm(validationResponse.errors);
                throw new Error("Validation failed");
            }


            setErrorForm([]);
            const postProfile = await apiService.update<{ profile: Profile }>(`/myprofile/${params?.id}/update`, {
                'fullname': formData.firstName,
                'email': formData.email,
                'contact': formData.contact,
                'overview': formData.overview,
                'liveIn': formData.livein,
                'available': formData.available,
                'degree': formData.degree,
                'birthOfDay': formData.birthday,
            });

            if (postProfile.meta.code != 200) {
                if (postProfile.meta.message === "Unauthorized") {
                    logout();
                    router.replace('/');
                }
                throw new Error(`Failed to create profile. ${postProfile.meta.code}`);

            }

            if (photo) {
                const responsePhoto = await apiService.uploadFile(`/myprofile/upload/${params?.id}`, photo);
                if (![200, 201].includes(responsePhoto.meta.code)) {
                    throw new Error("Failed to upload photo.");
                }
            }

            if (background) {
                const responseBackground = await apiService.uploadFile(`/myprofile/uploadBackground/${params?.id}`, background);
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
                            <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="firstname"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="Enter your first name"
                                    required
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                                <ErrorMessage errors={errorForm} field="firstname" />
                            </div>
                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Live In
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.livein}
                                        onChange={handleChange}
                                        placeholder="Enter your live in"
                                        required
                                        name='livein'
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                    <ErrorMessage errors={errorForm} field='livein' />
                                </div>

                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Available
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.available}
                                        onChange={handleChange}
                                        placeholder="Enter your availabe"
                                        required
                                        name='available'
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                    <ErrorMessage errors={errorForm} field='available' />
                                </div>
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name='email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email address"
                                    required
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                                <ErrorMessage errors={errorForm} field="email" />
                            </div>
                            <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Degree
                                </label>
                                <input
                                    type="text"
                                    value={formData.degree}
                                    onChange={handleChange}
                                    placeholder="Degree"
                                    required
                                    name='degree'
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                                <ErrorMessage errors={errorForm} field='degree' />
                            </div>
                            <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    BirthDay
                                </label>
                                <input
                                    type="date"
                                    value={formData.birthday}
                                    onChange={handleChange}
                                    placeholder="Birth Day"
                                    required
                                    name='birthday'
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                                <ErrorMessage errors={errorForm} field='birthday' />
                            </div>
                            <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Contact
                                </label>
                                <input
                                    type="text"
                                    value={formData.contact}
                                    name='contact'
                                    onChange={handleChange}
                                    placeholder="Contact"
                                    required
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                                <ErrorMessage errors={errorForm} field="contact" />
                            </div>

                            <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                                <div className='w-full xl:w-1/2'>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Attach file Photo
                                    </label>
                                    <input
                                        type="file"
                                        name='photo'
                                        onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                                        className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                                    />
                                </div>
                                <div className='w-full xl:w-1/2'>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Attach file Background
                                    </label>
                                    <input
                                        type="file"
                                        name='background'
                                        onChange={(e) => setBackground(e.target.files?.[0] || null)}
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
                                    value={formData.overview}
                                    onChange={handleChange}
                                    name='overview'
                                    placeholder="Type your message"
                                    required
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                ></textarea>
                                <ErrorMessage errors={errorForm} field="overview" />
                            </div>

                            <div className='mb-5 flex flex-col gap-6 xl:flex-row'>
                                <div className='w-full xl:w-1/2'>
                                    <button className="flex w-full justify-center rounded-full bg-primary p-3 font-medium text-gray hover:bg-opacity-90" onClick={handleSubmit}>
                                        Update Profile
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

export default EditProfile;