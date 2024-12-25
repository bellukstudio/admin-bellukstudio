"use client"

import Loader from "@/components-theme/common/Loader";
import ErrorMessage from "@/components/Errors/error-message";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useAuth } from "@/core/context/authContext";
import apiService from "@/core/response/apiResponse";
import { educationValidationSchema } from "@/core/validation/schemaValidation";
import { validateForm } from "@/core/validation/utility/validationForm";
import { Education } from "@/types/education";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const CreatEducation: React.FC = () => {

    const [loading, setLoading] = useState<boolean>(true);
    const [educationLevel, setEducationLevel] = useState("");
    const [institution, setInstitution] = useState("");
    const [fieldOfStudy, setFieldOfStudy] = useState("");
    const [startMonth, setStartMonth] = useState("");
    const [finishMonth, setFinishMonth] = useState("");
    const [errorForm, setErrorForm] = useState<any[]>([]);

    const router = useRouter();
    const { logout } = useAuth();

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, [loading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {

            const validationResponse = validateForm(educationValidationSchema, {
                educationLevel,
                institution,
                fieldOfStudy,
                startMonth,
                finishMonth
            });

            if (!validationResponse.success) {
                setErrorForm(validationResponse.errors);
                setLoading(false);
                throw new Error("Validation failed");
            }

            setErrorForm([]);

            const response = await apiService.post<{ education: Education }>('/education/store', {
                'educationLevel': educationLevel,
                'institution': institution,
                'fieldOfStudy': fieldOfStudy,
                'startMonth': startMonth,
                'finishMonth': finishMonth
            });
            alert(response.meta.message);

            if (response.meta.code !== 201) {
                if (response.meta.message === "Unauthorized") {
                    logout();
                    router.replace('/');
                }
                throw new Error(`Failed to create education. ${response.meta.message}`);

            }

            router.replace('/education');
        } catch (error) {
            console.error("Error during education creation:", error);
            alert(error instanceof Error ? error.message : "An error occurred. Please try again.");
        } finally {
            setLoading(false);
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
                                        Education level
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your education level"
                                        value={educationLevel}
                                        onChange={(e) => setEducationLevel(e.target.value)}
                                        required
                                        name="educationLevel"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                    <ErrorMessage errors={errorForm} field="educationLevel" />
                                </div>

                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Institution
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your institution"
                                        value={institution}
                                        onChange={(e) => setInstitution(e.target.value)}
                                        required
                                        name="institution"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                    <ErrorMessage errors={errorForm} field="institution" />
                                </div>
                            </div>
                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Field of study
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your field of study"
                                        value={fieldOfStudy}
                                        onChange={(e) => setFieldOfStudy(e.target.value)}
                                        required
                                        name="fieldOfStudy"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                    <ErrorMessage errors={errorForm} field="fieldOfStudy" />
                                </div>

                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Start Month
                                    </label>
                                    <input
                                        type="date"
                                        placeholder="Enter your start month"
                                        value={startMonth}
                                        onChange={(e) => setStartMonth(e.target.value)}
                                        required
                                        name="startMonth"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                    <ErrorMessage errors={errorForm} field="startMonth" />
                                </div>
                            </div>
                            <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    End Month
                                </label>
                                <input
                                    type="date"
                                    placeholder="Enter your end month"
                                    value={finishMonth}
                                    onChange={(e) => setFinishMonth(e.target.value)}
                                    required
                                    name="finishMonth"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                                <ErrorMessage errors={errorForm} field="finishMonth" />
                            </div>

                            <div className='mb-5 flex flex-col gap-6 xl:flex-row'>
                                <div className='w-full xl:w-1/2'>
                                    <button onClick={handleSubmit} className="flex w-full justify-center rounded-full bg-primary p-3 font-medium text-gray hover:bg-opacity-90" >
                                        Post Profile
                                    </button>
                                </div>
                                <div className='w-full xl:w-1/2'>
                                    <Link href="/education" className="flex w-full justify-center rounded-full bg-danger p-3 font-medium text-gray hover:bg-opacity-90">
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

export default CreatEducation;