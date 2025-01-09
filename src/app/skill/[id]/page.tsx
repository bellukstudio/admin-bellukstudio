"use client"

import Loader from "@/components-theme/common/Loader";
import ErrorMessage from "@/components/Errors/error-message";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useAuth } from "@/core/context/authContext";
import apiService from "@/core/response/apiResponse";
import { skillValidationSchema } from "@/core/validation/schemaValidation";
import { validateForm } from "@/core/validation/utility/validationForm";
import { Skill } from "@/types/sklill";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EditSkill = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { logout } = useAuth();
    const [formData, setFormData] = useState({
        skillName: "",
        level: "",
    });
    const [errorForm, setErrorForm] = useState<any[]>([]);
    const { id } = useParams();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const fetchSkill =async (id: string) => {
        try {
            const response = await apiService.get<{ skill: Skill }>(`/skill/${id}`);
            if (response.meta.code !== 200) {
                if (response.meta.message === "Unauthorized") {
                    logout();
                    router.push("/");
                }
                throw new Error(`Failed to fetch skill. ${response.meta.message}`);
            }
            setFormData(response.data.skill);
        } catch (error) {
            alert(error instanceof Error ? error.message : "An error occurred. Please try again.");
        }
    }

    useEffect(() => {
        if (typeof id === "string") {
            fetchSkill(id); // id is explicitly a string here
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const validationResponse = validateForm(skillValidationSchema, {
                skillName: formData.skillName,
                level: formData.level,
            });

            if (!validationResponse.success) {
                setErrorForm(validationResponse.errors);
                setLoading(false);
                throw new Error("Validation error");
            }


            const response = await apiService.update<{ skill: Skill }>(`/skill/${id}/update`, {
                'skillName': formData.skillName,
                'level': formData.level,
            });

            if (response.meta.code !== 200) {
                if (response.meta.message === "Unauthorized") {
                    logout();
                    router.push("/");
                }
                throw new Error(`Failed to update skill. ${response.meta.message}`);
            }
            alert(response.meta.message);
            router.push("/skill");


        } catch (error) {
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


                            <div className="mb-4.5">
                                <div className="w-full">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Skill Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your skill name"
                                        name="skillName"
                                        value={formData.skillName}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                    <ErrorMessage errors={errorForm} field="skillName" />
                                </div>
                            </div>
                            <div className="mb-4.5">
                                <div className="w-full">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Level
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your level"
                                        name="level"
                                        value={formData.level}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                    <ErrorMessage errors={errorForm} field="level" />
                                </div>
                            </div>


                            <div className='mb-5 flex flex-col gap-6 xl:flex-row'>
                                <div className='w-full xl:w-1/2'>
                                    <button onClick={handleSubmit} className="flex w-full justify-center rounded-full bg-primary p-3 font-medium text-gray hover:bg-opacity-90" >
                                        Post Skill
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


export default EditSkill;