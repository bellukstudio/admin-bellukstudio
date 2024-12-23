"use client"
import Loader from "@/components-theme/common/Loader";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useAuth } from "@/core/context/authContext";
import apiService from "@/core/response/apiResponse";
import { Education } from "@/types/education";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const EditEducation = ({ params }: { params: { id: string } }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const { logout } = useAuth();
    const [formData, setFormData] = useState({
        educationLevel: "",
        institution: "",
        fieldOfStudy: "",
        startMonth: "",
        finishMonth: "",
    });

    useEffect(() => {
        if (params?.id) {
            fetchEducation(params.id);
        }
        setTimeout(() => setLoading(false), 1000);
    }, [params, loading]);


    const fetchEducation = async (id: string) => {
        try {
            const response = await apiService.get<{ education: Education }>(`/education/${id}`);

            if (response.meta.code == 200) {
                const data = response.data.education;
                setFormData({
                    educationLevel: data.educationLevel || "",
                    institution: data.institution || "",
                    fieldOfStudy: data.fieldOfStudy || "",
                    startMonth: data.startMonth || "",
                    finishMonth: data.finishMonth || "",
                });
            }
        } catch (error) {
            console.error("Error during educaiton creation:", error);
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

            const response = await apiService.update<{ education: Education }>(`/education/${params?.id}/update`, {
                'educationLevel': formData.educationLevel,
                'institution': formData.institution,
                'fieldOfStudy': formData.fieldOfStudy,
                'startMonth': formData.startMonth,
                'finishMonth': formData.finishMonth
            });
            alert(response.meta.message);

            if (response.meta.code !== 200) {
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
                                        value={formData.educationLevel}
                                        onChange={handleChange}
                                        name="educationLevel"
                                        required
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>

                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Institution
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your institution"
                                        value={formData.institution}
                                        name="institution"
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
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
                                        value={formData.fieldOfStudy}
                                        onChange={handleChange}
                                        name="fieldOfStudy"
                                        required
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>

                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Start Month
                                    </label>
                                    <input
                                        type="date"
                                        placeholder="Enter your start month"
                                        value={formData.startMonth}
                                        onChange={handleChange}
                                        name="startMonth"
                                        required
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>
                            </div>
                            <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    End Month
                                </label>
                                <input
                                    type="date"
                                    placeholder="Enter your end month"
                                    value={formData.finishMonth}
                                    name="finishMonth"
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>

                            <div className='mb-5 flex flex-col gap-6 xl:flex-row'>
                                <div className='w-full xl:w-1/2'>
                                    <button onClick={handleSubmit} className="flex w-full justify-center rounded-full bg-primary p-3 font-medium text-gray hover:bg-opacity-90" >
                                        Post Education
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

export default EditEducation;