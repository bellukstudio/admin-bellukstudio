"use client"
import Loader from "@/components-theme/common/Loader";
import ErrorMessage from "@/components/Errors/error-message";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useAuth } from "@/core/context/authContext";
import apiService from "@/core/response/apiResponse";
import { overviewValidationSchema } from "@/core/validation/schemaValidation";
import { validateForm } from "@/core/validation/utility/validationForm";
import { Overview } from "@/types/overview";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const OverviewPage = () => {

    const [loading, setLoading] = useState<boolean>(true);
    const [overview, setOverview] = useState("");
    const [urlGithub, setUrlGithub] = useState("");
    const [urlLinkedIn, setUrlLinkedIn] = useState("")
    const [githubName, setGithubName] = useState("");
    const [linkedInName, setLinkedInName] = useState("");
    const [photo, setPhoto] = useState<File | null>(null);

    const router = useRouter();
    const { logout } = useAuth();
    const [errorForm, setErrorForm] = useState<any[]>([]);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, [loading]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {

            const validationResponse = validateForm(overviewValidationSchema, {
                overview: overview,
                urlGithub: urlGithub,
                urlLinkedin: urlLinkedIn,
                githubName: githubName,
                linkedinName: linkedInName,
            });

            if (!validationResponse.success) {
                setErrorForm(validationResponse.errors);
                setLoading(false);
                throw new Error("Validation error");
            }

            const response = await apiService.post<{ overview: Overview }>('/overview/store', {
                overview: overview,
                urlGithub: urlGithub,
                urlLinkedIn: urlLinkedIn,
                githubName: githubName,
                linkedInName: linkedInName,
            });
            if (response.meta.code !== 201) {
                if (response.meta.message === "Unauthorized") {
                    logout();
                    router.push('/');
                }
                throw new Error(response.meta.message);
            }


            const { id } = response.data?.overview ?? {};
            if (!id) {
                throw new Error("Overview ID is missing.");
            }

            if (photo) {
                const responsePhoto = await apiService.uploadFile(`/overview/upload/${id}`, photo);
                if (![200, 201].includes(responsePhoto.meta.code)) {
                    throw new Error("Failed to upload photo.");
                }
            }

            router.push('/overview');
        } catch (error) {
            console.error("Error during overview creation:", error);
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
                                        Url Github
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your url github"
                                        onChange={(e) => setUrlGithub(e.target.value)}
                                        value={urlGithub}
                                        required
                                        name="urlGithub"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                    <ErrorMessage errors={errorForm} field="urlGithub" />
                                </div>

                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Url LinkedIn
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your url linked in"
                                        onChange={(e) => setUrlLinkedIn(e.target.value)}
                                        value={urlLinkedIn}
                                        required
                                        name="urlLinkedIn"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                    <ErrorMessage errors={errorForm} field="urlLinkedin" />
                                </div>
                            </div>
                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Github Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your github"
                                        onChange={(e) => setGithubName(e.target.value)}
                                        value={githubName}
                                        required
                                        name="githubName"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                    <ErrorMessage errors={errorForm} field="githubName" />
                                </div>

                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white"> LinkedIn Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your  linked in"
                                        onChange={(e) => setLinkedInName(e.target.value)}
                                        value={linkedInName}
                                        required
                                        name="linkedInName"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                    <ErrorMessage errors={errorForm} field="linkedinName" />
                                </div>
                            </div>
                            <div className="mb-4.5">
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
                                    name="overview"
                                    required
                                    className=" w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                ></textarea>
                                <ErrorMessage errors={errorForm} field="overview" />
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