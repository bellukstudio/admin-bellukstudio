"use client"

import Loader from "@/components-theme/common/Loader";
import ErrorMessage from "@/components/Errors/error-message";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useAuth } from "@/core/context/authContext";
import apiService from "@/core/response/apiResponse";
import { portfolioValidationSchema } from "@/core/validation/schemaValidation";
import { validateForm } from "@/core/validation/utility/validationForm";
import { Portfolio } from "@/types/portfolio";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const EditPortfolio = ({ params }: { params: { id: string } }) => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { logout } = useAuth();
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [errorForm, setErrorForm] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        urlPortfolio: "",
    });

    const fetchPortfolio = async () => {
        try {
            const response = await apiService.get<{ portfolio: Portfolio }>(`/portfolio/${params.id}`);
            const fetchPortfolio = response.data.portfolio;
            if (response.meta.code === 200) {
                setFormData(fetchPortfolio);
            }

        } catch (error) {
            alert(error instanceof Error ? error.message : "An error occurred. Please try again.");
        }
    }

    useEffect(() => {
        if (params?.id) {
            fetchPortfolio();
        }
        setTimeout(() => setLoading(false), 1000);
    }, [loading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const validationResponse = validateForm(portfolioValidationSchema, {
                title: formData.title,
                description: formData.description,
                urlPortfolio: formData.urlPortfolio,
            });

            if (!validationResponse.success) {
                setErrorForm(validationResponse.errors);
                setLoading(false);
                throw new Error("Please fill in the required fields.");
            }
            const response = await apiService.update<{ portfolio: Portfolio }>(`/portfolio/${params.id}/update`, {
                'title': formData.title,
                'description': formData.description,
                'urlPortfolio': formData.urlPortfolio,
            });

            if (response.meta.code !== 200) {
                if (response.meta.message === "Unauthorized") {
                    logout();
                    router.push("/");
                }
                throw new Error(`Failed to update portfolio. ${response.meta.message}`);
            }

            if (thumbnail) {
                const uploadThumbnail = await apiService.uploadFile(`/portfolio/upload/${params?.id}`, thumbnail);
                if (![200, 201].includes(uploadThumbnail.meta.code)) {
                    throw new Error("Failed to upload photo.");
                }
            }

            alert(response.meta.message);
            router.push("/portfolio");
        } catch (error) {
            alert(error instanceof Error ? error.message : "An error occurred. Please try again.");
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Enter your  title"
                                        required
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                    <ErrorMessage errors={errorForm} field="title" />
                                </div>

                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Url
                                    </label>
                                    <input
                                        type="text"
                                        name="urlPortfolio"
                                        value={formData.urlPortfolio}
                                        onChange={handleChange}
                                        placeholder="Enter your url"
                                        required
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                    <ErrorMessage errors={errorForm} field="urlPortfolio" />
                                </div>
                            </div>

                            <div className="mb-45">
                                <div className="w-full">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Description
                                    </label>
                                    <textarea
                                        placeholder="Enter your description"
                                        rows={10}
                                        value={formData.description}
                                        name="description"
                                        onChange={handleChange}
                                        cols={10}
                                        required
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg dark:text-white"></textarea>
                                    <ErrorMessage errors={errorForm} field="description" />
                                </div>
                            </div>
                            <div className="mb-45">
                                <div className='w-full'>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Attach file Photo
                                    </label>
                                    <input
                                        type="file"
                                        name="thumbnail"
                                        onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                                        className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                                    />
                                </div>
                            </div>


                            <div className='mb-5 flex flex-col gap-6 xl:flex-row'>
                                <div className='w-full xl:w-1/2'>
                                    <button onClick={handleSubmit} className="flex w-full justify-center rounded-full bg-primary p-3 font-medium text-gray hover:bg-opacity-90" >
                                        Post Portfolio
                                    </button>
                                </div>
                                <div className='w-full xl:w-1/2'>
                                    <Link href="/portfolio" className="flex w-full justify-center rounded-full bg-danger p-3 font-medium text-gray hover:bg-opacity-90">
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

export default EditPortfolio;