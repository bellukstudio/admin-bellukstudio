"use client"
import Loader from "@/components-theme/common/Loader";
import ErrorMessage from "@/components/Errors/error-message";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useAuth } from "@/core/context/authContext";
import apiService from "@/core/response/apiResponse";
import { experienceValidationSchema } from "@/core/validation/schemaValidation";
import { validateForm } from "@/core/validation/utility/validationForm";
import { Experience } from "@/types/experience";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const EditExperience = () => {

    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const { logout } = useAuth();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        jobTitle: "",
        company: "",
        startMonth: "",
        finishMonth: "",
        overview: ""
    });
    const [errorForm, setErrorForm] = useState<any[]>([]);



    useEffect(() => {
        if (typeof id === "string") {
            fetchExperience(id); // id is explicitly a string here
        }
        setTimeout(() => setLoading(false), 1000);
    }, []);


    const fetchExperience = async (id: string) => {
        try {
            const response = await apiService.get<{ experience: Experience }>(`/experiences/${id}`);
            const fetchExperience = response.data.experience;
            setFormData(fetchExperience);
        } catch (error) {
            console.error('Failed to fetch experience:', error);
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
            const validationResponse = validateForm(experienceValidationSchema, {
                jobtitle: formData.jobTitle,
                company: formData.company,
                startMonth: formData.startMonth,
                finishMonth: formData.finishMonth,
                overview: formData.overview
            })

            if (!validationResponse.success) {
                setErrorForm(validationResponse.errors);
                setLoading(false);
                throw new Error("Validation failed");
            }

            setErrorForm([]);
            const response = await apiService.update<{ experience: Experience }>(`/experiences/${id}/update`, {
                'jobTitle': formData.jobTitle,
                'company': formData.company,
                'startMonth': formData.startMonth,
                'finishMonth': formData.finishMonth,
                'overview': formData.overview,
            });

            if (response.meta.code !== 200) {
                if (response.meta.message === "Unauthorized") {
                    logout();
                    router.push("/");
                }
                throw new Error(`Failed to update experience. ${response.meta.message}`);
            }
            router.replace("/experience");
        } catch (error) {
            console.error("Error during experience update:", error);
            alert(error instanceof Error ? error.message : "An error occurred. Please try again.");
        }
    }

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
                                        Job title
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.jobTitle}
                                        onChange={handleChange}
                                        name="jobTitle"
                                        placeholder="Enter your job title"
                                        required
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                    <ErrorMessage errors={errorForm} field="jobtitle" />
                                </div>

                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Company
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.company}
                                        onChange={handleChange}
                                        name="company"
                                        placeholder="Enter your company"
                                        required
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                    <ErrorMessage errors={errorForm} field="company" />
                                </div>
                            </div>
                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Start Month
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.startMonth}
                                        onChange={handleChange}
                                        name="startMonth"
                                        placeholder="Enter your start month"
                                        required
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />

                                    <ErrorMessage errors={errorForm} field="startMonth" />
                                </div>

                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Finish Month
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.finishMonth}
                                        onChange={handleChange}
                                        name="finishMonth"
                                        placeholder="Enter your finish month"
                                        required
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                    <ErrorMessage errors={errorForm} field="finishMonth" />
                                </div>
                            </div>
                            <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Overview
                                </label>
                                <textarea
                                    value={formData.overview}
                                    onChange={handleChange}
                                    name="overview"
                                    cols={30}
                                    rows={10}
                                    placeholder="Enter your overview"
                                    required
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                ></textarea>
                                <ErrorMessage errors={errorForm} field="overview" />
                            </div>

                            <div className='mb-5 flex flex-col gap-6 xl:flex-row'>
                                <div className='w-full xl:w-1/2'>
                                    <button onClick={handleSubmit} className="flex w-full justify-center rounded-full bg-primary p-3 font-medium text-gray hover:bg-opacity-90" >
                                        Post Experience
                                    </button>
                                </div>
                                <div className='w-full xl:w-1/2'>
                                    <Link href="/experience" className="flex w-full justify-center rounded-full bg-danger p-3 font-medium text-gray hover:bg-opacity-90">
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

export default EditExperience;