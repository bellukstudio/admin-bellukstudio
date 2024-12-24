"use client"
import { useAuth } from "@/core/context/authContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import Loader from "@/components-theme/common/Loader";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useRouter } from "next/navigation";
import apiService from "@/core/response/apiResponse";
import { Experience } from "@/types/experience";


const CreatExperience = () => {

    const [loading, setLoading] = useState<boolean>(true);

    const router = useRouter();
    const { logout } = useAuth();
    const [jobTitle, setJobTitle] = useState("");
    const [companyTitle, setCompanyTitle] = useState("");
    const [startMonth, setStartMonth] = useState("");
    const [endMonth, setEndMonth] = useState("");
    const [overview, setOverview] = useState("");


    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, [loading]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);

            const response = await apiService.post<{ experience: Experience }>("/experiences/store", {
                'jobtitle': jobTitle,
                'company': companyTitle,
                'startMonth': startMonth,
                'finishMonth': endMonth,
                'overview': overview,
            });

            if(response.meta.code !== 201){
                if(response.meta.message  === "Unauthorized"){
                    logout();
                    router.push("/");
                }
                throw new Error(`Failed to create experience. ${response.meta.message}`);
            }

            router.push("/experience");

        } catch (error) {
            console.error("Error during experience creation:", error);
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
                                        placeholder="Enter your job title"
                                        onChange={(e) => setJobTitle(e.target.value)}
                                        value={jobTitle}
                                        required
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>

                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Company
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your company"
                                        onChange={(e) => setCompanyTitle(e.target.value)}
                                        value={companyTitle}
                                        required
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>
                            </div>
                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Start Month
                                    </label>
                                    <input
                                        type="date"
                                        placeholder="Enter your start month"
                                        onChange={(e) => setStartMonth(e.target.value)}
                                        value={startMonth}
                                        required
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>

                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Finish Month
                                    </label>
                                    <input
                                        type="date"
                                        placeholder="Enter your finish month"
                                        onChange={(e) => setEndMonth(e.target.value)}
                                        value={endMonth}
                                        required
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>
                            </div>
                            <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Overview
                                </label>
                                <textarea
                                    placeholder="Enter your overview"
                                    onChange={(e) => setOverview(e.target.value)}
                                    value={overview}
                                    cols={30}
                                    rows={10}
                                    required
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                ></textarea>
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

export default CreatExperience;