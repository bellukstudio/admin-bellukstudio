"use client"
import Loader from "@/components-theme/common/Loader";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useAuth } from "@/core/context/authContext";
import apiService from "@/core/response/apiResponse";
import { Overview } from "@/types/overview";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const OverviewPage = () => {

    const [loading, setLoading] = useState<boolean>(true);
    const [overview, setOverview] = useState("");

    const router = useRouter();
    const { logout } = useAuth();

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, [loading]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await apiService.post<{ overview: Overview }>('/overview/store', {
                overview: overview
            });
            if (response.meta.code !== 201) {
                if (response.meta.message === "Unauthorized") {
                    logout();
                    router.push('/login');
                }
                throw new Error(response.meta.message);
            }
            router.push('/overview');
        } catch (error) {
            console.error("Error during overview creation:", error);
            alert(error instanceof Error ? error.message : "An error occurred. Please try again.");
        }finally {
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
                                    Overview
                                </label>
                                <textarea
                                    placeholder="Enter your overview"
                                    onChange={(e) => setOverview(e.target.value)}
                                    value={overview}
                                    cols={30}
                                    rows={10}
                                    required
                                    className=" w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                ></textarea>
                            </div>

                            <div className='mb-5 flex flex-col gap-6 xl:flex-row'>
                                <div className='w-full xl:w-1/2'>
                                    <button onClick={handleSubmit} className="flex w-full justify-center rounded-full bg-primary p-3 font-medium text-gray hover:bg-opacity-90" >
                                        Post
                                    </button>
                                </div>
                                <div className='w-full xl:w-1/2'>
                                    <Link href="/overview" className="flex w-full justify-center rounded-full bg-danger p-3 font-medium text-gray hover:bg-opacity-90">
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

export default OverviewPage;